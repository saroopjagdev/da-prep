import JSZip from "jszip";
import { describe, expect, it } from "vitest";
import { ExtractError, detectKind, extractDocumentText, tidy } from "@/lib/extract";

/** A minimal one-page PDF whose text is `line`. pdf.js rebuilds the cross-reference table, so offsets need not be exact. */
function pdfWith(line: string): Uint8Array {
  const stream = `BT /F1 12 Tf 72 720 Td (${line}) Tj ET`;
  const body = [
    "%PDF-1.4",
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj",
    `4 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj`,
    "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    "trailer << /Root 1 0 R /Size 6 >>",
    "%%EOF",
  ].join("\n");
  return new TextEncoder().encode(body);
}

async function docxWith(paragraphs: string[]): Promise<Uint8Array> {
  const zip = new JSZip();
  zip.file(
    "[Content_Types].xml",
    '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>',
  );
  zip.file(
    "_rels/.rels",
    '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
  );
  const paras = paragraphs.map((p) => `<w:p><w:r><w:t>${p}</w:t></w:r></w:p>`).join("");
  zip.file(
    "word/document.xml",
    `<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paras}</w:body></w:document>`,
  );
  return zip.generateAsync({ type: "uint8array" });
}

describe("detectKind", () => {
  it("recognises PDF and Word by their first bytes, not a name", async () => {
    expect(detectKind(pdfWith("hi"))).toBe("pdf");
    expect(detectKind(await docxWith(["hi"]))).toBe("docx");
  });
  it("rejects everything else", () => {
    expect(detectKind(new TextEncoder().encode("just some text"))).toBeNull();
    expect(detectKind(new Uint8Array([0x4d, 0x5a, 0x90, 0x00, 0x03]))).toBeNull(); // an .exe
    expect(detectKind(new Uint8Array())).toBeNull();
  });
});

describe("extractDocumentText", () => {
  it("reads the text of a PDF", async () => {
    const r = await extractDocumentText(pdfWith("Captain of the school robotics team"));
    expect(r.kind).toBe("pdf");
    expect(r.text).toContain("Captain of the school robotics team");
  });

  it("reads the paragraphs of a Word document", async () => {
    const r = await extractDocumentText(await docxWith(["Education: A-levels Maths A", "Volunteered 4 hours a week"]));
    expect(r.kind).toBe("docx");
    expect(r.text).toContain("Education: A-levels Maths A");
    expect(r.text).toContain("Volunteered 4 hours a week");
  });

  it("refuses a file that is neither", async () => {
    await expect(extractDocumentText(new TextEncoder().encode("plain text"))).rejects.toMatchObject({ status: 415 });
  });

  it("gives a friendly error for a corrupt file instead of crashing", async () => {
    const bad = new TextEncoder().encode("%PDF-1.4\nnot really a pdf");
    await expect(extractDocumentText(bad)).rejects.toBeInstanceOf(ExtractError);
    const zipOnly = await (async () => {
      const z = new JSZip();
      z.file("hello.txt", "hi");
      return z.generateAsync({ type: "uint8array" });
    })();
    await expect(extractDocumentText(zipOnly)).rejects.toBeInstanceOf(ExtractError);
  });
});

describe("tidy", () => {
  it("collapses blank space and drops control characters", () => {
    expect(tidy("a \u0000 b\r\n\r\n\r\n\r\nc  \t d")).toBe("a b\n\nc d");
  });
});

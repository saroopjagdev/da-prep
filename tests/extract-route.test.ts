import JSZip from "jszip";
import { beforeEach, describe, expect, it, vi } from "vitest";

const guard = vi.fn();
vi.mock("@/lib/server/guard", () => ({ guardAi: (...a: unknown[]) => guard(...a) }));

import { POST } from "@/app/api/extract/route";
import { cvOutput, mockCv } from "@/lib/cv";
import { reviewInput, reviewOutput, reviewSystem } from "@/lib/writing";
import { mockReview } from "@/lib/mocks";

async function docx(text: string) {
  const z = new JSZip();
  z.file("[Content_Types].xml", '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
  z.file("_rels/.rels", '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
  z.file("word/document.xml", `<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>${text}</w:t></w:r></w:p></w:body></w:document>`);
  return z.generateAsync({ type: "arraybuffer" });
}
const upload = (file?: File) => {
  const body = new FormData();
  if (file) body.append("file", file);
  return POST(new Request("http://x/api/extract", { method: "POST", body }));
};

beforeEach(() => {
  guard.mockReset();
  guard.mockResolvedValue({ ok: true, userId: "u1" });
});

describe("POST /api/extract", () => {
  it("returns the text of a Word file", async () => {
    const bytes = await docx("Captain of the school robotics team 2023 to 2025, twelve members");
    const res = await upload(new File([bytes], "cv.docx"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.kind).toBe("docx");
    expect(body.text).toContain("Captain of the school robotics team");
    expect(body.truncated).toBe(false);
  });

  it("stops at the sign-in and rate-limit gate before reading anything", async () => {
    guard.mockResolvedValue({ ok: false, response: Response.json({ error: "Sign in to use this feature." }, { status: 401 }) });
    const res = await upload(new File([new Uint8Array([1, 2, 3])], "cv.pdf"));
    expect(res.status).toBe(401);
  });

  it("rejects a missing, empty, oversized or wrong-type file", async () => {
    expect((await upload()).status).toBe(400);
    expect((await upload(new File([], "cv.pdf"))).status).toBe(400);
    expect((await upload(new File([new Uint8Array(4 * 1024 * 1024 + 1)], "cv.pdf"))).status).toBe(413);
    // The name says .pdf but the bytes are plain text: the type comes from the bytes, not the name.
    expect((await upload(new File(["just some words, not a pdf"], "cv.pdf", { type: "application/pdf" }))).status).toBe(415);
  });

  it("says so when a document has no text (for example a scan)", async () => {
    const res = await upload(new File([await docx("")], "scan.docx"));
    expect(res.status).toBe(422);
  });

  it("cuts very long documents and flags it", async () => {
    const res = await upload(new File([await docx("word ".repeat(3000))], "long.docx"));
    const body = await res.json();
    expect(body.truncated).toBe(true);
    expect(body.text.length).toBe(8000);
  });
});

describe("scores out of 100 and cover letters", () => {
  it("accepts 0 to 100 for the CV and the review, and nothing above", () => {
    expect(cvOutput.safeParse({ ...mockCv(), score: 85 }).success).toBe(true);
    expect(cvOutput.safeParse({ ...mockCv(), score: 101 }).success).toBe(false);
    expect(reviewOutput.safeParse({ ...mockReview(), score: 100 }).success).toBe(true);
    expect(reviewOutput.safeParse({ ...mockReview(), score: 101 }).success).toBe(false);
  });

  it("asks the model for a 0 to 100 score", () => {
    expect(reviewSystem("statement")).toContain("Score 0-100");
  });

  it("reviews a cover letter as its own kind", () => {
    expect(reviewInput.safeParse({ kind: "cover", text: "x".repeat(60) }).success).toBe(true);
    expect(reviewSystem("cover")).toContain("cover letter");
  });
});

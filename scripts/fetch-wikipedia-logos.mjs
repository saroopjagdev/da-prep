// Fetches each employer's full logo (symbol plus name where it has one) from its Wikipedia infobox, through the
// public MediaWiki API, into public/logos/<slug>.<ext>.
// Run: node scripts/fetch-wikipedia-logos.mjs [slug ...] [--out dir]   (default: every employer below)
//
// The infobox "logo" field is the logo the company itself uses. SVG is saved as is; a bitmap-only file is saved as
// the 600px version Wikipedia serves. Marks belong to their owners and are shown only to say which employers have
// a guide here; see docs/logo-sources.md.

import fs from "node:fs";
import path from "node:path";

const TITLES = {
  airbus: "Airbus",
  amazon: "Amazon (company)",
  arup: "Arup Group",
  atkinsrealis: "AtkinsRéalis",
  aviva: "Aviva",
  "bae-systems": "BAE Systems",
  "bank-of-america": "Bank of America",
  "bank-of-england": "Bank of England",
  barclays: "Barclays",
  bdo: "BDO Global",
  "bmw-group": "BMW",
  bny: "BNY",
  bt: "BT Group",
  capgemini: "Capgemini",
  cibc: "Canadian Imperial Bank of Commerce",
  cisco: "Cisco",
  citi: "Citigroup",
  deloitte: "Deloitte",
  "deutsche-bank": "Deutsche Bank",
  experian: "Experian",
  ey: "Ernst & Young",
  fca: "Financial Conduct Authority",
  "goldman-sachs": "Goldman Sachs",
  google: "Google",
  "grant-thornton": "Grant Thornton",
  hsbc: "HSBC",
  ibm: "IBM",
  jlr: "Jaguar Land Rover",
  "jp-morgan": "JPMorgan Chase",
  kpmg: "KPMG",
  lloyds: "Lloyds Banking Group",
  mazars: "Forvis Mazars",
  "metropolitan-police": "Metropolitan Police Service",
  microsoft: "Microsoft",
  "morgan-stanley": "Morgan Stanley",
  natwest: "NatWest Group",
  pwc: "PwC",
  "rolls-royce": "Rolls-Royce Holdings",
  rothschild: "Rothschild & Co",
  santander: "Santander UK",
  ubs: "UBS",
};

// Where the infobox logo is a symbol only or a photo, the full logo file to use instead (Wikipedia or Wikimedia Commons).
const FILES = {
  "bmw-group": "BMW.svg",
  "bank-of-england": "Bank of England letters.svg",
  "rolls-royce": "Rolls-Royce Group logo.svg",
};

const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
const OUT = path.resolve(outIdx >= 0 ? args.splice(outIdx, 2)[1] : path.join("public", "logos"));
const slugs = args.length ? args : Object.keys(TITLES);
const UA = "Level6LogoFetch/1.0 (https://www.level6.uk; saroopjagdev@gmail.com)";
const APIS = ["https://en.wikipedia.org/w/api.php", "https://commons.wikimedia.org/w/api.php"];

const api = async (params, base = APIS[0]) => {
  const r = await fetch(`${base}?${new URLSearchParams({ format: "json", formatversion: "2", ...params })}`, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`api ${r.status}`);
  return r.json();
};

async function logoFileName(title) {
  const j = await api({ action: "parse", page: title, prop: "wikitext", redirects: "1", section: "0" });
  const text = j.parse?.wikitext ?? "";
  const m = text.match(/\|\s*(?:logo|image|company_logo)\s*=\s*(?:\[\[)?\s*(?:File:|Image:)?\s*([^|\n\]]+?\.(?:svg|png|jpe?g|webp))/i);
  return m ? m[1].trim().replace(/_/g, " ") : null;
}

async function fileInfo(name) {
  for (const base of APIS) {
    const j = await api({ action: "query", titles: `File:${name}`, prop: "imageinfo", iiprop: "url|mime|size", iiurlwidth: "600" }, base);
    const ii = j.query?.pages?.[0]?.imageinfo?.[0];
    if (ii) return ii;
  }
  return null;
}

fs.mkdirSync(OUT, { recursive: true });
for (const slug of slugs) {
  const title = TITLES[slug];
  if (!title) { console.log(`${slug}: unknown slug`); continue; }
  try {
    const name = FILES[slug] ?? (await logoFileName(title));
    if (!name) { console.log(`${slug}: no logo in infobox`); continue; }
    const ii = await fileInfo(name);
    if (!ii) { console.log(`${slug}: file ${name} not found`); continue; }
    const svg = ii.mime === "image/svg+xml";
    const url = svg ? ii.url : ii.thumburl || ii.url;
    const ext = svg ? "svg" : ii.mime === "image/jpeg" ? "jpg" : "png";
    const r = await fetch(url, { headers: { "User-Agent": UA } });
    if (!r.ok) { console.log(`${slug}: download ${r.status}`); continue; }
    fs.writeFileSync(path.join(OUT, `${slug}.${ext}`), Buffer.from(await r.arrayBuffer()));
    console.log(`${slug}: ${name} (${ii.mime}, ${ii.width}x${ii.height})`);
  } catch (e) {
    console.log(`${slug}: ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 400));
}

// Fetches each employer's own published logo or icon from its public website into public/logos/<slug>.<ext>.
// Run: node scripts/fetch-logos.mjs [slug ...]   (no slugs = every employer below that does not have a logo yet)
//
// Order of preference: the Organization logo in the page's JSON-LD, an SVG icon, the largest apple-touch-icon, then the
// largest PNG icon. Images smaller than 48px or wider than 4:1 are skipped. Anything that blocks us stays a name on the
// banner. What was used is written to docs/logo-sources.md.

import fs from "node:fs";
import path from "node:path";

const SITES = {
  airbus: "https://www.airbus.com",
  amazon: "https://www.aboutamazon.co.uk",
  arup: "https://www.arup.com/en-gb",
  atkinsrealis: "https://www.atkinsrealis.com",
  aviva: "https://www.aviva.com",
  "bae-systems": "https://www.baesystems.com/en",
  "bank-of-england": "https://www.bankofengland.co.uk",
  bdo: "https://www.bdo.co.uk",
  bny: "https://www.bny.com",
  capgemini: "https://www.capgemini.com",
  citi: "https://www.citigroup.com",
  deloitte: "https://www2.deloitte.com/uk/en.html",
  experian: "https://www.experian.co.uk",
  ey: "https://www.ey.com",
  fca: "https://www.fca.org.uk",
  mazars: "https://www.forvismazars.com",
  "grant-thornton": "https://www.grantthornton.co.uk",
  ibm: "https://www.ibm.com/uk-en",
  "jp-morgan": "https://www.jpmorganchase.com",
  jlr: "https://www.jaguarlandrover.com",
  kpmg: "https://kpmg.com/uk",
  lloyds: "https://www.lloydsbankinggroup.com",
  "metropolitan-police": "https://www.met.police.uk",
  microsoft: "https://www.microsoft.com/en-gb",
  "morgan-stanley": "https://www.morganstanley.com",
  natwest: "https://www.natwest.com",
  pwc: "https://www.pwc.com",
  rothschild: "https://www.rothschildandco.com",
  santander: "https://www.santander.com",
  ubs: "https://www.ubs.com",
};

// Fetched once and rejected on inspection (a social-media image, a bare tab icon, a mascot, a half-empty canvas).
const REJECTED = new Set(["atkinsrealis", "mazars", "ibm", "natwest"]);
const DIR = path.join(process.cwd(), "public", "logos");
const UA = "Mozilla/5.0 (compatible; Level6LogoFetch/1.0; +https://www.level6.uk)";
const EXT = { "image/svg+xml": "svg", "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };

async function get(url, as = "text") {
  const res = await fetch(url, { headers: { "user-agent": UA, accept: "*/*" }, redirect: "follow", signal: AbortSignal.timeout(40000) });
  if (!res.ok) throw new Error(`${res.status}`);
  return as === "text" ? { body: await res.text(), type: res.headers.get("content-type") ?? "", url: res.url } : { body: Buffer.from(await res.arrayBuffer()), type: (res.headers.get("content-type") ?? "").split(";")[0].trim(), url: res.url };
}

const abs = (href, base) => {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
};

/** Candidate image URLs on a page, best first. */
function candidates(html, base) {
  const out = [];
  // JSON-LD Organization logo
  for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const walk = (n) => {
        if (!n || typeof n !== "object") return;
        if (Array.isArray(n)) return n.forEach(walk);
        const logo = n.logo;
        const type = JSON.stringify(n["@type"] ?? "");
        if (logo && /Organization|Corporation|LocalBusiness/.test(type)) {
          const u = typeof logo === "string" ? logo : logo.url ?? logo.contentUrl;
          if (u) out.push({ url: abs(u, base), why: "JSON-LD logo", rank: 0 });
        }
        Object.values(n).forEach(walk);
      };
      walk(JSON.parse(m[1]));
    } catch {
      /* ignore bad JSON-LD */
    }
  }
  // <link rel=icon ...>
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0];
    const rel = /rel=["']([^"']+)["']/i.exec(tag)?.[1]?.toLowerCase() ?? "";
    const href = /href=["']([^"']+)["']/i.exec(tag)?.[1];
    if (!href || !/icon/.test(rel)) continue;
    const sizes = /sizes=["'](\d+)x\d+["']/i.exec(tag)?.[1];
    const size = sizes ? Number(sizes) : 0;
    const u = abs(href, base);
    if (!u) continue;
    if (/\.svg(\?|$)/i.test(u) || /type=["']image\/svg/i.test(tag)) out.push({ url: u, why: "svg icon", rank: 1 });
    else if (rel.includes("apple-touch")) out.push({ url: u, why: `apple-touch-icon ${size || ""}`, rank: 2, size });
    else if (!/\.ico(\?|$)/i.test(u)) out.push({ url: u, why: `icon ${size || ""}`, rank: 3, size });
  }
  const seen = new Set();
  return out
    .filter((c) => c.url && !seen.has(c.url) && seen.add(c.url))
    .sort((a, b) => a.rank - b.rank || (b.size ?? 0) - (a.size ?? 0));
}

/** Width and height of a PNG, or null. */
function pngSize(b) {
  return b.length > 24 && b.readUInt32BE(0) === 0x89504e47 ? { w: b.readUInt32BE(16), h: b.readUInt32BE(20) } : null;
}

async function fetchLogo(slug, site) {
  const page = await get(site);
  for (const c of candidates(page.body, page.url)) {
    try {
      const img = await get(c.url, "bin");
      const ext = EXT[img.type] ?? (/\.svg/i.test(c.url) ? "svg" : null);
      if (!ext || img.body.length < 200 || img.body.length > 400_000) continue;
      if (ext === "png") {
        const d = pngSize(img.body);
        if (!d || d.w < 48 || d.h < 48 || d.w / d.h > 4 || d.h / d.w > 4) continue;
      }
      if (ext === "svg" && !/<svg/i.test(img.body.toString("utf8", 0, 600))) continue;
      return { ext, body: img.body, from: c.url, why: c.why };
    } catch {
      /* try the next candidate */
    }
  }
  return null;
}

fs.mkdirSync(DIR, { recursive: true });
const have = (slug) => ["svg", "png", "jpg", "webp"].some((e) => fs.existsSync(path.join(DIR, `${slug}.${e}`)));
const wanted = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SITES).filter((s) => !have(s) && !REJECTED.has(s));
const results = [];
for (const slug of wanted) {
  const site = SITES[slug];
  if (!site) continue;
  try {
    const r = await fetchLogo(slug, site);
    if (r) {
      fs.writeFileSync(path.join(DIR, `${slug}.${r.ext}`), r.body);
      results.push({ slug, ok: true, from: r.from, why: r.why });
      console.log(`ok    ${slug}  ${r.ext}  ${r.why}  ${r.from}`);
    } else {
      results.push({ slug, ok: false, why: "no usable image" });
      console.log(`none  ${slug}`);
    }
  } catch (e) {
    results.push({ slug, ok: false, why: String(e.message ?? e) });
    console.log(`fail  ${slug}  ${e.message ?? e}`);
  }
}
console.log(`\n${results.filter((r) => r.ok).length} of ${results.length} fetched`);
fs.writeFileSync(path.join(process.cwd(), "tmp-logo-results.json"), JSON.stringify(results, null, 1));

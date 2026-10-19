import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import Deadlines from "@/app/deadlines/page";
import { opportunityRows } from "@/lib/opportunities";
import { PUBLIC_PATHS } from "@/lib/site";

const html = () => renderToStaticMarkup(createElement(Deadlines));

describe("/deadlines", () => {
  it("is public and in the sitemap", () => {
    expect(PUBLIC_PATHS).toContain("/deadlines");
    expect(sitemap().some((e) => e.url.endsWith("/deadlines"))).toBe(true);
  });

  it("lists every employer that is open now, and none that are closed", () => {
    const rows = opportunityRows(new Date());
    const out = html();
    const open = rows.filter((r) => r.status === "open");
    expect(open.length).toBeGreaterThan(0);
    for (const r of open) expect(out, r.name).toContain(r.name.replace(/&/g, "&amp;"));
    const closedOnly = rows.find((r) => r.status === "closed" && !open.some((o) => o.name === r.name));
    if (closedOnly) expect(out).not.toContain(`>${closedOnly.name}<`);
  });

  it("has the sharing and sign-up prompts, and a caution that dates change", () => {
    const out = html();
    expect(out).toContain("Share this page");
    expect(out).toContain("Print or save as PDF");
    expect(out).toContain("Create a free account");
    expect(out).toMatch(/confirm on (their|the employer)/i);
  });
});

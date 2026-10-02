import { describe, expect, it } from "vitest";
import { redact } from "@/lib/redact";

describe("redacting personal details before AI", () => {
  it("removes emails, UK phone numbers, postcodes and NI numbers", () => {
    const out = redact(
      "Email me at jo.bloggs+cv@school.org.uk or call 07700 900123, +44 7700 900 123 or (020) 7946 0958. I live at 10 High St, LS1 4AP. NI: AB 12 34 56 C.",
    );
    expect(out).not.toMatch(/jo\.bloggs|07700|7946|LS1 4AP|AB 12/);
    expect(out.match(/\[phone removed\]/g)).toHaveLength(3);
    expect(out).toContain("[email removed]");
    expect(out).toContain("[postcode removed]");
    expect(out).toContain("[NI number removed]");
  });

  it("keeps figures, years, prices and normal words", () => {
    const text = "In 2025 I raised £1,250 for 120 people. Salary £25,200. BBB at A level, 120 UCAS points, 4.5 years, Q2 441 vs 420, call 999.";
    expect(redact(text)).toBe(text);
  });
});

describe("Supabase address", () => {
  it("reduces whatever was configured to the project origin", async () => {
    const { supabaseOrigin } = await import("@/lib/supabase-url");
    expect(supabaseOrigin("https://abc.supabase.co/rest/v1/")).toBe("https://abc.supabase.co");
    expect(supabaseOrigin(" https://abc.supabase.co/ ")).toBe("https://abc.supabase.co");
    expect(supabaseOrigin("https://abc.supabase.co")).toBe("https://abc.supabase.co");
    expect(supabaseOrigin("not a url")).toBeUndefined();
    expect(supabaseOrigin(undefined)).toBeUndefined();
  });
});

import { beforeEach, describe, expect, it } from "vitest";
import { mailLink, rememberNext, safeNext, takeNext } from "@/lib/after-auth";

const store = new Map<string, string>();
beforeEach(() => {
  store.clear();
  globalThis.localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  } as unknown as Storage;
});

describe("safeNext", () => {
  it("accepts a path on this site and nothing else", () => {
    expect(safeNext("/interview")).toBe("/interview");
    expect(safeNext("/games/balloon?x=1")).toBe("/games/balloon?x=1");
    for (const bad of ["https://evil.example/", "//evil.example", "javascript:alert(1)", "interview", "/login", "/login?mode=signup", "", null, undefined, "/" + "a".repeat(250)]) expect(safeNext(bad as string | null | undefined)).toBeNull();
  });
});

describe("remembering where to go", () => {
  it("keeps a safe path until it is taken, once", () => {
    rememberNext("/practice");
    expect(takeNext()).toBe("/practice");
    expect(takeNext()).toBeNull();
  });
  it("ignores an unsafe path", () => {
    rememberNext("https://evil.example/");
    expect(takeNext()).toBeNull();
  });
  it("never throws when storage is blocked", () => {
    globalThis.localStorage = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
      removeItem: () => {
        throw new Error("blocked");
      },
    } as unknown as Storage;
    expect(() => rememberNext("/practice")).not.toThrow();
    expect(takeNext()).toBeNull();
  });
});

describe("mailLink", () => {
  it("links the common inboxes and nothing for other addresses", () => {
    expect(mailLink("a@gmail.com")?.name).toBe("Gmail");
    expect(mailLink(" b@Outlook.com ")?.name).toBe("Outlook");
    expect(mailLink("c@hotmail.co.uk")?.name).toBe("Outlook");
    expect(mailLink("d@icloud.com")?.name).toBe("iCloud Mail");
    expect(mailLink("e@yahoo.co.uk")?.name).toBe("Yahoo Mail");
    expect(mailLink("f@school.example.org")).toBeNull();
    expect(mailLink("gmail.com@evil.example")).toBeNull();
  });
});

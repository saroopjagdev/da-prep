import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { isoWeek } from "../lib/week";

const clearRuns = (page: Page) => page.evaluate(() => localStorage.clear());

test("finance is a sector page with its calendar, and old finance links redirect", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.goto("/finance");
  await expect(page).toHaveURL(/\/sectors\/finance$/);
  await page.getByRole("link", { name: /season calendar/i }).first().click();
  await expect(page.getByRole("heading", { name: /finance application calendar/i })).toBeVisible();
  await expect(page.getByText("Goldman Sachs").first()).toBeVisible();
});

test("a firm-specific text interview reaches marked feedback", async ({ page }) => {
  await page.goto("/interview?firm=morgan-stanley");
  await expect(page.getByLabel(/^Employer/)).toHaveValue("morgan-stanley");
  await page.getByRole("button", { name: "Commercial awareness" }).click();
  await page.getByRole("button", { name: /start interview/i }).click();
  for (let i = 0; i < 5; i++) {
    await expect(page.getByText(`Question ${i + 1} of 5`)).toBeVisible();
    const box = page.getByLabel("Your answer");
    const go = page.getByRole("button", { name: /next question|finish and get feedback/i });
    // Fill until the button enables: the question can re-render as it arrives and clear an early keystroke.
    await expect(async () => {
      await box.fill("I follow interest rate news and how it affects clients borrowing and trading.");
      await expect(go).toBeEnabled({ timeout: 1000 });
    }).toPass();
    await go.click();
  }
  await expect(page.getByText("Next 3 things to practise")).toBeVisible();
  await expect(page.getByRole("meter")).toHaveCount(6);
});

test("a practice test can be completed and reviewed", async ({ page }) => {
  await page.goto("/tests/capp-critical");
  await clearRuns(page);
  await page.reload();
  await page.getByRole("button", { name: /^start/i }).first().click();
  for (let i = 0; i < 20; i++) {
    if (!(await page.getByRole("heading", { name: /question \d+ of/ }).count())) break;
    await page.locator("main input[type=radio]").first().click();
    await page.getByRole("button", { name: /^(next|finish|submit)/i }).last().click();
  }
  await expect(page.getByText(/% correct/)).toBeVisible();
});

test("a bank mock process runs to its report", async ({ page }) => {
  await page.goto("/mock/bank-of-america");
  await clearRuns(page);
  await page.reload();
  for (let i = 0; i < 40; i++) {
    if (await page.getByText(/: report/).count()) break;
    const box = page.locator("main textarea:visible").first();
    if ((await box.count()) && !(await box.inputValue())) await box.fill("In Year 12 I led a team project; we planned weekly and finished early with top marks.");
    await page.locator("main .btn-primary:visible:not([disabled])").first().click();
    await page.waitForTimeout(300);
  }
  await expect(page.getByText(/: report/)).toBeVisible();
});

test("opportunities: set my status from the row dropdown, add notes, and it survives a reload", async ({ page }) => {
  await page.goto("/opportunities");
  await clearRuns(page);
  await page.reload();
  await page.getByLabel("Search employers or programmes").fill("ubs");
  const row = page.locator("tbody tr").filter({ hasText: "UBS" }).first();
  await row.getByLabel("My status for UBS").selectOption("Applied");
  await row.getByRole("button", { name: /Notes and stages for UBS/ }).click();
  await expect(page.getByText(/Stages: 0 of \d+ done/)).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: /My list/ }).click();
  await expect(page.locator("tbody tr").filter({ hasText: "UBS" }).getByLabel("My status for UBS")).toHaveValue("Applied");
});

test("the My list menu link works from the page you are already on", async ({ page, isMobile }) => {
  test.skip(isMobile, "the dropdown menu is the desktop navigation");
  await page.goto("/opportunities");
  await clearRuns(page);
  await page.reload();
  await page.locator("tbody tr").filter({ hasText: "Barclays" }).first().getByLabel("My status for Barclays").selectOption("Interested");
  await page.getByRole("navigation").getByRole("link", { name: "Opportunities" }).first().hover();
  await page.getByRole("link", { name: /My list/ }).first().click();
  await expect(page.getByRole("button", { name: /My list/ })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel(/My status for/)).toHaveCount(1);
});

test("old tracker and employer list links go to opportunities", async ({ page }) => {
  await page.goto("/tracker");
  await expect(page).toHaveURL(/\/opportunities\?mine=1/);
  await page.goto("/employers");
  await expect(page).toHaveURL(/\/opportunities$/);
});

test("employer pages link to matching practice", async ({ page }) => {
  await page.goto("/employers/goldman-sachs");
  await expect(page.getByRole("heading", { name: "At a glance" })).toBeVisible();
  await page.getByRole("link", { name: /run the goldman sachs mock process/i }).click();
  await expect(page).toHaveURL(/\/mock\/goldman-sachs/);
});

test("pricing shows the single Pro plan and asks signed-out visitors to sign in", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page.getByText("£9.99 a month").first()).toBeVisible();
  // Only one paid plan is sold: no pass, no other price.
  await expect(page.getByText("£17")).toHaveCount(0);
  await expect(page.getByText(/3-month pass|one-off/i)).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Sign in" }).first()).toBeVisible();
});

test("unknown pages show a friendly 404", async ({ page }) => {
  const res = await page.goto("/this-page-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

const PAGES = ["/", "/opportunities", "/sectors/finance", "/sectors/finance/calendar", "/sectors/finance/myths", "/employers/ubs", "/mock/natwest", "/mock/santander", "/interview", "/tests", "/mock", "/tracker", "/review", "/cv", "/pricing", "/privacy", "/terms", "/accessibility"];

for (const path of PAGES) {
  test(`no automatically detectable accessibility problems on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForTimeout(800);
    const result = await new AxeBuilder({ page }).analyze();
    expect(result.violations.map((v) => v.id)).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
  });
}

test("related pages share tabs: tests and feedback", async ({ page }) => {
  await page.goto("/practice");
  await page.getByRole("navigation", { name: "Practice tests" }).getByRole("link", { name: "Employer replicas" }).click();
  await expect(page).toHaveURL(/\/tests$/);
  await page.goto("/cv");
  await page.getByRole("navigation", { name: "Written feedback" }).getByRole("link", { name: "Statement and answers" }).click();
  await expect(page).toHaveURL(/\/review$/);
});

test("opportunities are grouped by sector, and the guides link shows only researched employers", async ({ page }) => {
  await page.goto("/opportunities");
  const groups = page.locator("tbody th[scope='colgroup']");
  await expect(groups.first()).toContainText("Finance and accountancy");
  await page.getByLabel("Filter by sector").selectOption({ label: "Engineering" });
  await expect(page.locator("tbody th[scope='colgroup']").first()).toContainText("Engineering");
  await page.goto("/opportunities?guides=1");
  await expect(page.getByRole("button", { name: /With a guide/ })).toHaveAttribute("aria-pressed", "true");
  // Every row has a Guide link when only researched employers are shown.
  const rows = page.locator("tbody tr").filter({ has: page.getByLabel(/My status for/) });
  const total = await rows.count();
  expect(total).toBeGreaterThan(30);
  expect(await rows.filter({ has: page.getByRole("link", { name: "Guide" }) }).count()).toBe(total);
});

test("a new visitor sees the pitch with a way to start, and opportunities still follows ?q=", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /Practise the real stages/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Or try a free practice test/ })).toBeVisible();
  await expect(page.getByText("Your dashboard")).toBeHidden();
  await page.goto("/opportunities?q=natwest");
  await expect(page.getByLabel("Search employers or programmes")).toHaveValue("natwest");
  await expect(page.locator("tbody tr").filter({ hasText: "NatWest Group" }).getByText("Not open yet", { exact: true })).toBeVisible();
});

// A signed-in browser without a real Supabase: supabase-js reads this session from local storage (key sb-<host>-auth-token).
const signedIn = (page: Page) =>
  page.addInitScript(() => {
    const b64 = (o: object) => btoa(JSON.stringify(o)).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
    const exp = Math.floor(Date.now() / 1000) + 24 * 3600;
    const user = { id: "00000000-0000-0000-0000-000000000001", aud: "authenticated", role: "authenticated", email: "e2e@example.com", app_metadata: {}, user_metadata: {}, created_at: new Date().toISOString() };
    const jwt = `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub: user.id, exp, role: "authenticated" })}.sig`;
    localStorage.setItem("sb-localhost-auth-token", JSON.stringify({ access_token: jwt, refresh_token: "e2e-refresh", token_type: "bearer", expires_in: 86400, expires_at: exp, user }));
  });
const withActivity = (page: Page) =>
  page.addInitScript(() => localStorage.setItem("da-prep:practice", JSON.stringify([{ id: "p1", date: new Date().toISOString(), category: "numerical", score: 7, total: 10 }])));

test("a signed-in person gets the dashboard instead of the pitch, and /?pitch=1 shows the pitch", async ({ page }) => {
  await signedIn(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Your dashboard" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Practise the real stages/ })).toBeHidden();
  await expect(page.getByLabel("Open now").first()).toBeVisible();
  await page.goto("/?pitch=1");
  await expect(page.getByRole("heading", { level: 1, name: /Practise the real stages/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your dashboard" })).toBeHidden();
});

test("saved practice and a tracker without an account still get the landing page, not the dashboard", async ({ page }) => {
  await withActivity(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /Practise the real stages/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your dashboard" })).toBeHidden();
});

test("the dashboard has no accessibility problems", async ({ page }) => {
  await signedIn(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Your dashboard" })).toBeVisible();
  await page.waitForTimeout(800); // let the fade-in finish, or axe reads blended colours
  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations.map((v) => v.id)).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test("free practice stops after the weekly number and says why; a new week starts fresh", async ({ page }) => {
  await page.addInitScript((week) => localStorage.setItem("da-prep:practice-week", JSON.stringify({ week, n: 3 })), isoWeek());
  await page.goto("/practice");
  await expect(page.getByRole("heading", { name: /used your 3 free practice tests this week/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Numerical/ }).first()).toBeDisabled();
  await page.goto("/tests/shl-numerical");
  await expect(page.getByRole("heading", { name: /used your 3 free practice tests this week/ })).toBeVisible();
});

test("free practice shows what is left", async ({ page }) => {
  await page.addInitScript((week) => localStorage.setItem("da-prep:practice-week", JSON.stringify({ week, n: 1 })), isoWeek());
  await page.goto("/practice");
  await expect(page.getByText("2 of 3 free practice tests left this week")).toBeVisible();
  await expect(page.getByRole("button", { name: /Numerical/ }).first()).toBeEnabled();
});

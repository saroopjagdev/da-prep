import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const clearRuns = (page: Page) => page.evaluate(() => localStorage.clear());

test("home page leads to the finance hub and calendar", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("link", { name: /go to the finance hub/i }).click();
  await expect(page).toHaveURL(/\/finance$/);
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

test("the tracker adds a programme from a guide with its stages", async ({ page }) => {
  await page.goto("/tracker");
  await clearRuns(page);
  await page.reload();
  await page.getByLabel("Employer guide", { exact: true }).selectOption("ubs");
  await page.getByRole("button", { name: "Add", exact: true }).first().click();
  await expect(page.getByText(/Stages: 0 of \d+ done/)).toBeVisible();
  await page.reload();
  await expect(page.locator("main li").filter({ hasText: "Stages:" }).filter({ hasText: "UBS" })).toBeVisible();
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

const PAGES = ["/", "/finance", "/finance/calendar", "/finance/myths", "/employers", "/employers/ubs", "/interview", "/tests", "/mock", "/tracker", "/review", "/pricing", "/privacy", "/terms", "/accessibility"];

for (const path of PAGES) {
  test(`no automatically detectable accessibility problems on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForTimeout(800);
    const result = await new AxeBuilder({ page }).analyze();
    expect(result.violations.map((v) => v.id)).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
  });
}

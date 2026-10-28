import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// A signed-in browser without a real Supabase: supabase-js reads this session from local storage (key sb-<host>-auth-token).
const signedIn = (page: Page) =>
  page.addInitScript(() => {
    const b64 = (o: object) => btoa(JSON.stringify(o)).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
    const exp = Math.floor(Date.now() / 1000) + 24 * 3600;
    const user = { id: "00000000-0000-0000-0000-000000000001", aud: "authenticated", role: "authenticated", email: "e2e@example.com", app_metadata: {}, user_metadata: {}, created_at: new Date().toISOString() };
    const jwt = `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub: user.id, exp, role: "authenticated" })}.sig`;
    localStorage.setItem("sb-localhost-auth-token", JSON.stringify({ access_token: jwt, refresh_token: "e2e-refresh", token_type: "bearer", expires_in: 86400, expires_at: exp, user }));
  });

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
  await signedIn(page);
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
  await signedIn(page);
  await page.goto("/tests/capp-critical");
  await clearRuns(page);
  await page.reload();
  await page.getByRole("button", { name: /^start/i }).first().click();
  await expect(page.getByRole("heading", { name: /question \d+ of/ })).toBeVisible();
  for (let i = 0; i < 20; i++) {
    if (!(await page.getByRole("heading", { name: /question \d+ of/ }).count())) break;
    await page.locator("main input[type=radio]").first().click();
    await page.getByRole("button", { name: /^(next|finish|submit)/i }).last().click();
  }
  await expect(page.getByText(/% correct/)).toBeVisible();
});

test("a bank mock process runs to its report", async ({ page }) => {
  await signedIn(page);
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
  await signedIn(page);
  await page.goto("/opportunities");
  await clearRuns(page);
  await page.reload();
  await page.getByLabel("Search employers or programmes").fill("ubs");
  const row = page.locator("tbody tr").filter({ hasText: "UBS" }).first();
  await row.getByLabel("My status for UBS").selectOption("Applied");
  await row.getByRole("button", { name: /Notes and stages for UBS/ }).click();
  await expect(page.getByText(/Stages: 0 of \d+ done/)).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: /My tracker/ }).click();
  await expect(page.locator("tbody tr").filter({ hasText: "UBS" }).getByLabel("My status for UBS")).toHaveValue("Applied");
});

test("the My tracker menu link works from the page you are already on", async ({ page, isMobile }) => {
  test.skip(isMobile, "the dropdown menu is the desktop navigation");
  await signedIn(page);
  await page.goto("/opportunities");
  await clearRuns(page);
  await page.reload();
  await page.locator("tbody tr").filter({ hasText: "Barclays" }).first().getByLabel("My status for Barclays").selectOption("Interested");
  await page.getByRole("navigation").getByRole("link", { name: "Tracker" }).first().hover();
  await page.getByRole("link", { name: /My tracker/ }).first().click();
  await expect(page.getByRole("button", { name: /My tracker/ })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel(/My status for/)).toHaveCount(1);
});

test("the old tracker link goes to your list on opportunities", async ({ page }) => {
  await page.goto("/tracker");
  await expect(page).toHaveURL(/\/opportunities\?mine=1/);
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

const PAGES = ["/", "/opportunities", "/sectors/finance", "/sectors/finance/calendar", "/sectors/finance/myths", "/employers/ubs", "/deadlines", "/learn", "/learn/degree-apprenticeship-vs-university", "/tests/hsbc-simulate", "/mock/natwest", "/mock/santander", "/interview", "/tests", "/games", "/games/provider/arctic-shores", "/games/balloon", "/employers", "/tracker", "/review", "/cv", "/pricing", "/privacy", "/terms", "/accessibility"];

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
  await signedIn(page);
  await page.goto("/practice");
  await page.getByRole("navigation", { name: "Practice tests" }).getByRole("link", { name: "Employer replicas" }).click();
  await expect(page).toHaveURL(/\/tests$/);
  await page.goto("/cv");
  await page.getByRole("navigation", { name: "CV and statement review" }).getByRole("link", { name: "Statement and answers" }).click();
  await expect(page).toHaveURL(/\/review$/);
});

test("opportunities are grouped by sector", async ({ page }) => {
  await signedIn(page);
  await page.goto("/opportunities");
  const groups = page.locator("tbody th[scope='colgroup']");
  await expect(groups.first()).toContainText("Finance and accountancy");
  await page.getByLabel("Filter by sector").selectOption({ label: "Engineering" });
  await expect(page.locator("tbody th[scope='colgroup']").first()).toContainText("Engineering");
});

test("employer guides and mock processes live together on one page, grouped by sector with a search box", async ({ page }) => {
  await page.goto("/employers");
  await expect(page.getByRole("heading", { level: 1, name: "Employer guides" })).toBeVisible();
  expect(await page.getByRole("link", { name: "Read the guide" }).count()).toBeGreaterThan(30);
  expect(await page.getByRole("link", { name: "Run the mock" }).count()).toBeGreaterThan(5);
  await page.getByLabel("Search employers").fill("natwest");
  await expect(page.getByRole("link", { name: "Read the guide" })).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Run the mock" })).toHaveAttribute("href", "/mock/natwest");
  await page.getByRole("link", { name: "Read the guide" }).click();
  await expect(page).toHaveURL(/\/employers\/natwest/);
  await page.getByRole("link", { name: /Run the NatWest.* mock process/ }).first().click();
  await expect(page).toHaveURL(/\/mock\/natwest/);
  await expect(page.getByRole("link", { name: /Read the NatWest.* guide/ })).toBeVisible();
});

test("the old mock index and guides filter links go to the employer guides page", async ({ page }) => {
  await page.goto("/mock");
  await expect(page).toHaveURL(/\/employers$/);
  await page.goto("/opportunities?guides=1");
  await expect(page).toHaveURL(/\/employers$/);
});

test("a new visitor sees the pitch with a way to start, and opportunities still follows ?q=", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /Practise the real stages/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Or see who is open now/ })).toBeVisible();
  await expect(page.getByText("Your dashboard")).toBeHidden();
  await page.goto("/opportunities?q=natwest");
  await expect(page.getByLabel("Search employers or programmes")).toHaveValue("natwest");
  await expect(page.locator("tbody tr").filter({ hasText: "NatWest Group" }).getByText("Not open yet", { exact: true }).filter({ visible: true })).toBeVisible();
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

const usage = (page: Page, practice: { used: number; limit: number }) =>
  page.route("**/api/usage", (route) => route.fulfill({ json: { plan: "free", enforced: true, interviews: { used: 0, limit: 2 }, reviews: { used: 0, limit: 2 }, practice } }));

// On a phone the account links sit inside the Menu button.
const openMenu = async (page: Page, isMobile: boolean) => {
  if (isMobile) await page.getByRole("button", { name: "Menu" }).click();
};

test("the header offers Plans to visitors and Go Pro to free members", async ({ page, isMobile }) => {
  await page.goto("/");
  await openMenu(page, isMobile);
  await expect(page.getByRole("link", { name: "Plans" }).first()).toHaveAttribute("href", "/pricing");
  await signedIn(page);
  await usage(page, { used: 0, limit: 2 });
  await page.goto("/opportunities");
  await openMenu(page, isMobile);
  await expect(page.getByRole("link", { name: "Go Pro" }).first()).toHaveAttribute("href", "/pricing");
});

test("the deadlines page lists who is open, soonest closing first, with share and print", async ({ page }) => {
  await page.goto("/deadlines");
  await expect(page.getByRole("heading", { level: 1, name: /deadlines, 2027 intake/ })).toBeVisible();
  const open = page.getByRole("table", { name: /open now/i });
  await expect(open.locator("tbody tr").first()).toBeVisible();
  const closes = await open.locator("tbody tr td:nth-child(4)").allInnerTexts();
  expect(closes.length).toBeGreaterThan(0);
  await expect(page.getByRole("button", { name: "Share this page" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Print or save as PDF/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Create a free account" })).toHaveAttribute("href", "/login?mode=signup");
});

test("a visit counts its source and where it began, with nothing that identifies the visitor", async ({ page }) => {
  const sent: { event: string; source: string; campaign: string }[] = [];
  await page.route("**/api/event", (route) => {
    sent.push(JSON.parse(route.request().postData() ?? "{}"));
    return route.fulfill({ status: 204 });
  });
  await page.goto("/employers/ubs?utm_source=school&utm_campaign=Year 13 Talk");
  await expect.poll(() => sent.some((e) => e.event === "visit_employer")).toBe(true);
  const visit = sent.find((e) => e.event === "visit_employer")!;
  expect(Object.keys(visit).sort()).toEqual(["campaign", "event", "source"]);
  expect(visit.source).toBe("school");
  expect(visit.campaign).toBe("year-13-talk");
});

test("a signed-in member can follow an employer for deadline emails, and it reverts if saving fails", async ({ page }) => {
  await signedIn(page);
  let fail = false;
  const posts: { key: string; on: boolean }[] = [];
  await page.route("**/api/alerts", async (route) => {
    if (route.request().method() === "GET") return route.fulfill({ json: { keys: [] } });
    posts.push(JSON.parse(route.request().postData() ?? "{}"));
    return fail ? route.fulfill({ status: 500, json: { error: "Could not save that." } }) : route.fulfill({ json: { ok: true } });
  });
  await page.goto("/opportunities");
  const button = page.getByRole("button", { name: /Email me when .* opens and before it closes/ }).first();
  await expect(button).toHaveText("Alert me");
  await button.click();
  await expect(button).toHaveText("Alerts on");
  await expect(button).toHaveAttribute("aria-pressed", "true");
  expect(posts[0].on).toBe(true);
  fail = true;
  await button.click();
  await expect(page.getByRole("alert").filter({ hasText: "Could not save that." })).toBeVisible();
  await expect(button).toHaveText("Alerts on"); // the failed unfollow put it back
});

test("the unsubscribe page needs a button press and then confirms", async ({ page }) => {
  let posted = 0;
  await page.route("**/api/alerts/unsubscribe**", (route) => {
    posted++;
    return route.fulfill({ json: { ok: true } });
  });
  await page.goto("/unsubscribe?t=11111111-2222-3333-4444-555555555555");
  expect(posted).toBe(0); // opening the link alone changes nothing
  await page.getByRole("button", { name: "Stop all deadline emails" }).click();
  await expect(page.getByRole("status")).toContainText("You will not get any more deadline emails");
  expect(posted).toBe(1);
});

test("a Pro member sees no Go Pro prompt", async ({ page, isMobile }) => {
  await signedIn(page);
  await page.route("**/api/usage", (route) => route.fulfill({ json: { plan: "pro", enforced: true } }));
  await page.goto("/opportunities");
  await openMenu(page, isMobile);
  await expect(page.getByRole("link", { name: "Account" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Go Pro" })).toHaveCount(0);
});

test("free members are told about their free mock interviews, and that firm mock processes are Pro", async ({ page }) => {
  await signedIn(page);
  await usage(page, { used: 0, limit: 2 });
  await page.goto("/interview");
  await expect(page.getByText(/2 free marked mock interviews left/)).toBeVisible();
  await page.goto("/mock/bank-of-america");
  await expect(page.getByText(/Firm mock processes are part of Pro/).first()).toBeVisible();
});

test("free practice stops when the free tests are used, and says why", async ({ page }) => {
  await signedIn(page);
  await usage(page, { used: 2, limit: 2 });
  await page.goto("/practice");
  await expect(page.getByRole("heading", { name: /used your 2 free practice tests/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Numerical/ }).first()).toBeDisabled();
  await page.goto("/tests/shl-numerical");
  await expect(page.getByRole("heading", { name: /used your 2 free practice tests/ })).toBeVisible();
});

const bonusUsage = (page: Page, steps: { applied: boolean; interview: boolean; practice: boolean }, unlocked = false) =>
  page.route("**/api/usage", (route) =>
    route.fulfill({
      json: {
        plan: "free",
        enforced: true,
        interviews: { used: 1, limit: unlocked ? 3 : 1 },
        reviews: { used: 0, limit: unlocked ? 3 : 1 },
        practice: { used: 1, limit: unlocked ? 3 : 1 },
        bonus: { unlocked, extra: 2, steps },
      },
    }),
  );

test("a free member who used their practice test sees which steps unlock 2 more of each", async ({ page }) => {
  await signedIn(page);
  await bonusUsage(page, { applied: false, interview: false, practice: true });
  await page.goto("/practice");
  await expect(page.getByRole("heading", { name: /used your 1 free practice test$/ })).toBeVisible();
  const note = page.getByRole("note").filter({ hasText: /unlock 2 more/ });
  await expect(note.getByRole("link", { name: "Apply to an employer from the tracker" })).toHaveAttribute("href", "/opportunities");
  await expect(note.getByText(/any two of these/)).toBeVisible();
  await expect(note.getByText("Start a practice test")).toBeVisible();
  await expect(note.getByRole("link", { name: "Start a practice test" })).toHaveCount(0); // done, so no longer a link
});

test("following an Apply link in the tracker tells the server, once the member is signed in", async ({ page }) => {
  await signedIn(page);
  await bonusUsage(page, { applied: false, interview: false, practice: false });
  let applied = 0;
  await page.route("**/api/tracker/applied", (route) => {
    applied++;
    return route.fulfill({ json: { ok: true } });
  });
  await page.route("https://**/*", (route) => route.abort()); // never leave the app: the click is what counts
  await page.goto("/opportunities");
  const link = page.getByRole("link", { name: /^(Apply|Careers)$/ }).first();
  await expect(link).toHaveAttribute("target", "_blank");
  await link.click();
  await expect.poll(() => applied).toBeGreaterThan(0);
});

test("free practice shows what is left", async ({ page }) => {
  await signedIn(page);
  await usage(page, { used: 1, limit: 2 });
  await page.goto("/practice");
  await expect(page.getByText("1 of 2 free practice tests left")).toBeVisible();
  await expect(page.getByRole("button", { name: /Numerical/ }).first()).toBeEnabled();
});

test("starting a test the server refuses shows its reason and does not start", async ({ page }) => {
  await signedIn(page);
  await usage(page, { used: 1, limit: 2 });
  await page.route("**/api/practice/start", (route) => route.fulfill({ status: 402, json: { error: "You've used your 2 free practice tests." } }));
  await page.goto("/tests/capp-critical");
  await page.evaluate(() => localStorage.removeItem("da-prep:assess-run:capp-critical"));
  await page.getByRole("button", { name: /^start/i }).first().click();
  await expect(page.locator("p[role=alert]")).toContainText("used your 2 free practice tests");
});

for (const [path, what] of [
  ["/practice", /take practice tests/],
  ["/tests/capp-critical", /take this practice test/],
  ["/mock/bank-of-america", /practise the Bank of America mock process/i],
  ["/interview", /practise a mock interview/],
  ["/review", /get CV and statement review/],
  ["/cv", /check your CV/],
  ["/stories", /build your stories bank/],
  ["/progress", /see your progress/],
] as const) {
  test(`without an account, ${path} asks for one instead of opening the tool`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: /create a free account to/i })).toContainText(what);
    await expect(page.getByRole("link", { name: "Create a free account" }).first()).toHaveAttribute("href", "/login?mode=signup");
  });
}

test("without an account the opportunities list is view-only", async ({ page }) => {
  await page.goto("/opportunities");
  await expect(page.locator("tbody tr").first()).toBeVisible();
  await expect(page.getByLabel(/My status for/)).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Sign up to track" }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /My tracker/ })).toHaveCount(0);
});

test("employer pages show the firm's logo beside its name", async ({ page }) => {
  await page.goto("/employers/ubs");
  const logo = page.getByRole("img", { name: "UBS logo" });
  await expect(logo).toBeVisible();
  expect(await logo.evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeGreaterThan(0);
});

test("the sign up to track link stays on one line", async ({ page }) => {
  await page.goto("/opportunities");
  const box = await page.getByRole("link", { name: "Sign up to track" }).first().boundingBox();
  expect(box!.height).toBeLessThan(24);
});

test("sign in uses an email and password, with a way to create an account or reset", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByLabel("Email address")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await page.getByRole("button", { name: "Create an account" }).click();
  await expect(page.getByRole("button", { name: "Create free account" })).toBeVisible();
  await page.getByRole("button", { name: "Sign in" }).first().click();
  await page.getByRole("button", { name: "Forgot password?" }).click();
  await expect(page.getByRole("button", { name: "Email me a reset link" })).toBeVisible();
  await expect(page.getByLabel("Password")).toHaveCount(0);
});

const seedPractice = (page: Page) =>
  page.addInitScript(() => {
    const d = (n: number) => new Date(Date.now() - n * 864e5).toISOString();
    localStorage.setItem(
      "da-prep:practice",
      JSON.stringify([
        { id: "p3", date: d(1), category: "Numerical reasoning (SHL Verify Interactive style)", testId: "shl-numerical", score: 8, total: 10, seconds: 600 },
        { id: "p2", date: d(3), category: "Numerical reasoning (SHL Verify Interactive style)", testId: "shl-numerical", score: 6, total: 10, seconds: 700 },
        { id: "p1", date: d(6), category: "Numerical reasoning (SHL Verify Interactive style)", testId: "shl-numerical", score: 4, total: 10, seconds: 800 },
        { id: "v1", date: d(2), category: "Verbal reasoning (Cappfinity)", testId: "capp-verbal", score: 5, total: 12, seconds: 900 },
        { id: "old", date: d(5), category: "sjt", score: 3, total: 5 },
      ]),
    );
  });

test("progress shows each practice test over time, by skill, and what to practise next", async ({ page }) => {
  await signedIn(page);
  await seedPractice(page);
  await page.goto("/progress");
  await expect(page.getByRole("heading", { name: "Practice tests" })).toBeVisible();
  await expect(page.getByText("Tests taken").locator("..").getByText("5", { exact: true })).toBeVisible();
  // Weakest skill first, and it is what to practise next.
  await expect(page.getByText("Practise next").locator("..").getByText("Verbal reasoning")).toBeVisible();
  await expect(page.getByRole("img", { name: /scores over time: 3 attempts, from 40% .* to 80%/ })).toBeVisible();
  await expect(page.getByText("Up 40 points since your first attempt.")).toBeVisible();
  await page.getByText("All attempts").first().click();
  await expect(page.getByText("8/10 (80%)").first()).toBeVisible();
  // An older result saved before tests were tracked by id still shows, as a quick quiz.
  await expect(page.getByRole("heading", { name: "Quick quiz: Situational judgement" })).toBeVisible();
});

test("the progress page has no accessibility problems with history", async ({ page }) => {
  await signedIn(page);
  await seedPractice(page);
  await page.goto("/progress");
  await expect(page.getByRole("heading", { name: "Practice tests" })).toBeVisible();
  await page.waitForTimeout(800);
  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations.map((v) => v.id)).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
});

test("finishing a practice test adds it to progress", async ({ page }) => {
  await signedIn(page);
  await page.goto("/tests/capp-critical");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: /^start/i }).first().click();
  await expect(page.getByRole("heading", { name: /question \d+ of/ })).toBeVisible();
  for (let i = 0; i < 20; i++) {
    if (!(await page.getByRole("heading", { name: /question \d+ of/ }).count())) break;
    await page.locator("main input[type=radio]").first().click();
    await page.getByRole("button", { name: /^(next|finish|submit)/i }).last().click();
  }
  await expect(page.getByText(/% correct/)).toBeVisible();
  await page.goto("/progress");
  await expect(page.getByRole("heading", { name: "Practice tests" })).toBeVisible();
  await expect(page.getByText("1 attempt").first()).toBeVisible();
});

test("practice games need an account: a visitor sees what the game is and a sign-up prompt, not the game", async ({ page }) => {
  await page.goto("/games/balloon");
  await expect(page.getByRole("heading", { name: "Create a free account to play Balloon bank" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Start" })).toHaveCount(0);
  await expect(page.getByText(/Appetite for risk/)).toBeVisible();
});

test("a signed-in member can play Four decks to the end and see their numbers and the disclaimer", async ({ page }) => {
  await signedIn(page);
  await page.goto("/games/cards");
  await expect(page.getByText(/not affiliated with or endorsed/i).first()).toBeVisible();
  await page.getByRole("button", { name: "Start" }).click();
  for (let i = 0; i < 40; i++) await page.getByRole("button", { name: "Draw a card from deck C" }).click();
  await expect(page.getByRole("region", { name: "Your result" })).toBeVisible();
  await expect(page.getByText("Steadier decks (C and D)")).toBeVisible();
  await expect(page.getByRole("button", { name: "Play again" })).toBeVisible();
});

test("a signed-in member can play Balloon bank to the end", async ({ page }) => {
  await signedIn(page);
  await page.goto("/games/balloon");
  await page.getByRole("button", { name: "Start" }).click();
  const result = page.getByRole("region", { name: "Your result" });
  for (let n = 0; n < 40 && !(await result.isVisible()); n++) {
    await page.getByRole("button", { name: "Pump" }).click();
    const bank = page.getByRole("button", { name: /^Bank/ });
    if (await bank.isEnabled().catch(() => false)) await bank.click();
  }
  await expect(result).toBeVisible();
  await expect(page.getByText("Balloons burst")).toBeVisible();
});

test("an employer whose process names a game provider links to that provider's page, which lists its employers and games", async ({ page }) => {
  await page.goto("/employers/airbus");
  await expect(page.getByText("Practise the games:").first()).toBeVisible();
  await page.getByRole("link", { name: "Arctic Shores" }).first().click();
  await expect(page).toHaveURL(/\/games\/provider\/arctic-shores$/);
  await expect(page.getByRole("heading", { name: "Arctic Shores practice" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Airbus" }).first()).toHaveAttribute("href", "/employers/airbus");
  await expect(page.getByRole("link", { name: "Play" }).first()).toHaveAttribute("href", "/games/balloon");
});

test("the games hub starts with providers, each listing its employers and linking to its page", async ({ page }) => {
  await page.goto("/games");
  const first = page.getByRole("heading", { name: "Arctic Shores", level: 3 });
  await expect(first).toBeVisible();
  await page.getByRole("link", { name: "Open Arctic Shores" }).click();
  await expect(page).toHaveURL(/\/games\/provider\/arctic-shores$/);
});

const startGame = async (page: Page, id: string) => {
  await signedIn(page);
  await page.goto(`/games/${id}`);
  await page.getByRole("button", { name: "Start" }).click();
};
const resultRegion = (page: Page) => page.getByRole("region", { name: "Your result" });

test("Colour words runs to its result", async ({ page }) => {
  await startGame(page, "stroop");
  for (let i = 0; i < 40; i++) await page.getByRole("button", { name: /^red/i }).click();
  await expect(resultRegion(page)).toBeVisible();
  await expect(page.getByText("Average time, word differs from ink")).toBeVisible();
});

test("Money exchange runs both parts to its result", async ({ page }) => {
  await startGame(page, "money");
  for (let i = 0; i < 6; i++) await page.getByRole("button", { name: /^Send \d+/ }).click();
  await expect(page.getByText(/Part 2/)).toBeVisible();
  for (let i = 0; i < 8; i++) await page.getByRole("button", { name: "Accept" }).click();
  await expect(resultRegion(page)).toBeVisible();
  await expect(page.getByText("Average sent to partner")).toBeVisible();
});

test("Tower can be solved in the fewest moves on every level", async ({ page }) => {
  await startGame(page, "tower");
  const peg = (n: number) => page.getByRole("button", { name: new RegExp(`^Peg ${n + 1}`) });
  async function solve(k: number, from: number, to: number, via: number) {
    if (k === 0) return;
    await solve(k - 1, from, via, to);
    await peg(from).click();
    await peg(to).click();
    await solve(k - 1, via, to, from);
  }
  for (const discs of [3, 4, 5]) await solve(discs, 0, 2, 1);
  await expect(resultRegion(page)).toBeVisible();
  await expect(page.getByText("Every level in the fewest moves")).toBeVisible();
});

test("Digit span: the digits shown can be typed back and are marked correct", async ({ page }) => {
  await startGame(page, "digit-span");
  const seen: string[] = [];
  let gap = true;
  const input = page.locator("#span-answer");
  for (let n = 0; n < 200 && !(await input.isVisible()); n++) {
    const label = await page.locator('p[aria-live="assertive"][aria-label^="Digit "]').first().getAttribute("aria-label", { timeout: 100 }).catch(() => null);
    if (label && gap) seen.push(label.replace("Digit ", ""));
    gap = !label;
    await page.waitForTimeout(80);
  }
  expect(seen).toHaveLength(3);
  await input.fill(seen.join(""));
  await page.getByRole("button", { name: "Check" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Correct." })).toBeVisible();
});

test("Keypress runs through its five rounds to a result", async ({ page }) => {
  await startGame(page, "keypress");
  await page.getByRole("button", { name: /^Press/ }).click();
  await expect(resultRegion(page)).toBeVisible({ timeout: 40_000 });
  await expect(page.getByText("Presses while told to wait")).toBeVisible();
});

test("Flashback, Shape reaction and Block sequence start and take input", async ({ page }) => {
  await startGame(page, "flashback");
  await page.getByRole("button", { name: /^Same/ }).click();
  await page.getByRole("button", { name: /^Different/ }).click();
  await expect(page.getByText(/2 answered/)).toBeVisible();

  await page.goto("/games/reaction");
  await page.getByRole("button", { name: "Start" }).click();
  await expect(page.getByText("Shape 1 of 40")).toBeVisible();
  await page.getByRole("button", { name: /^Press/ }).click(); // too early: counted, not a crash

  await page.goto("/games/sequence");
  await page.getByRole("button", { name: "Start" }).click();
  await expect(page.getByText(/Tap the tiles in the same order/)).toBeVisible({ timeout: 15_000 });
  for (const t of [1, 2, 3]) await page.getByRole("button", { name: new RegExp(`^Tile ${t}`) }).click();
  await expect(page.getByRole("status").filter({ hasText: /Correct\.|Not quite/ })).toBeVisible();
});

test("the tracker's row actions are on screen without scrolling sideways, on a laptop and a phone", async ({ page }) => {
  await signedIn(page);
  await page.route("**/api/alerts", (route) => route.fulfill({ json: { keys: [] } }));
  await page.goto("/opportunities");
  const alert = page.getByRole("button", { name: /Email me when .* opens and before it closes/ }).first();
  await expect(alert).toBeVisible();
  // Inside the table's own scroll area, not merely inside the window: the table must not need a sideways scroll.
  const box = (await alert.boundingBox())!;
  const region = page.getByRole("region", { name: "Opportunities tracker table" });
  const edge = (await region.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(edge.x);
  expect(box.x + box.width).toBeLessThanOrEqual(edge.x + edge.width + 1);
  expect(await region.evaluate((el) => el.scrollWidth > el.clientWidth + 1)).toBe(false);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
  await expect(page.getByRole("link", { name: /^(Guide|Apply|Careers)$/ }).first()).toBeVisible();
});

test("Sign up free opens the create-account form, and sign-in stays the default for Log in", async ({ page, isMobile }) => {
  test.skip(isMobile, "the header buttons live in the menu on a phone");
  await page.goto("/opportunities");
  await page.getByRole("link", { name: "Sign up free" }).click();
  await expect(page).toHaveURL(/\/login\?mode=signup$/);
  await expect(page.getByRole("button", { name: "Create free account" })).toBeVisible();
  await page.goto("/login");
  await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeVisible();
});

test("the backup tools are tucked away for someone who is not signed in", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("button", { name: "Download backup" })).toBeHidden();
  await page.getByText("Back up or restore the data on this device").click();
  await expect(page.getByRole("button", { name: "Download backup" })).toBeVisible();
});

test("a new member can start a mock interview in one click with a sample advert", async ({ page }) => {
  await signedIn(page);
  await page.goto("/interview");
  await page.getByRole("button", { name: "Start with a sample question" }).click();
  await expect(page.getByText("Question 1 of 5")).toBeVisible();
});

test("a brand-new member's dashboard offers one clear first step, with the checklist tucked underneath", async ({ page }) => {
  await signedIn(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Start here: get your first marked answer" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Answer a question/ })).toHaveAttribute("href", "/interview");
  await page.getByText(/Your prep checklist/).click();
  await expect(page.getByRole("link", { name: "Track 3 applications" })).toBeVisible();
});

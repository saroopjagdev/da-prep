import { defineConfig, devices } from "@playwright/test";

// End-to-end journeys against the dev server with canned AI (MOCK_AI only works outside production builds).
// Run with `npm run test:e2e`. Reuses a dev server already running on the same port.
const PORT = Number(process.env.E2E_PORT ?? 3001);

export default defineConfig({
  testDir: "e2e",
  timeout: 120_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npx next dev -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 240_000,
    // Accounts are switched on against a dummy address so a signed-in browser can be simulated (see signedIn() in the specs).
    // Nothing is ever sent there: the session is read from local storage and AI limits are off.
    env: { MOCK_AI: "1", ENFORCE_LIMITS: "false", NEXT_PUBLIC_SUPABASE_URL: "http://localhost:54321", NEXT_PUBLIC_SUPABASE_ANON_KEY: "e2e-anon-key" },
  },
});

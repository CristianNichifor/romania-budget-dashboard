import { defineConfig, devices } from "@playwright/test";

/** Override with E2E_PORT so parallel checkouts never share a dev server. */
const PORT = Number(process.env.E2E_PORT ?? 4173);
const BASE_URL = `http://127.0.0.1:${PORT}`;
// A second dev server in remote mode, pointed at a BFF host that only exists
// through `page.route`, so error states are tested without a backend.
const REMOTE_PORT = Number(process.env.E2E_REMOTE_PORT ?? 4174);
const REMOTE_URL = `http://127.0.0.1:${REMOTE_PORT}`;

/**
 * Smoke e2e: runs the Vite dev server with the local static data (no BFF),
 * then navigates every tab and asserts it renders without crashing. This
 * keeps CI deterministic — no third-party network calls. The `remote`
 * project exercises error states against a routed fake BFF.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      testIgnore: /(section-error|mobile)\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      testMatch: /mobile\.spec\.ts/,
      use: { ...devices["Pixel 7"], viewport: { width: 375, height: 812 } },
    },
    {
      name: "remote",
      testMatch: /section-error\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], baseURL: REMOTE_URL },
    },
  ],
  webServer: [
    {
      command: `pnpm dev --port ${PORT} --strictPort --host 127.0.0.1`,
      url: BASE_URL,
      env: { VITE_DATA_MODE: "static" },
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: `pnpm dev --port ${REMOTE_PORT} --strictPort --host 127.0.0.1`,
      url: REMOTE_URL,
      env: {
        VITE_DATA_MODE: "remote",
        VITE_API_BASE_URL: "http://bff.e2e.invalid",
      },
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});

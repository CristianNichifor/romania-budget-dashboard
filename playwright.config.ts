import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;

/**
 * Smoke e2e: runs the Vite dev server with the local static data (no BFF),
 * then navigates every tab and asserts it renders without crashing. This
 * keeps CI deterministic — no third-party network calls.
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
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `pnpm dev --port ${PORT} --strictPort --host 127.0.0.1`,
    url: BASE_URL,
    env: { VITE_DATA_MODE: "static" },
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

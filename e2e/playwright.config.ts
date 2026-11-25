import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3210);
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"] },
      grepInvert: /@mobile/,
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
      grep: /@mobile/,
    },
  ],
  // Tests run against the production build (turbo builds it first via ^build).
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `pnpm --dir ../apps/portfolio exec next start -p ${PORT}`,
        url: baseURL,
        // Opt-in only: reusing whatever answers on the port could silently
        // test a different app.
        reuseExistingServer: process.env.E2E_REUSE_SERVER === "true",
        timeout: 120_000,
      },
});

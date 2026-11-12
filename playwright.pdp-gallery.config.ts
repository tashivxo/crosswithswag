import { defineConfig } from "@playwright/test";

/** Production-build PDP gallery CLS (`next start`). Run after `npm run build`. */
export default defineConfig({
  testDir: "e2e",
  testMatch: "**/pdp-gallery-cls.spec.ts",
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: "list",
  timeout: 120_000,
  use: {
    baseURL: "http://localhost:3100",
    trace: "off",
    browserName: "chromium",
    viewport: { width: 1440, height: 900 },
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROME ?? "/usr/local/bin/google-chrome",
      args: ["--no-sandbox"],
    },
  },
  webServer: {
    command: "npx next start -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});

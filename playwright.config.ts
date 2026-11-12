import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "list",
  timeout: 60_000,
  use: {
    baseURL: "http://localhost:3100",
    trace: "off",
  },
  webServer: {
    command: "npx next dev --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      ...process.env,
    } as Record<string, string>,
  },
  projects: [
    {
      name: "iphone-13-pro-max",
      testIgnore: "**/pdp-colourway-cold.spec.ts",
      use: {
        ...devices["iPhone 13 Pro Max"],
        browserName: "webkit",
      },
    },
    {
      name: "chromium-desktop",
      testMatch: "**/pdp-colourway-cold.spec.ts",
      use: {
        browserName: "chromium",
        viewport: { width: 1440, height: 900 },
        launchOptions: {
          executablePath: process.env.PLAYWRIGHT_CHROME ?? "/usr/local/bin/google-chrome",
          args: ["--no-sandbox"],
        },
      },
    },
  ],
});

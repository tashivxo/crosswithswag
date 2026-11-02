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
      NEXT_PUBLIC_COMING_SOON: "1",
    },
  },
  projects: [
    {
      name: "iphone-13-pro-max",
      use: {
        ...devices["iPhone 13 Pro Max"],
        browserName: "webkit",
      },
    },
  ],
});

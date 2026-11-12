import { expect, test } from "@playwright/test";

const BLACK = "/current?product=product-express-dispatch-black";

test.describe("PDP colourway on a desktop production cold load", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        sessionStorage.setItem("swag:preloader-seen", "1");
      } catch {
        /* ignore */
      }
    });
  });

  async function assertWhiteSwatchWorks(page: import("@playwright/test").Page) {
    await expect(page.locator(".pdp-colourway-name")).toHaveText("dispatch black");
    await page.getByRole("button", { name: "dispatch white", exact: true }).click();
    await expect(page).toHaveURL(/product=product-express-dispatch-white/);
    await expect(page.locator(".pdp-colourway-name")).toHaveText("dispatch white");
    await expect(
      page.getByRole("button", { name: "dispatch white", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.getByRole("button", { name: "dispatch black", exact: true }),
    ).toHaveAttribute("aria-pressed", "false");
  }

  test("full document load at 1440 switches colourway", async ({ page }) => {
    await page.goto(BLACK);
    await assertWhiteSwatchWorks(page);
  });

  test("reload at 1440 still switches colourway", async ({ page }) => {
    await page.goto(BLACK);
    await page.reload({ waitUntil: "load" });
    await assertWhiteSwatchWorks(page);
  });
});

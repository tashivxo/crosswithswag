import { expect, test } from "@playwright/test";

async function skipPreloader(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("swag:preloader-seen", "1");
    } catch {
      /* ignore */
    }
  });
}

const shopHeading = (page: import("@playwright/test").Page) =>
  page.locator("#shop .land-shop__title");

test.describe("shop-intent entry (desktop)", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await skipPreloader(page);
  });

  test("from /space, SHOP lands on the standard edition grid", async ({
    page,
  }) => {
    await page.goto("/space", { waitUntil: "domcontentloaded" });
    await page.locator("#preloader.gone").waitFor({ timeout: 15_000 }).catch(() => {});
    const shopLink = page.locator(".site-nav__link").filter({ hasText: /^shop$/i });
    await expect(shopLink).toBeVisible({ timeout: 10_000 });
    await shopLink.click();
    await expect(page).toHaveURL(/\/#shop$/);
    await expect(shopHeading(page)).toBeInViewport({ timeout: 10_000 });
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(100);
  });

  test("refresh /#shop keeps the shop in view", async ({ page }) => {
    await page.goto("/#shop", { waitUntil: "domcontentloaded" });
    await page.locator("#preloader.gone").waitFor({ timeout: 15_000 }).catch(() => {});
    await expect(shopHeading(page)).toBeInViewport({ timeout: 15_000 });
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(100);
  });

  test("plain / starts on landing, not the shop grid", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.locator("#preloader.gone").waitFor({ timeout: 15_000 }).catch(() => {});
    await expect(page.locator("#home-hero")).toBeInViewport();
    await expect(shopHeading(page)).not.toBeInViewport();
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(50);
  });

  test("wordmark from /#shop returns to landing", async ({ page }) => {
    await page.goto("/#shop", { waitUntil: "domcontentloaded" });
    await page.locator("#preloader.gone").waitFor({ timeout: 15_000 }).catch(() => {});
    await expect(shopHeading(page)).toBeInViewport({ timeout: 15_000 });
    await page.getByRole("link", { name: "SWAG home" }).click();
    await expect(page.locator("#home-hero")).toBeInViewport({
      timeout: 10_000,
    });
  });
});

test.describe("shop-intent entry (mobile menu)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("MENU shop lands on #shop", async ({ page }) => {
    await skipPreloader(page);
    await page.goto("/space", { waitUntil: "domcontentloaded" });
    await page.locator("#preloader.gone").waitFor({ timeout: 15_000 }).catch(() => {});
    await page.getByRole("button", { name: /menu/i }).click();
    await page.getByRole("link", { name: /^shop$/i }).click();
    await expect(page).toHaveURL(/\/#shop$/);
    await expect(shopHeading(page)).toBeInViewport({ timeout: 15_000 });
  });
});
import { expect, test } from "@playwright/test";
import { writeFileSync } from "node:fs";

const BLACK = "/current?product=product-express-dispatch-black";
const LABEL_A = "dispatch black";
const LABEL_B = "dispatch white";
const WHITE_SLUG = "product-express-dispatch-white";

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)]!;
}

function summary(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  return {
    n: values.length,
    medianMs: Number(median(values).toFixed(2)),
    meanMs: Number(
      (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
    ),
    minMs: Number(sorted[0]!.toFixed(2)),
    maxMs: Number(sorted[sorted.length - 1]!.toFixed(2)),
    samples: values.map((n) => Number(n.toFixed(2))),
  };
}

/**
 * Click-to-swap at 1440 on `next start`.
 * - firstClick: locator.click after a full document load (what QA timed).
 * - inPage: MutationObserver around the colourway name (paint of the visible product).
 */
test.describe("PDP colourway click-to-swap timing at 1440", () => {
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

  test("measure first-click and in-page click-to-swap on production build", async ({
    page,
  }) => {
    const firstName: number[] = [];
    const firstUrl: number[] = [];
    const firstImg: number[] = [];

    for (let i = 0; i < 8; i++) {
      await page.goto(BLACK, { waitUntil: "load" });
      await expect(page.locator(".pdp-colourway-name")).toHaveText(LABEL_A);
      const swatch = page.getByRole("button", { name: LABEL_B, exact: true });
      await expect(swatch).toBeVisible();

      const t0 = Date.now();
      await swatch.click();
      await expect(page.locator(".pdp-colourway-name")).toHaveText(LABEL_B);
      firstName.push(Date.now() - t0);
      await expect(page).toHaveURL(new RegExp(`product=${WHITE_SLUG}`));
      firstUrl.push(Date.now() - t0);
      await expect(page.locator(".pdp-gallery__main img").first()).toHaveAttribute(
        "src",
        /dispatch-white/,
      );
      firstImg.push(Date.now() - t0);
    }

    await page.goto(BLACK, { waitUntil: "load" });
    await expect(page.locator(".pdp-colourway-name")).toHaveText(LABEL_A);

    const measureInPage = async (from: string, to: string) => {
      const ms = await page.evaluate(
        ({ fromLabel, toLabel }) => {
          const name = document.querySelector(".pdp-colourway-name");
          const btn = [
            ...document.querySelectorAll("button.pdp-link"),
          ].find((el) => el.textContent?.trim() === toLabel);
          if (!name || !btn) {
            throw new Error(`missing name or ${toLabel} swatch`);
          }
          if (name.textContent?.trim() !== fromLabel) {
            throw new Error(
              `expected ${fromLabel}, got ${name.textContent?.trim()}`,
            );
          }
          return new Promise<number>((resolve) => {
            const finish = (t0: number) => {
              obs.disconnect();
              resolve(performance.now() - t0);
            };
            const obs = new MutationObserver(() => {
              if (name.textContent?.trim() === toLabel) finish(t0);
            });
            obs.observe(name, {
              characterData: true,
              childList: true,
              subtree: true,
            });
            const t0 = performance.now();
            (btn as HTMLButtonElement).click();
            if (name.textContent?.trim() === toLabel) finish(t0);
          });
        },
        { fromLabel: from, toLabel: to },
      );
      await expect(page.locator(".pdp-colourway-name")).toHaveText(to);
      return ms;
    };

    await measureInPage(LABEL_A, LABEL_B);
    await measureInPage(LABEL_B, LABEL_A);
    const inPage: number[] = [];
    for (let i = 0; i < 10; i++) {
      inPage.push(await measureInPage(LABEL_A, LABEL_B));
      inPage.push(await measureInPage(LABEL_B, LABEL_A));
    }

    const payload = {
      viewport: 1440,
      firstClickName: summary(firstName),
      firstClickUrl: summary(firstUrl),
      firstClickGallerySrc: summary(firstImg),
      inPageName: summary(inPage),
    };
    const out = process.env.COLOURWAY_TIMING_OUT ?? "/tmp/colourway-timing.json";
    writeFileSync(out, JSON.stringify(payload, null, 2));
    // eslint-disable-next-line no-console
    console.log("colourway-timing", JSON.stringify(payload));
    expect(firstName.length).toBe(8);
    expect(inPage.length).toBe(20);
  });
});

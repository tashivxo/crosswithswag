import { expect, test, type Page } from "@playwright/test";

type CanvasAssign = { prop: "width" | "height"; value: number; at: number };

async function installCanvasProbe(page: Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem("swag:preloader-seen", "1");
    const assigns: CanvasAssign[] = [];
    const proto = HTMLCanvasElement.prototype;
    for (const prop of ["width", "height"] as const) {
      const descriptor = Object.getOwnPropertyDescriptor(proto, prop);
      if (!descriptor?.set || !descriptor.get) continue;
      const { get, set } = descriptor;
      Object.defineProperty(proto, prop, {
        configurable: true,
        enumerable: true,
        get() {
          return get.call(this);
        },
        set(value: number) {
          assigns.push({ prop, value, at: performance.now() });
          set.call(this, value);
        },
      });
    }
    (
      window as unknown as { __veilCanvasAssigns: CanvasAssign[] }
    ).__veilCanvasAssigns = assigns;
  });
}

async function canvasAssigns(page: Page) {
  return page.evaluate(
    () =>
      (window as unknown as { __veilCanvasAssigns: CanvasAssign[] })
        .__veilCanvasAssigns ?? [],
  );
}

async function markSamples(page: Page) {
  return page.evaluate(() => {
    const el = document.querySelector(".wordmark-drift-layer");
    if (!el) return null;
    const style = getComputedStyle(el);
    return {
      transform: style.transform,
      scrollY: window.scrollY,
      at: performance.now(),
    };
  });
}

async function skipPreloader(page: Page) {
  const skip = page.getByRole("button", { name: /skip/i });
  if (await skip.isVisible().catch(() => false)) {
    await skip.click();
  }
  await expect(page.locator(".cs")).toBeVisible();
}

test.describe("coming-soon iOS scroll (iPhone 13 Pro Max WebKit)", () => {
  test("height-only viewport changes never clear the veil canvas", async ({
    page,
  }) => {
    await installCanvasProbe(page);
    await page.setViewportSize({ width: 428, height: 664 });
    await page.goto("/");
    await skipPreloader(page);
    const canvas = page.locator(".dark-veil-canvas");
    await expect(canvas).toBeAttached({ timeout: 20_000 });
    await page.waitForTimeout(400);

    const afterInit = await canvasAssigns(page);
    expect(afterInit.length).toBeGreaterThan(0);
    const initCount = afterInit.length;
    const initHeight = afterInit.filter((a) => a.prop === "height").at(-1)?.value;
    expect(initHeight).toBeGreaterThan(0);

    await page.evaluate(() => window.scrollBy(0, 120));
    await page.setViewportSize({ width: 428, height: 744 });
    await page.evaluate(() => window.scrollBy(0, 80));
    await page.waitForTimeout(80);
    await page.evaluate(() => window.scrollBy(0, 80));
    await page.setViewportSize({ width: 428, height: 664 });
    await page.evaluate(() => window.scrollBy(0, -80));
    await page.waitForTimeout(80);
    await page.setViewportSize({ width: 428, height: 744 });
    await page.waitForTimeout(350);

    const afterScroll = await canvasAssigns(page);
    const extra = afterScroll.slice(initCount);
    const extraHeights = extra.filter((a) => a.prop === "height");
    expect(
      extraHeights,
      "height-only URL-bar resizes must not assign canvas.height",
    ).toEqual([]);
  });

  test("pinned swag. mark scale tracks scroll without 0.25s lag steps", async ({
    page,
  }) => {
    await installCanvasProbe(page);
    await page.setViewportSize({ width: 428, height: 744 });
    await page.goto("/");
    await skipPreloader(page);
    await expect(page.locator(".wordmark-drift-layer")).toBeAttached();
    await page.waitForTimeout(300);

    const samples: Array<{
      transform: string;
      scrollY: number;
      at: number;
    }> = [];

    for (let i = 0; i < 12; i++) {
      await page.evaluate((dy) => window.scrollBy(0, dy), 40);
      await page.waitForTimeout(16);
      const sample = await markSamples(page);
      if (sample) samples.push(sample);
    }

    expect(samples.length).toBeGreaterThan(6);
    const scales = samples.map((s) => {
      const m = /matrix\(([^)]+)\)/.exec(s.transform);
      if (!m) return 1;
      return Number(m[1].split(",")[0]);
    });

    const moving = scales.filter((scale, i) => i > 0 && scale !== scales[0]);
    expect(moving.length, "mark should scale during the pin").toBeGreaterThan(0);

    const dt = samples.at(-1)!.at - samples[0].at;
    const report = samples.map((s, i) => ({
      i,
      scrollY: s.scrollY,
      scale: scales[i],
      t: Math.round(s.at - samples[0].at),
    }));
    expect(dt, JSON.stringify(report)).toBeGreaterThan(0);

    for (let i = 1; i < scales.length; i++) {
      expect(scales[i]).toBeLessThanOrEqual(scales[i - 1] + 0.02);
    }
  });
});

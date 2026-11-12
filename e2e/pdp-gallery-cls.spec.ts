import { expect, test, type Page } from "@playwright/test";
import { writeFileSync } from "node:fs";

const BLACK = "/current?product=product-express-dispatch-black";

const CLS_BOOT = () => {
  const w = window as Window & {
    __cls: number;
    __clsStart: () => void;
    __clsSince: number;
  };
  w.__cls = 0;
  w.__clsSince = 0;
  let mark = 0;
  w.__clsStart = () => {
    mark = w.__cls;
    w.__clsSince = 0;
  };
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const shift = entry as LayoutShift;
      if (shift.hadRecentInput) continue;
      w.__cls += shift.value;
      w.__clsSince = w.__cls - mark;
    }
  });
  po.observe({ type: "layout-shift", buffered: true });
};

test.describe("PDP gallery frame CLS at 1440", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("10 cold loads: report max CLS; Print→Front does not shift the frame", async ({
    browser,
  }) => {
    const samples: number[] = [];

    for (let i = 0; i < 10; i++) {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
      });
      const page = await context.newPage();
      await page.addInitScript(CLS_BOOT);
      await page.goto(BLACK, { waitUntil: "load" });
      await page.locator(".pdp-colourway-name").waitFor({ state: "visible" });
      await page.locator("#preloader.gone").waitFor({ timeout: 10_000 });
      await expect(page.locator(".pdp-gallery__main")).toHaveCount(1);
      await page.waitForTimeout(400);
      samples.push(await page.evaluate(() => (window as Window & { __cls: number }).__cls));
      await context.close();
    }

    const maxCls = Math.max(...samples);
    const payload = {
      viewport: 1440,
      n: samples.length,
      maxCls: Number(maxCls.toFixed(4)),
      samples: samples.map((n) => Number(n.toFixed(4))),
    };
    const out = process.env.PDP_CLS_OUT ?? "/tmp/pdp-gallery-cls.json";
    writeFileSync(out, JSON.stringify(payload, null, 2));
    // eslint-disable-next-line no-console
    console.log("pdp-gallery-cls", JSON.stringify(payload));
    expect(samples).toHaveLength(10);
    expect(maxCls).toBeLessThan(0.25);

    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    await page.addInitScript(() => {
      try {
        sessionStorage.setItem("swag:preloader-seen", "1");
      } catch {
        /* ignore */
      }
    });
    await page.addInitScript(CLS_BOOT);
    await page.goto(BLACK, { waitUntil: "load" });
    await page.locator(".pdp-colourway-name").waitFor({ state: "visible" });
    await expect(page.locator("[data-pdp-reserve]")).toHaveCount(0);
    const frame = page.locator(".pdp-gallery__main");
    await expect(frame).toHaveClass(/pdp-tile--print/);
    const before = await frameBox(page);
    await page.evaluate(() =>
      (window as Window & { __clsStart: () => void }).__clsStart(),
    );
    await page.getByRole("button", { name: "Front", exact: true }).click();
    await expect(frame).not.toHaveClass(/pdp-tile--print/);
    await page.waitForTimeout(300);
    const after = await frameBox(page);
    const switchCls = await page.evaluate(
      () => (window as Window & { __clsSince: number }).__clsSince,
    );
    expect(after.height).toBe(before.height);
    expect(after.y).toBe(before.y);
    expect(switchCls).toBe(0);
    await context.close();
  });
});

async function frameBox(page: Page) {
  const box = await page.locator(".pdp-gallery__main").boundingBox();
  if (!box) throw new Error("gallery frame has no box");
  return box;
}

import { test, expect } from "@playwright/test";

const sizes = [
  { name: "imac", width: 2560, height: 1440 },
  { name: "desktop", width: 1920, height: 1080 },
  { name: "mobile", width: 390, height: 844 },
  { name: "small-mobile", width: 375, height: 667 },
];
for (const viewport of sizes) {
  test(`${viewport.name}: five scenes, reverse scroll, anchors and layout`, async ({
    page,
  }) => {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (e) => {
      if (e.type() === "error") errors.push(e.text());
    });
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.locator(".experience")).toHaveClass(/motion-enabled/);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `qa/${viewport.name}-opening.png` });
    await page.locator(".scroll-cue").click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `qa/${viewport.name}-story.png` });
    await page
      .locator('.site-header a[href="#products"]')
      .first()
      .evaluate((el) => el.click());
    await page.waitForTimeout(800);
    for (const index of [0, 1, 2, 3, 4, 2, 0, 4]) {
      await page.locator(".chapter-button").nth(index).click();
      await page.waitForTimeout(850);
      const scene = page.locator(".product-scene").nth(index);
      await expect(scene).toHaveAttribute("aria-hidden", "false");
      await expect(page.locator(".chapter-current")).toHaveText(
        `0${index + 1}`,
      );
      await expect(scene.locator("h2")).toBeVisible();
      const bounds = await scene.locator(".product-copy").boundingBox();
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width + 1);
      expect(bounds.y).toBeGreaterThanOrEqual(0);
      expect(bounds.y + bounds.height).toBeLessThan(viewport.height - 65);
      await page.screenshot({
        path: `qa/${viewport.name}-product-0${index + 1}.png`,
      });
    }
    // Wheel input, not just chapter navigation, must release the pinned stage.
    await page.mouse.wheel(0, 12000);
    await page.waitForTimeout(700);
    await expect(page.locator("footer")).toBeInViewport();
    await page
      .locator('a[href="#values"]')
      .first()
      .evaluate((el) => el.click());
    await page.waitForTimeout(800);
    await page.screenshot({ path: `qa/${viewport.name}-values.png` });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    expect(overflow).toBe(false);
    expect(errors).toEqual([]);
  });
}

test("reduced motion exposes all products, no pin; media resolve", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".experience")).not.toHaveClass(/motion-enabled/);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".product-scene")).toHaveCount(5);
  for (const scene of await page.locator(".product-scene").all()) {
    await expect(scene).not.toHaveAttribute("aria-hidden", "true");
  }
  await page.evaluate(async () => {
    for (const img of document.images) {
      img.loading = "eager";
      await img.decode();
    }
  });
  await expect(page.locator("video")).toHaveJSProperty("paused", true);
  await page.screenshot({
    path: "qa/mobile-reduced-motion.png",
    fullPage: true,
  });
});

test("motion toggle cleans up and restores pin, resize rebuilds once", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator('.site-header a[href="#products"]').first().click();
  await page.locator(".motion-toggle").click();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator('.product-scene[aria-hidden="true"]')).toHaveCount(
    0,
  );
  await page.locator(".motion-toggle").click();
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(600);
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForTimeout(600);
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
});

test("keyboard entry, film playback and image failure fallback", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await expect(page.locator(".skip-link")).toBeInViewport();
  await page.locator(".film-button").click();
  await expect(page.locator("video")).toHaveJSProperty("paused", false);
  await page.locator(".film-button").click();
  await expect(page.locator("video")).toHaveJSProperty("paused", true);
  await page.route("**/product-03.svg", (route) => route.abort());
  await page.reload();
  await expect(page.locator("#product-03 .media-fallback")).toHaveCount(1);
});

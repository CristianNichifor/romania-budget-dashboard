import { expect, test } from "@playwright/test";

/**
 * F2.10 (design #22), on the `mobile` project (375 px): KPI tiles stack one
 * per row, and every control is at least 24 px in both directions
 * (WCAG 2.2 target size, minimum).
 */

test("KPI tiles stack one per row on Your share", async ({ page }) => {
  await page.goto("/ro/felia-ta/");
  const tiles = page.locator("main div.rounded-xl:has(> p.text-2xl)");
  await expect(tiles.first()).toBeVisible();
  const boxes = await tiles.evaluateAll((els) =>
    els
      .map((el) => el.getBoundingClientRect())
      .map((r) => ({
        left: Math.round(r.left),
        top: Math.round(r.top),
      }))
  );
  expect(boxes.length).toBeGreaterThan(1);
  expect(new Set(boxes.map((b) => b.left)).size).toBe(1);
  expect(new Set(boxes.map((b) => b.top)).size).toBe(boxes.length);
});

for (const path of [
  "/ro/felia-ta/",
  "/ro/bilantul-national/",
  "/ro/economie/",
]) {
  test(`controls on ${path} are at least 24 px`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("main h2").first()).toBeVisible();
    const small = await page
      .locator(
        "main button:visible, main select:visible, main [role=slider]:visible, nav a:visible, header button:visible"
      )
      .evaluateAll((els) =>
        els
          .map((el) => ({ el, r: el.getBoundingClientRect() }))
          .filter(({ r }) => r.width > 0 && (r.width < 24 || r.height < 24))
          .map(
            ({ el, r }) =>
              `${el.tagName.toLowerCase()} "${(el.textContent ?? "").trim().slice(0, 30)}" ${Math.round(r.width)}x${Math.round(r.height)}`
          )
      );
    expect(small).toEqual([]);
  });
}

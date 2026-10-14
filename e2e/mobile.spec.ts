import { expect, test, type Page } from "@playwright/test";

/** Runs on the `mobile` project: Pixel 7 at a 375 px wide viewport. */

async function bodyOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth
  );
}

const ROUTES = [
  "/ro/felia-ta/",
  "/ro/bilantul-national/",
  "/ro/companii-de-stat/",
  "/ro/economie/",
  "/ro/societate/",
  "/ro/energie/",
  "/ro/piata-muncii/",
  "/ro/justitie/",
  "/justice/",
];

for (const path of ROUTES) {
  test(`no horizontal page scroll at 375 px on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h2").first()).toBeVisible();
    expect(await bodyOverflow(page)).toBeLessThanOrEqual(0);
  });
}

test("the tab bar scrolls on its own and shows the active tab", async ({
  page,
}) => {
  await page.goto("/ro/justitie/");
  const nav = page.getByRole("navigation", { name: "Navigare principală" });
  const active = nav.locator('[aria-current="page"]');
  await expect(active).toHaveText("Justiție");

  const scroll = await nav.evaluate((element) => ({
    scrollWidth: element.scrollWidth,
    clientWidth: element.clientWidth,
    overflowX: getComputedStyle(element).overflowX,
  }));
  expect(scroll.scrollWidth).toBeGreaterThan(scroll.clientWidth);
  expect(["auto", "scroll"]).toContain(scroll.overflowX);

  await expect(active).toBeInViewport({ ratio: 0.95 });
});

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

// F2.10: tabs, buttons and selects are at least 44 px tall on a phone.
async function minHeight(page: Page, selector: string): Promise<number> {
  return page
    .locator(selector)
    .evaluateAll((elements) =>
      Math.min(
        ...elements
          .filter((element) => (element as HTMLElement).offsetParent !== null)
          .map((element) => element.getBoundingClientRect().height)
      )
    );
}

test("header controls, tabs and the metric select are 44 px targets", async ({
  page,
}) => {
  await page.goto("/ro/bilantul-national/");
  await expect(page.locator("h2").first()).toBeVisible();
  expect(
    await minHeight(page, "header a, header button")
  ).toBeGreaterThanOrEqual(44);
  expect(
    await minHeight(page, 'nav[aria-label="Navigare principală"] a')
  ).toBeGreaterThanOrEqual(44);
  expect(await minHeight(page, "select#ins-metric")).toBeGreaterThanOrEqual(44);
});

test("the salary waterfall scroll region takes keyboard focus on a phone", async ({
  page,
}) => {
  await page.goto("/ro/felia-ta/");
  const region = page.getByRole("region", { name: /Cascada salariului/ });
  await expect(region).toBeVisible();
  await expect(region).toHaveAttribute("tabindex", "0");

  await region.focus();
  await page.keyboard.press("ArrowRight");
  await expect
    .poll(() => region.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(0);
});

// One-line pills: a badge that wraps inside its own border reads as two.
async function lineCount(page: Page, selector: string): Promise<number> {
  return page.locator(selector).evaluateAll((elements) =>
    Math.max(
      ...elements.map((element) => {
        const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
        return Math.round(
          (element as HTMLElement).clientHeight / (lineHeight || 16)
        );
      })
    )
  );
}

test("the data-mode badge and source badges stay on one line", async ({
  page,
}) => {
  await page.goto("/ro/economie/");
  await expect(page.locator("h2").first()).toBeVisible();
  const badge = page.locator("header span.rounded-full").last();
  await expect(badge).toBeVisible();
  const height = await badge.evaluate((element) => element.clientHeight);
  expect(height).toBeLessThanOrEqual(26);
  expect(await lineCount(page, "main span.rounded-full.bg-slate-100")).toBe(1);
});

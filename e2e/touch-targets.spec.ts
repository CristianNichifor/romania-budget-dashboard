import { expect, test } from "@playwright/test";

/**
 * UX guideline §6 / design criterion F2.10: every interactive target is at
 * least 24 × 24 CSS px (WCAG 2.5.8). Checked on native controls and on the
 * navigation links; inline links inside prose are the documented exception.
 */

const ROUTES = [
  "/ro/felia-ta/",
  "/ro/bilantul-national/",
  "/ro/economie/",
  "/ro/justitie/",
];

const TARGETS = [
  "header a[href]",
  "nav a[href]",
  "main button",
  "main select",
  "main input",
  "main [role='slider']",
].join(", ");

const MIN = 24;

for (const path of ROUTES) {
  test(`interactive targets are at least ${MIN} px on ${path}`, async ({
    page,
  }) => {
    await page.goto(path);
    await expect(page.locator("h2").first()).toBeVisible();

    const small = await page.locator(TARGETS).evaluateAll(
      (elements, min) =>
        elements
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            const visible =
              rect.width > 0 &&
              rect.height > 0 &&
              style.visibility !== "hidden" &&
              style.display !== "none";
            return visible && (rect.width < min || rect.height < min);
          })
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return `${element.tagName.toLowerCase()} "${(
              element.textContent ??
              element.getAttribute("aria-label") ??
              ""
            )
              .trim()
              .slice(
                0,
                30
              )}" ${Math.round(rect.width)}×${Math.round(rect.height)}`;
          }),
      MIN
    );

    expect(small, `targets under ${MIN} px`).toEqual([]);
  });
}

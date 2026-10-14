import { expect, test } from "@playwright/test";
import { CONTENT_PAGES } from "../src/lib/routeTable";

// F2.11: rendered Romanian text has no cedilla ş/ţ (U+015F, U+0163 and capitals),
// whatever its source — messages, seed data or labels from the API.
const CEDILLA = /[şţŞŢ]/u;

for (const page of CONTENT_PAGES) {
  test(`${page.ro} renders no cedilla ş/ţ`, async ({ page: tab }) => {
    await tab.goto(page.ro);
    await expect(tab.locator("main h2").first()).toBeVisible();
    await tab.waitForLoadState("networkidle");
    const text = await tab.locator("body").innerText();
    const hits = text
      .split("\n")
      .filter((line) => CEDILLA.test(line))
      .slice(0, 5);
    expect(hits).toEqual([]);
  });
}

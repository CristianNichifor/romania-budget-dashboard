import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { CONTENT_PAGES } from "../src/lib/routeTable";

// UXG-B2: every route passes axe (WCAG 2.1 A/AA) at desktop and phone width.
for (const width of [1440, 390]) {
  for (const page of CONTENT_PAGES) {
    for (const path of [page.ro, page.en]) {
      test(`${path} passes axe at ${width}px`, async ({ page: tab }) => {
        await tab.setViewportSize({ width, height: 900 });
        await tab.goto(path);
        await expect(tab.locator("main h2").first()).toBeVisible();
        // Let lazily loaded sections settle before scanning.
        await tab.waitForLoadState("networkidle");
        const { violations } = await new AxeBuilder({ page: tab })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();
        const summary = violations.map(
          (v) =>
            `${v.id} (${v.impact}): ${v.nodes
              .slice(0, 3)
              .map((n) => n.target.join(" "))
              .join(" | ")}`
        );
        expect(summary).toEqual([]);
      });
    }
  }
}

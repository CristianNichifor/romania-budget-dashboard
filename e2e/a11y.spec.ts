import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { CONTENT_PAGES } from "../src/lib/routeTable";

// UXG-B2: every route passes axe (WCAG 2.1 A/AA) at desktop and phone width.

// Known violations whose fix sits in files another open PR is changing. Each is
// scoped to its route so the rule still guards every other page. Remove an
// entry once its fix lands.
const KNOWN: Partial<Record<(typeof CONTENT_PAGES)[number]["key"], string[]>> =
  {
    // The salary slider thumb has no accessible name (src/routes/CitizenSlice.tsx, open #25).
    citizenSlice: ["aria-input-field-name"],
    // A chart SVG with focusable children (treemap/sankey, open #16 and #18).
    nationalBalance: ["nested-interactive"],
  };
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
          .disableRules(KNOWN[page.key] ?? [])
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

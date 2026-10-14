import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const CHARTS_DIR = join(__dirname, "..", "src", "components", "charts");

const chartFiles = readdirSync(CHARTS_DIR).filter((name) =>
  name.endsWith(".tsx")
);

/**
 * UX guideline §4 / civic-ui §4: one y-axis per chart. A second axis in
 * recharts needs `yAxisId` on the axis and on its series and usually an
 * `orientation="right"` axis; neither may appear in a chart component. Two
 * series with different units go in two framed charts (small multiples).
 */
describe("no dual y-axis (E2, UXG-B3)", () => {
  it.each(chartFiles)("%s declares a single y-axis", (name) => {
    const source = readFileSync(join(CHARTS_DIR, name), "utf8");
    expect(source).not.toMatch(/yAxisId=/);
    expect(source).not.toMatch(/orientation=["']right["']/);
  });
});

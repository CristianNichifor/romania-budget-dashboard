import { describe, expect, it } from "vitest";
import {
  deficitMagnitude,
  deficitOverrun,
  findComparisonPoint,
  toDeficitSeries,
} from "../src/lib/adoptedComparison";
import type { BudgetComparisonPoint } from "../src/api/client";

const points: BudgetComparisonPoint[] = [
  {
    year: 2023,
    adopted: {
      revenue: "490000000000",
      expenditure: "566000000000",
      deficit: "-76000000000",
    },
    executed: {
      revenue: "620000000000",
      expenditure: "730000000000",
      deficit: "110000000000",
      deficitPercentGdp: "6.9",
    },
    deficitDelta: "186000000000",
    note: "note",
  },
  {
    year: 2024,
    adopted: {
      revenue: "508240209000",
      expenditure: "603874455000",
      deficit: "-95634246000",
    },
    executed: null,
    deficitDelta: null,
    note: "note",
  },
];

describe("toDeficitSeries", () => {
  it("converts deficits to positive milliarde lei and sorts by year", () => {
    const series = toDeficitSeries(points);
    expect(series).toEqual([
      { year: 2023, adoptedDeficitMld: 76, executedDeficitMld: 110 },
      { year: 2024, adoptedDeficitMld: 95.634246, executedDeficitMld: null },
    ]);
  });

  it("returns an empty series for empty input", () => {
    expect(toDeficitSeries([])).toEqual([]);
  });
});

describe("findComparisonPoint", () => {
  it("finds the point for the selected year", () => {
    expect(findComparisonPoint(points, 2023)?.adopted.deficit).toBe(
      "-76000000000"
    );
  });

  it("returns undefined for unknown years", () => {
    expect(findComparisonPoint(points, 2020)).toBeUndefined();
  });
});

describe("deficit overrun", () => {
  it("compares magnitudes even though the sources use opposite signs", () => {
    // Adopted: revenue − expenditure (negative). Executed: expenditure −
    // revenue (positive). Live 2023: −76,1 vs 109,9 → gap 33,8, not 186.
    const [withExecution] = points;
    expect(deficitOverrun(withExecution!)?.toFixed(0)).toBe("34000000000");
  });

  it("is null without execution data", () => {
    expect(deficitOverrun(points[1]!)).toBeNull();
  });

  it("is negative when execution beat the plan", () => {
    const point: BudgetComparisonPoint = {
      ...points[0]!,
      executed: { ...points[0]!.executed!, deficit: "-50000000000" },
    };
    expect(deficitOverrun(point)?.toFixed(0)).toBe("-26000000000");
  });

  it("exposes both deficits as positive magnitudes", () => {
    expect(deficitMagnitude("-76000000000").toFixed(0)).toBe("76000000000");
    expect(deficitMagnitude("110000000000").toFixed(0)).toBe("110000000000");
  });
});

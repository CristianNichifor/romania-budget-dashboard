import { Decimal } from "decimal.js";
import type { BudgetComparisonPoint } from "../api/client";

/**
 * Pure transforms for the adopted-vs-execution section. Monetary strings
 * stay Decimal in the core; numbers appear only as chart-facing milliarde
 * lei at the display boundary.
 */

export interface AdoptedExecutionChartPoint {
  year: number;
  adoptedDeficitMld: number;
  executedDeficitMld: number | null;
}

const BILLION = new Decimal(1_000_000_000);

/**
 * Deficit magnitudes per year (deficits are negative on both sides; the
 * chart plots the depth). Execution may be missing (null) for years the
 * execution source does not cover.
 */
export function toDeficitSeries(
  points: BudgetComparisonPoint[]
): AdoptedExecutionChartPoint[] {
  return [...points]
    .sort((a, b) => a.year - b.year)
    .map((point) => ({
      year: point.year,
      adoptedDeficitMld: new Decimal(point.adopted.deficit)
        .abs()
        .div(BILLION)
        .toNumber(),
      executedDeficitMld:
        point.executed === null
          ? null
          : new Decimal(point.executed.deficit).abs().div(BILLION).toNumber(),
    }));
}

export function findComparisonPoint(
  points: BudgetComparisonPoint[],
  year: number
): BudgetComparisonPoint | undefined {
  return points.find((point) => point.year === year);
}

/** A deficit as a positive amount, whichever sign convention fed it. */
export function deficitMagnitude(deficit: string): Decimal {
  return new Decimal(deficit).abs();
}

/**
 * How far the executed deficit overshot the adopted one. The adopted side is
 * revenue − expenditure (negative) and execution is expenditure − revenue
 * (positive), so the BFF's `deficitDelta` (executed − adopted) adds the two
 * instead of comparing them; compare magnitudes here. Negative when execution
 * came in below plan; `null` without execution data.
 */
export function deficitOverrun(point: BudgetComparisonPoint): Decimal | null {
  if (point.executed === null) {
    return null;
  }
  return deficitMagnitude(point.executed.deficit).minus(
    deficitMagnitude(point.adopted.deficit)
  );
}

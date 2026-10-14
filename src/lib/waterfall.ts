import { Decimal } from "decimal.js";
import type { SalaryBreakdown } from "./salary";

/** `total` opens the waterfall, `decrease` steps take from it, `net` closes it. */
export type WaterfallKind = "total" | "decrease" | "net";

export interface WaterfallRow {
  /** i18n message id for the label. */
  labelKey: string;
  /** Cumulative value before this step. */
  start: number;
  /** Cumulative value after this step. */
  end: number;
  /** Signed delta applied by this step. */
  amount: number;
  kind: WaterfallKind;
}

/**
 * Turns a salary breakdown into waterfall rows: the first row is the total
 * employer cost, each subsequent row applies a deduction, the last row is
 * the net salary (its own kind, so the chart colours it apart from the
 * opening total). Pure function — display values are numbers at the boundary.
 */
export function buildSalaryWaterfallRows(
  breakdown: SalaryBreakdown
): WaterfallRow[] {
  let cumulative = new Decimal(0);
  const rows: WaterfallRow[] = [];

  for (const [index, entry] of breakdown.entries.entries()) {
    const isLast = index === breakdown.entries.length - 1;
    const start = cumulative.toNumber();

    if (isLast) {
      rows.push({
        labelKey: entry.labelKey,
        start: 0,
        end: entry.amount.toNumber(),
        amount: entry.amount.toNumber(),
        kind: "net",
      });
    } else if (index === 0) {
      cumulative = entry.amount;
      rows.push({
        labelKey: entry.labelKey,
        start: 0,
        end: entry.amount.toNumber(),
        amount: entry.amount.toNumber(),
        kind: "total",
      });
    } else {
      const next = cumulative.plus(entry.amount);
      rows.push({
        labelKey: entry.labelKey,
        start,
        end: next.toNumber(),
        amount: entry.amount.toNumber(),
        kind: "decrease",
      });
      cumulative = next;
    }
  }

  return rows;
}

import { Decimal } from "decimal.js";
import type { BudgetDestination } from "../data/budget2026";

export interface ContributionShare {
  id: string;
  name: string;
  /** Bani out of each leu, as a fraction of 1 (0.25 = 25 bani). */
  perLeu: Decimal;
  /** The contribution's share, in lei, rounded to bani. */
  amount: Decimal;
}

function positiveAmount(raw: string): Decimal | null {
  try {
    const value = new Decimal(raw);
    return value.isFinite() && value.greaterThan(0) ? value : null;
  } catch {
    return null;
  }
}

/**
 * Split a monthly contribution pro rata by the budget's destination amounts.
 * An estimate: taxes are not earmarked, so this says where an average leu of
 * spending goes, not where this person's leu goes. Rows are rounded to bani
 * and the last one absorbs the remainder, so they sum exactly to the
 * contribution (itself rounded to bani). Pure; never throws.
 */
export function splitContribution(
  contribution: Decimal,
  destinations: BudgetDestination[]
): ContributionShare[] {
  const target = contribution.toDecimalPlaces(2);
  const usable = destinations
    .map((destination) => ({
      destination,
      value: positiveAmount(destination.amount),
    }))
    .filter(
      (entry): entry is { destination: BudgetDestination; value: Decimal } =>
        entry.value !== null
    )
    .sort((a, b) => b.value.comparedTo(a.value));
  if (!target.greaterThan(0) || usable.length === 0) {
    return [];
  }

  const total = usable.reduce(
    (sum, entry) => sum.plus(entry.value),
    new Decimal(0)
  );
  let allocated = new Decimal(0);
  return usable.map((entry, index) => {
    const perLeu = entry.value.div(total);
    const amount =
      index === usable.length - 1
        ? target.minus(allocated)
        : target.mul(perLeu).toDecimalPlaces(2);
    allocated = allocated.plus(amount);
    return {
      id: entry.destination.id,
      name: entry.destination.name,
      perLeu,
      amount,
    };
  });
}

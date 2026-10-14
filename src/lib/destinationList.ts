import { Decimal } from "decimal.js";
import type { BudgetDestination } from "../data/budget2026";

/** Destinations largest first for the list view; ties keep source order. */
export function rankDestinations(
  destinations: readonly BudgetDestination[]
): BudgetDestination[] {
  return destinations
    .map((destination, index) => ({ destination, index }))
    .sort((a, b) => {
      const byAmount = new Decimal(b.destination.amount).comparedTo(
        a.destination.amount
      );
      return byAmount !== 0 ? byAmount : a.index - b.index;
    })
    .map(({ destination }) => destination);
}

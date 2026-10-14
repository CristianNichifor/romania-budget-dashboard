import { Decimal } from "decimal.js";
import type { BudgetDestination } from "../data/budget2026";

/** The BFF's catch-all destination for everything outside its top list. */
export const REST_ID = "rest";

/**
 * The BFF lumps everything outside its top destinations into one "rest"
 * bucket (close to half of spending). Promote that bucket's largest items to
 * destinations of their own and keep only the remainder as "rest". Shares
 * are recomputed against the listed total. Pure; amounts stay strings.
 */
export function expandRest(
  destinations: BudgetDestination[],
  promote = 5
): BudgetDestination[] {
  const rest = destinations.find((destination) => destination.id === REST_ID);
  const children = rest?.subDestinations ?? [];
  if (rest === undefined || children.length === 0) {
    return destinations;
  }

  const total = destinations.reduce(
    (sum, destination) => sum.plus(destination.amount),
    new Decimal(0)
  );
  const share = (amount: Decimal): string =>
    total.isZero()
      ? "0"
      : amount.div(total).mul(100).toDecimalPlaces(1).toString();

  const sorted = [...children].sort((a, b) =>
    new Decimal(b.amount).comparedTo(a.amount)
  );
  const promoted = sorted.slice(0, promote);
  const remaining = sorted.slice(promote);
  const remainder = new Decimal(rest.amount).minus(
    promoted.reduce((sum, child) => sum.plus(child.amount), new Decimal(0))
  );

  return [
    ...destinations.filter((destination) => destination.id !== REST_ID),
    ...promoted.map((child) => ({
      id: child.id,
      name: child.name,
      amount: child.amount,
      percentOfTotal: share(new Decimal(child.amount)),
    })),
    ...(remainder.gt(0)
      ? [
          {
            ...rest,
            amount: remainder.toString(),
            percentOfTotal: share(remainder),
            subDestinations: remaining,
          },
        ]
      : []),
  ];
}

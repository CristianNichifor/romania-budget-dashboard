import { Decimal } from "decimal.js";

export interface SankeyNodeInput {
  id: string;
  name: string;
}

export interface SankeyLinkInput {
  source: string;
  target: string;
  value: number;
}

export interface GroupedDestination {
  id: string;
  name: string;
  amount: string;
}

export interface BudgetSankeyData {
  nodes: SankeyNodeInput[];
  links: SankeyLinkInput[];
  /** Destinations folded into the rest node, largest first (for drill-down). */
  grouped: GroupedDestination[];
}

export const SANKEY_REVENUE_NODE_ID = "venituri";
export const SANKEY_BUDGET_NODE_ID = "buget";
export const SANKEY_DEFICIT_NODE_ID = "deficit";
export const SANKEY_REST_NODE_ID = "rest";
export const SANKEY_REST_NODE_NAME = "Alte destinații";

export interface BudgetSankeyInputs {
  revenue: string;
  expenditure: string;
  deficit: string;
  destinations: { id: string; name: string; amount: string }[];
  /** How many destinations keep their own flow; the others join the rest. */
  maxDestinations?: number;
  /**
   * Smallest share of expenditure (0–1) a destination needs for its own
   * flow; thinner ones join the rest even when the count allows them.
   */
  minShare?: number;
}

export const SANKEY_DEFAULT_MAX_DESTINATIONS = 8;
/** Design F2.7: flows under 3 % of total are grouped as "other destinations". */
export const SANKEY_DEFAULT_MIN_SHARE = 0.03;

/**
 * Builds the sankey flow from API-provided totals: revenue + deficit
 * (borrowing) flow into the consolidated budget, which flows out to the
 * spending destinations. The "rest" node absorbs the part of expenditure
 * not covered by the listed destinations, so in-flow equals out-flow.
 * Only the largest `maxDestinations` flows of at least `minShare` of
 * expenditure are drawn and labelled; smaller ones are grouped into the rest node and returned in `grouped` so the UI
 * can offer a drill-down. Pure function — numbers only at the display boundary.
 */
export function buildBudgetSankey(
  inputs: BudgetSankeyInputs
): BudgetSankeyData {
  const expenditure = new Decimal(inputs.expenditure);
  const revenue = new Decimal(inputs.revenue);
  const deficit = new Decimal(inputs.deficit);

  // A rest bucket in the list (the BFF sends one) joins the computed rest,
  // so the flow has a single "other destinations" node.
  const maxDestinations =
    inputs.maxDestinations ?? SANKEY_DEFAULT_MAX_DESTINATIONS;
  const ranked = inputs.destinations
    .filter(
      (destination) =>
        destination.id !== SANKEY_REST_NODE_ID &&
        new Decimal(destination.amount).gt(0)
    )
    .sort((a, b) => new Decimal(b.amount).comparedTo(a.amount));
  const minShare = inputs.minShare ?? SANKEY_DEFAULT_MIN_SHARE;
  const threshold = expenditure.mul(minShare);
  const bigEnough = ranked.filter((destination) =>
    new Decimal(destination.amount).gte(threshold)
  );
  const destinations = bigEnough.slice(0, maxDestinations);
  const kept = new Set(destinations.map((destination) => destination.id));
  const grouped = ranked.filter((destination) => !kept.has(destination.id));
  const destinationsTotal = destinations.reduce(
    (sum, destination) => sum.plus(destination.amount),
    new Decimal(0)
  );
  const rest = expenditure.minus(destinationsTotal);

  const nodes: SankeyNodeInput[] = [
    ...(revenue.gt(0)
      ? [{ id: SANKEY_REVENUE_NODE_ID, name: "Venituri" }]
      : []),
    ...(deficit.gt(0)
      ? [{ id: SANKEY_DEFICIT_NODE_ID, name: "Deficit (împrumut)" }]
      : []),
    { id: SANKEY_BUDGET_NODE_ID, name: "Buget consolidat" },
    ...destinations
      .filter((destination) => new Decimal(destination.amount).gt(0))
      .map((destination) => ({ id: destination.id, name: destination.name })),
    ...(rest.gt(0)
      ? [{ id: SANKEY_REST_NODE_ID, name: SANKEY_REST_NODE_NAME }]
      : []),
  ];

  const links: SankeyLinkInput[] = [
    ...(revenue.gt(0)
      ? [
          {
            source: SANKEY_REVENUE_NODE_ID,
            target: SANKEY_BUDGET_NODE_ID,
            value: revenue.toNumber(),
          },
        ]
      : []),
    ...(deficit.gt(0)
      ? [
          {
            source: SANKEY_DEFICIT_NODE_ID,
            target: SANKEY_BUDGET_NODE_ID,
            value: deficit.toNumber(),
          },
        ]
      : []),
    ...destinations
      .filter((destination) => new Decimal(destination.amount).gt(0))
      .map((destination) => ({
        source: SANKEY_BUDGET_NODE_ID,
        target: destination.id,
        value: new Decimal(destination.amount).toNumber(),
      })),
    ...(rest.gt(0)
      ? [
          {
            source: SANKEY_BUDGET_NODE_ID,
            target: SANKEY_REST_NODE_ID,
            value: rest.toNumber(),
          },
        ]
      : []),
  ];

  return { nodes, links, grouped };
}

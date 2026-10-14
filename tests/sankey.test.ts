import { Decimal } from "decimal.js";
import { describe, expect, it } from "vitest";
import {
  buildBudgetSankey,
  SANKEY_BUDGET_NODE_ID,
  SANKEY_REST_NODE_ID,
  type BudgetSankeyInputs,
} from "../src/lib/sankey";

const inputs: BudgetSankeyInputs = {
  revenue: "600",
  expenditure: "700",
  deficit: "100",
  destinations: [
    { id: "sanatate", name: "Sănătate", amount: "300" },
    { id: "educatie", name: "Educație", amount: "200" },
  ],
};

describe("buildBudgetSankey", () => {
  it("balances: in-flow equals out-flow of the budget node", () => {
    const { links } = buildBudgetSankey(inputs);

    const inflow = links
      .filter((link) => link.target === SANKEY_BUDGET_NODE_ID)
      .reduce((sum, link) => sum + link.value, 0);
    const outflow = links
      .filter((link) => link.source === SANKEY_BUDGET_NODE_ID)
      .reduce((sum, link) => sum + link.value, 0);

    expect(inflow).toBeCloseTo(outflow, 6);
  });

  it("total inflow equals the expenditure", () => {
    const { links } = buildBudgetSankey(inputs);

    const inflow = links
      .filter((link) => link.target === SANKEY_BUDGET_NODE_ID)
      .reduce((sum, link) => sum + link.value, 0);

    expect(inflow).toBeCloseTo(new Decimal(inputs.expenditure).toNumber(), 6);
  });

  it("emits unique node ids", () => {
    const { nodes } = buildBudgetSankey(inputs);

    const ids = nodes.map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all link values are positive", () => {
    const { links } = buildBudgetSankey(inputs);

    for (const link of links) {
      expect(link.value).toBeGreaterThan(0);
    }
  });

  it("omits the rest node when destinations cover the expenditure", () => {
    const { nodes } = buildBudgetSankey({
      ...inputs,
      destinations: [{ id: "tot", name: "Tot", amount: "700" }],
    });

    expect(nodes.find((node) => node.id === "rest")).toBeUndefined();
  });

  it("merges a listed rest bucket into the single rest node", () => {
    const { nodes, links } = buildBudgetSankey({
      ...inputs,
      destinations: [
        ...inputs.destinations,
        { id: SANKEY_REST_NODE_ID, name: "Alte destinații", amount: "150" },
      ],
    });
    expect(
      nodes.filter((node) => node.id === SANKEY_REST_NODE_ID)
    ).toHaveLength(1);
    expect(
      links.find((link) => link.target === SANKEY_REST_NODE_ID)?.value
    ).toBe(200);
  });

  it("omits the deficit node on a surplus", () => {
    const { nodes } = buildBudgetSankey({
      revenue: "800",
      expenditure: "700",
      deficit: "-100",
      destinations: inputs.destinations,
    });

    expect(nodes.find((node) => node.id === "deficit")).toBeUndefined();
  });
});

describe("buildBudgetSankey grouping", () => {
  const many: BudgetSankeyInputs = {
    revenue: "900",
    expenditure: "1000",
    deficit: "100",
    destinations: Array.from({ length: 12 }, (_, index) => ({
      id: `d${index}`,
      name: `Destinația ${index}`,
      amount: String(100 - index * 5),
    })),
  };

  it("keeps only the largest destinations as their own flows", () => {
    const { nodes } = buildBudgetSankey({ ...many, maxDestinations: 3 });
    const destinationIds = nodes
      .map((node) => node.id)
      .filter((id) => /^d\d+$/.test(id));
    expect(destinationIds).toEqual(["d0", "d1", "d2"]);
  });

  it("orders the kept destinations by amount, largest first", () => {
    const shuffled = {
      ...many,
      destinations: [...many.destinations].reverse(),
      maxDestinations: 2,
    };
    const { links } = buildBudgetSankey(shuffled);
    const out = links
      .filter((link) => link.source === SANKEY_BUDGET_NODE_ID)
      .map((link) => link.target);
    expect(out).toEqual(["d0", "d1", SANKEY_REST_NODE_ID]);
  });

  it("returns the grouped destinations for the drill-down, largest first", () => {
    const { grouped } = buildBudgetSankey({ ...many, maxDestinations: 10 });
    expect(grouped.map((destination) => destination.id)).toEqual([
      "d10",
      "d11",
    ]);
    expect(grouped[0]?.amount).toBe("50");
  });

  it("folds the grouped amounts into the rest flow so totals still balance", () => {
    const { links, grouped } = buildBudgetSankey({
      ...many,
      maxDestinations: 4,
    });
    const rest = links.find((link) => link.target === SANKEY_REST_NODE_ID);
    const groupedTotal = grouped.reduce(
      (sum, destination) => sum.plus(destination.amount),
      new Decimal(0)
    );
    // 1000 − (100+95+90+85) = 630 = grouped (sum of the other 8) + uncovered rest
    expect(rest?.value).toBe(630);
    expect(groupedTotal.toNumber()).toBeLessThanOrEqual(630);
  });

  it("defaults to eight labelled destinations", () => {
    const { grouped } = buildBudgetSankey(many);
    expect(grouped).toHaveLength(4);
  });
});

describe("buildBudgetSankey minimum share (F2.7)", () => {
  const base: BudgetSankeyInputs = {
    revenue: "900",
    expenditure: "1000",
    deficit: "100",
    destinations: [
      { id: "big", name: "Mare", amount: "500" },
      { id: "mid", name: "Medie", amount: "300" },
      { id: "small", name: "Mică", amount: "20" },
    ],
  };

  it("groups flows under 3 % of expenditure even when the count allows them", () => {
    const { nodes, grouped } = buildBudgetSankey(base);
    expect(nodes.map((node) => node.id)).not.toContain("small");
    expect(grouped.map((destination) => destination.id)).toEqual(["small"]);
  });

  it("keeps a flow exactly at the threshold", () => {
    const { grouped } = buildBudgetSankey({
      ...base,
      destinations: [
        ...base.destinations,
        { id: "edge", name: "Prag", amount: "30" },
      ],
    });
    expect(grouped.map((destination) => destination.id)).toEqual(["small"]);
  });

  it("can be disabled with minShare 0", () => {
    const { grouped } = buildBudgetSankey({ ...base, minShare: 0 });
    expect(grouped).toEqual([]);
  });

  it("still balances the budget node after grouping", () => {
    const { links } = buildBudgetSankey(base);
    const out = links
      .filter((link) => link.source === SANKEY_BUDGET_NODE_ID)
      .reduce((sum, link) => sum.plus(link.value), new Decimal(0));
    expect(out.toNumber()).toBe(1000);
  });
});

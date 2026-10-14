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

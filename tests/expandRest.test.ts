import { describe, expect, it } from "vitest";
import { REST_ID, expandRest } from "../src/lib/expandRest";
import type { BudgetDestination } from "../src/data/budget2026";

const destinations: BudgetDestination[] = [
  { id: "68.03.00", name: "Pensii", amount: "500", percentOfTotal: "50" },
  {
    id: REST_ID,
    name: "Alte destinații",
    amount: "500",
    percentOfTotal: "50",
    subDestinations: [
      { id: "a", name: "A", amount: "10" },
      { id: "b", name: "B", amount: "200" },
      { id: "c", name: "C", amount: "50" },
      { id: "d", name: "D", amount: "100" },
      { id: "e", name: "E", amount: "40" },
      { id: "f", name: "F", amount: "60" },
      { id: "g", name: "G", amount: "40" },
    ],
  },
];

describe("expandRest", () => {
  it("promotes the five largest leftovers to their own destinations", () => {
    const expanded = expandRest(destinations);
    expect(expanded.map((d) => d.id)).toEqual([
      "68.03.00",
      "b",
      "d",
      "f",
      "c",
      "e",
      REST_ID,
    ]);
    expect(expanded.find((d) => d.id === "b")).toMatchObject({
      amount: "200",
      percentOfTotal: "20",
    });
  });

  it("keeps the remainder in a smaller rest bucket", () => {
    const rest = expandRest(destinations).at(-1);
    expect(rest).toMatchObject({
      id: REST_ID,
      amount: "50",
      percentOfTotal: "5",
    });
    expect(rest?.subDestinations?.map((d) => d.id)).toEqual(["g", "a"]);
  });

  it("preserves the total", () => {
    const total = expandRest(destinations).reduce(
      (sum, d) => sum + Number(d.amount),
      0
    );
    expect(total).toBe(1000);
  });

  it("leaves lists without a rest bucket untouched", () => {
    const plain = destinations.slice(0, 1);
    expect(expandRest(plain)).toEqual(plain);
  });
});

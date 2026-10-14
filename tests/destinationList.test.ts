import { describe, expect, it } from "vitest";
import type { BudgetDestination } from "../src/data/budget2026";
import { rankDestinations } from "../src/lib/destinationList";

function destination(id: string, amount: string): BudgetDestination {
  return { id, name: id, amount, percentOfTotal: "0" };
}

describe("rankDestinations", () => {
  it("orders by amount, largest first, comparing as decimals", () => {
    const ranked = rankDestinations([
      destination("a", "9.5"),
      destination("b", "100.25"),
      destination("c", "10"),
    ]);
    expect(ranked.map((d) => d.id)).toEqual(["b", "c", "a"]);
  });

  it("keeps the source order for equal amounts", () => {
    const ranked = rankDestinations([
      destination("a", "5.00"),
      destination("b", "7"),
      destination("c", "5"),
    ]);
    expect(ranked.map((d) => d.id)).toEqual(["b", "a", "c"]);
  });

  it("does not mutate its input", () => {
    const input = [destination("a", "1"), destination("b", "2")];
    rankDestinations(input);
    expect(input.map((d) => d.id)).toEqual(["a", "b"]);
  });
});

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { BudgetSummary } from "../src/api/client";
import { BudgetSankey } from "../src/components/charts/BudgetSankey";
import type { BudgetDestination } from "../src/data/budget2026";
import { LinguiProvider } from "../src/i18n";

const summary = {
  year: 2026,
  revenue: "900",
  expenditure: "1000",
  deficit: "100",
} as unknown as BudgetSummary;

const destinations: BudgetDestination[] = [
  { id: "big", name: "Mare", amount: "500", percentOfTotal: "50" },
  { id: "mid", name: "Medie", amount: "300", percentOfTotal: "30" },
  { id: "small", name: "Mică", amount: "20", percentOfTotal: "2" },
];

describe("BudgetSankey list fallback (F2.7)", () => {
  it("renders every drawn node as a list item with its amount", () => {
    render(
      <LinguiProvider>
        <BudgetSankey summary={summary} destinations={destinations} />
      </LinguiProvider>
    );
    const list = screen.getByTestId("sankey-mobile-list");
    const items = within(list).getAllByRole("listitem");
    // revenue, deficit, budget, two kept destinations, rest
    expect(items).toHaveLength(6);
    expect(list).toHaveTextContent("Mare");
    expect(list).not.toHaveTextContent("Mică");
    expect(list).toHaveTextContent("Alte destinații");
    expect(list).toHaveTextContent(/mld\. lei/);
  });
});

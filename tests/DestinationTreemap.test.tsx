import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DestinationTreemap } from "../src/components/charts/DestinationTreemap";
import type { BudgetDestination } from "../src/data/budget2026";
import { LinguiProvider } from "../src/i18n";

const DESTINATIONS: BudgetDestination[] = [
  { id: "edu", name: "Educație", amount: "40.5", percentOfTotal: "10.1" },
  { id: "pen", name: "Pensii", amount: "120", percentOfTotal: "30" },
  { id: "san", name: "Sănătate", amount: "60", percentOfTotal: "15" },
];

function renderTreemap(onSelect?: (id: string) => void) {
  return render(
    <LinguiProvider>
      <DestinationTreemap destinations={DESTINATIONS} onSelect={onSelect} />
    </LinguiProvider>
  );
}

describe("DestinationTreemap", () => {
  it("starts on the map with the toggle pressed on Hartă", () => {
    renderTreemap();
    expect(screen.getByRole("button", { name: "Hartă" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("swaps to an ordered list, largest first, keeping focus on the toggle", () => {
    renderTreemap();
    const table = screen.getByRole("button", { name: "Tabel" });
    table.focus();
    fireEvent.click(table);

    expect(table).toHaveAttribute("aria-pressed", "true");
    expect(document.activeElement).toBe(table);
    const list = screen.getByRole("list", {
      name: "Destinații, de la cea mai mare",
    });
    expect(list.tagName).toBe("OL");
    const items = within(list).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual([
      expect.stringContaining("Pensii"),
      expect.stringContaining("Sănătate"),
      expect.stringContaining("Educație"),
    ]);
    expect(items[0]).toHaveTextContent("30% din total");
  });

  it("opens the drill-down from a list item", () => {
    const onSelect = vi.fn();
    renderTreemap(onSelect);
    fireEvent.click(screen.getByRole("button", { name: "Tabel" }));
    fireEvent.click(screen.getByRole("button", { name: /Sănătate/ }));
    expect(onSelect).toHaveBeenCalledWith("san");
  });
});

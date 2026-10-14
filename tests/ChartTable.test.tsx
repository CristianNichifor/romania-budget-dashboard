import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChartTable } from "../src/components/shared/ChartTable";
import { LinguiProvider } from "../src/i18n";

const rows = [
  ["2022", "5,1%"],
  ["2023", "6,2%"],
  ["2024", "4,9%"],
];

describe("ChartTable", () => {
  it("is a closed disclosure that reads 'Afișează ca tabel'", () => {
    render(
      <LinguiProvider>
        <ChartTable
          caption="Inflație"
          headers={["Perioadă", "Valoare"]}
          rows={rows}
        />
      </LinguiProvider>
    );
    const details = screen.getByTestId("chart-table");
    expect(details).not.toHaveAttribute("open");
    expect(details.querySelector("summary")).toHaveTextContent(
      "Afișează ca tabel"
    );
  });

  it("lists one body row per chart point with the chart title as caption", () => {
    render(
      <LinguiProvider>
        <ChartTable
          caption="Inflație"
          headers={["Perioadă", "Valoare"]}
          rows={rows}
        />
      </LinguiProvider>
    );
    expect(screen.getByRole("table", { name: "Inflație" })).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(document.querySelectorAll("tbody tr")).toHaveLength(rows.length);
    expect(screen.getByText("6,2%")).toBeInTheDocument();
  });
});

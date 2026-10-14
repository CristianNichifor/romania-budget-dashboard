import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SocialContextMultiples } from "../src/components/charts/SocialContextMultiples";

const DATA = [
  { year: 2022, budgetMilliardeEur: 12.5, ins: 5.6 },
  { year: 2023, budgetMilliardeEur: 13.1, ins: null },
];

describe("SocialContextMultiples", () => {
  it("renders one titled panel per series, each naming its unit", () => {
    render(
      <SocialContextMultiples
        data={DATA}
        budgetLabel="Cheltuieli sănătate"
        budgetUnit="mld. EUR"
        insLabel="Mortalitate infantilă"
        insUnit="la 1.000 născuți vii"
      />
    );

    const panels = screen.getAllByRole("figure");
    expect(panels).toHaveLength(2);
    expect(
      within(panels[0]!).getByText("Cheltuieli sănătate")
    ).toBeInTheDocument();
    expect(within(panels[0]!).getByText("mld. EUR")).toBeInTheDocument();
    expect(
      within(panels[1]!).getByText("Mortalitate infantilă")
    ).toBeInTheDocument();
    expect(
      within(panels[1]!).getByText("la 1.000 născuți vii")
    ).toBeInTheDocument();
  });
});

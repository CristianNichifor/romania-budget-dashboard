import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GdpPerCapitaChart } from "../src/components/charts/GdpPerCapitaChart";
import { PensionAgeChart } from "../src/components/charts/PensionAgeChart";

const CHARTS = join(__dirname, "../src/components/charts");

describe("no dual axis (F2.4)", () => {
  it("no chart binds series to a second Y axis", () => {
    for (const file of readdirSync(CHARTS)) {
      const source = readFileSync(join(CHARTS, file), "utf8");
      expect(source, file).not.toMatch(/yAxisId|orientation="right"/);
    }
  });

  it("pensions and dependency are two labelled panels", () => {
    render(
      <PensionAgeChart
        data={[{ year: "2023", pensiiMilliarde: 120, oldAgeDependency: 30 }]}
        pensionsLabel="Pensii (mld. lei)"
        dependencyLabel="Dependența vârstnicilor"
        ariaLabel="Îmbătrânirea populației și pensiile"
      />
    );
    expect(screen.getAllByRole("figure")).toHaveLength(2);
    expect(screen.getByRole("figure", { name: /Pensii/ })).toBeInTheDocument();
    expect(
      screen.getByRole("figure", { name: /Dependența vârstnicilor/ })
    ).toBeInTheDocument();
  });

  it("GDP per capita and the EU27 index are two labelled panels", () => {
    render(
      <GdpPerCapitaChart
        data={[{ year: "2023", pps: 28000, eu27Index: 78 }]}
        ppsLabel="PIB/loc (PPS)"
        indexLabel="Indice UE27=100"
        ariaLabel="PIB pe locuitor"
      />
    );
    expect(screen.getAllByRole("figure")).toHaveLength(2);
    expect(screen.getByRole("figure", { name: /PPS/ })).toBeInTheDocument();
    expect(screen.getByRole("figure", { name: /UE27/ })).toBeInTheDocument();
  });
});

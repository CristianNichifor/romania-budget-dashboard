import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SourceBadge } from "../src/components/shared/SourceBadge";
import { LinguiProvider } from "../src/i18n";

describe("SourceBadge", () => {
  it("names the selected budget year", () => {
    render(
      <LinguiProvider>
        <SourceBadge source="source.budgetYear" values={{ year: 2024 }} />
      </LinguiProvider>
    );
    expect(
      screen.getByText("Sursă: Buget consolidat 2024")
    ).toBeInTheDocument();
  });

  it("does not pin the generic budget source to one year", () => {
    render(
      <LinguiProvider>
        <SourceBadge source="source.budget" />
      </LinguiProvider>
    );
    expect(screen.getByText("Sursă: Buget consolidat")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProvenanceLine } from "../src/components/shared/ProvenanceLine";
import { LinguiProvider } from "../src/i18n";

describe("ProvenanceLine", () => {
  it("renders `Date: sursă, an` as one paragraph", () => {
    render(
      <LinguiProvider>
        <ProvenanceLine source="provenance.budget" year={2026} />
      </LinguiProvider>
    );
    const line = screen.getByTestId("provenance-line");
    expect(line.tagName).toBe("P");
    expect(line).toHaveTextContent(
      /^Date: Buget consolidat \(Open Budget\), 2026$/
    );
  });

  it("shows a dash instead of a year when none is known", () => {
    render(
      <LinguiProvider>
        <ProvenanceLine source="provenance.budget" year={null} />
      </LinguiProvider>
    );
    expect(screen.getByTestId("provenance-line")).toHaveTextContent(/, —$/);
  });
});

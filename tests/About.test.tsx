import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LinguiProvider } from "../src/i18n";
import { About } from "../src/routes/About";

function renderAbout() {
  return render(
    <LinguiProvider>
      <About />
    </LinguiProvider>
  );
}

describe("About (design 05)", () => {
  it("has an in-page contents nav whose links point at existing sections", () => {
    const { container } = renderAbout();
    const nav = screen.getByRole("navigation", { name: "Cuprins" });
    const links = within(nav).getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(4);
    for (const link of links) {
      const id = link.getAttribute("href")?.slice(1) ?? "";
      expect(container.querySelector(`section#${id}`)).not.toBeNull();
    }
  });

  it("lists every source in a table with use and licence columns", () => {
    renderAbout();
    const table = screen.getByRole("table", {
      name: "Surse de date și licențe",
    });
    const headers = within(table).getAllByRole("columnheader");
    expect(headers.map((header) => header.textContent)).toEqual([
      "Sursă",
      "Folosită pentru",
      "Licență",
    ]);
    expect(table.querySelectorAll("tbody tr")).toHaveLength(7);
    expect(
      within(table).getByRole("link", { name: "Eurostat" })
    ).toBeInTheDocument();
    expect(
      within(table).getAllByRole("link", { name: "CC BY 4.0" })
    ).toHaveLength(2);
  });

  it("states the formulas and the estimate rule in a method section", () => {
    renderAbout();
    const method = screen
      .getByRole("heading", { name: "Metodă" })
      .closest("section");
    expect(method).not.toBeNull();
    expect(method).toHaveTextContent("CAS 25%");
    expect(method).toHaveTextContent("CASS 10%");
    expect(method).toHaveTextContent("2,25%");
    expect(method).toHaveTextContent(/estimare/);
  });
});

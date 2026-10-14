import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { HUB_URL, HubLink } from "../src/components/layout/HubLink";
import { LinguiProvider } from "../src/i18n";
import { activateLocale } from "../src/i18n-core";

afterEach(() => {
  act(() => activateLocale("ro"));
});

describe("HubLink", () => {
  it("links back to the hub root", () => {
    render(
      <LinguiProvider>
        <HubLink />
      </LinguiProvider>
    );
    const link = screen.getByRole("link", { name: /Proiecte civice/ });
    expect(link).toHaveAttribute("href", HUB_URL);
    expect(HUB_URL).toBe("https://projects.cristian-nichifor.com/");
  });

  it("is a 44 px target", () => {
    render(
      <LinguiProvider>
        <HubLink />
      </LinguiProvider>
    );
    expect(screen.getByRole("link")).toHaveClass("min-h-11");
  });

  it("uses the English hub name in English", () => {
    act(() => activateLocale("en"));
    render(
      <LinguiProvider>
        <HubLink />
      </LinguiProvider>
    );
    expect(
      screen.getByRole("link", { name: /Civic projects/ })
    ).toBeInTheDocument();
  });
});

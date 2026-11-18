import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "../src/components/layout/ThemeToggle";
import { LinguiProvider } from "../src/i18n";
import { THEME_STORAGE_KEY } from "../src/lib/theme";

function renderToggle() {
  return render(
    <LinguiProvider>
      <ThemeToggle />
    </LinguiProvider>
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    vi.stubGlobal("CSS", { supports: () => true });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it("switches to dark, marks <html> and remembers the choice", () => {
    renderToggle();
    const button = screen.getByRole("button", { name: "Temă întunecată" });
    expect(button).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(button);

    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("starts from the stored choice", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    renderToggle();
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("is a 44 px target", () => {
    renderToggle();
    expect(screen.getByRole("button")).toHaveClass("size-11");
  });

  it("is hidden where the dark theme cannot render", () => {
    vi.stubGlobal("CSS", { supports: () => false });
    renderToggle();
    expect(screen.queryByRole("button")).toBeNull();
  });
});

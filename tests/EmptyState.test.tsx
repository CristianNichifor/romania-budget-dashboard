import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "../src/components/shared/EmptyState";

describe("EmptyState", () => {
  it("renders the reason without a button when there is no action", () => {
    render(<EmptyState>Nu există date.</EmptyState>);
    expect(screen.getByText("Nu există date.")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("offers one 44 px button that runs the action", () => {
    const onClick = vi.fn();
    render(
      <EmptyState action={{ label: "Vezi anul 2026", onClick }}>
        Nu există date demo pentru anul 2025.
      </EmptyState>
    );
    const button = screen.getByRole("button", { name: "Vezi anul 2026" });
    expect(button).toHaveClass("min-h-11");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });
});

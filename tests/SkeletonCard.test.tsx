import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SkeletonCard } from "../src/components/shared/SkeletonCard";
import { LinguiProvider } from "../src/i18n";

const SLOW_TEXT = "Serverul răspunde greu — mai așteptăm câteva secunde.";

describe("SkeletonCard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("stays a silent, hidden skeleton under two seconds", () => {
    render(
      <LinguiProvider>
        <SkeletonCard className="h-10" />
      </LinguiProvider>
    );
    act(() => {
      vi.advanceTimersByTime(1900);
    });
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.queryByText(SLOW_TEXT)).toBeNull();
  });

  it("announces that the server is slow after two seconds", () => {
    render(
      <LinguiProvider>
        <SkeletonCard className="h-10" />
      </LinguiProvider>
    );
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByRole("status")).toHaveTextContent(SLOW_TEXT);
  });

  it("clears its timer on unmount", () => {
    const { unmount } = render(
      <LinguiProvider>
        <SkeletonCard className="h-10" />
      </LinguiProvider>
    );
    unmount();
    expect(() => {
      act(() => {
        vi.advanceTimersByTime(2500);
      });
    }).not.toThrow();
    expect(vi.getTimerCount()).toBe(0);
  });
});

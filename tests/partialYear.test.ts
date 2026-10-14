import { describe, expect, it } from "vitest";
import { isPartialYear } from "../src/lib/partialYear";

describe("isPartialYear", () => {
  it("trusts an explicit partial flag from the BFF", () => {
    expect(isPartialYear({ year: 2024, partial: true }, 2026)).toBe(true);
    expect(isPartialYear({ year: 2026, partial: false }, 2026)).toBe(false);
  });

  it("treats the current calendar year as partial without a flag", () => {
    expect(isPartialYear({ year: 2026 }, 2026)).toBe(true);
    expect(isPartialYear({ year: 2025 }, 2026)).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { calculateSalaryBreakdown } from "../src/lib/salary";
import { buildSalaryWaterfallRows } from "../src/lib/waterfall";

describe("buildSalaryWaterfallRows", () => {
  it("starts at the employer cost and ends at net salary", () => {
    const breakdown = calculateSalaryBreakdown(9427);
    expect(breakdown).not.toBeNull();
    if (breakdown === null) {
      return;
    }

    const rows = buildSalaryWaterfallRows(breakdown);

    expect(rows.length).toBe(breakdown.entries.length);
    expect(rows[0]?.kind).toBe("total");
    expect(rows[0]?.end).toBeCloseTo(breakdown.employerCost.toNumber(), 6);

    const last = rows.at(-1);
    expect(last?.kind).toBe("net");
    expect(last?.end).toBeCloseTo(breakdown.net.toNumber(), 6);
  });

  it("keeps rows consistent: each row starts where the previous ended", () => {
    const breakdown = calculateSalaryBreakdown(12_000);
    expect(breakdown).not.toBeNull();
    if (breakdown === null) {
      return;
    }

    const rows = buildSalaryWaterfallRows(breakdown);

    for (let index = 1; index < rows.length - 1; index += 1) {
      const previous = rows[index - 1];
      const current = rows[index];
      expect(current?.start).toBeCloseTo(previous?.end ?? 0, 6);
    }
  });

  it("deduction rows carry negative amounts", () => {
    const breakdown = calculateSalaryBreakdown(9427);
    expect(breakdown).not.toBeNull();
    if (breakdown === null) {
      return;
    }

    const rows = buildSalaryWaterfallRows(breakdown);
    const deductions = rows.filter((row) => row.kind === "decrease");

    expect(deductions.length).toBeGreaterThan(0);
    for (const row of deductions) {
      expect(row.amount).toBeLessThan(0);
    }
  });

  it("marks only the opening total and the closing net as non-deductions", () => {
    const breakdown = calculateSalaryBreakdown(9427);
    expect(breakdown).not.toBeNull();
    if (breakdown === null) {
      return;
    }
    const rows = buildSalaryWaterfallRows(breakdown);
    expect(rows.filter((row) => row.kind === "total")).toHaveLength(1);
    expect(rows.filter((row) => row.kind === "net")).toHaveLength(1);
    expect(rows.at(-1)?.kind).toBe("net");
  });
});

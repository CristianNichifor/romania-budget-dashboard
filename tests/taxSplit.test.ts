import { Decimal } from "decimal.js";
import { describe, expect, it } from "vitest";
import { BUDGET_DESTINATIONS } from "../src/data/budget2026";
import { splitContribution } from "../src/lib/taxSplit";

const dest = (id: string, amount: string) => ({
  id,
  name: id,
  amount,
  percentOfTotal: "0",
});

describe("splitContribution", () => {
  it("splits pro rata by amount, largest first", () => {
    const rows = splitContribution(new Decimal(100), [
      dest("b", "25"),
      dest("a", "75"),
    ]);
    expect(rows.map((row) => row.id)).toEqual(["a", "b"]);
    expect(rows.map((row) => row.amount.toString())).toEqual(["75", "25"]);
    expect(rows.map((row) => row.perLeu.toString())).toEqual(["0.75", "0.25"]);
  });

  it("sums exactly to the contribution; the last row absorbs rounding", () => {
    const total = new Decimal("100");
    const rows = splitContribution(total, [
      dest("a", "1"),
      dest("b", "1"),
      dest("c", "1"),
    ]);
    expect(rows.map((row) => row.amount.toString())).toEqual([
      "33.33",
      "33.33",
      "33.34",
    ]);
    const sum = rows.reduce((acc, row) => acc.plus(row.amount), new Decimal(0));
    expect(sum.equals(total)).toBe(true);
  });

  it("sums exactly for a real salary against the seed destinations", () => {
    const total = new Decimal("4321.987654");
    const rows = splitContribution(total, BUDGET_DESTINATIONS);
    const sum = rows.reduce((acc, row) => acc.plus(row.amount), new Decimal(0));
    expect(sum.equals(total.toDecimalPlaces(2))).toBe(true);
    expect(rows.every((row) => row.amount.decimalPlaces() <= 2)).toBe(true);
  });

  it("ignores destinations without a positive amount", () => {
    const rows = splitContribution(new Decimal(10), [
      dest("a", "10"),
      dest("zero", "0"),
      dest("neg", "-5"),
      dest("bad", "n/a"),
    ]);
    expect(rows.map((row) => row.id)).toEqual(["a"]);
    expect(rows[0]?.amount.toString()).toBe("10");
  });

  it("returns nothing without a contribution or destinations", () => {
    expect(splitContribution(new Decimal(0), [dest("a", "1")])).toEqual([]);
    expect(splitContribution(new Decimal(10), [])).toEqual([]);
  });
});

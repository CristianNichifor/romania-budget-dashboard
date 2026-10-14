import { describe, expect, it } from "vitest";
import {
  EUR_RON_ANNUAL,
  convertAmount,
  parseCurrency,
  withCurrency,
} from "../src/lib/currency";

describe("parseCurrency", () => {
  it("reads eur and defaults everything else to lei", () => {
    expect(parseCurrency("eur")).toBe("eur");
    expect(parseCurrency("lei")).toBe("lei");
    expect(parseCurrency(undefined)).toBe("lei");
    expect(parseCurrency("usd")).toBe("lei");
    expect(parseCurrency(42)).toBe("lei");
  });
});

describe("convertAmount", () => {
  it("is the identity within one currency", () => {
    expect(convertAmount("9427", "lei", "lei").toString()).toBe("9427");
    expect(convertAmount("100", "eur", "eur").toString()).toBe("100");
  });

  it("converts with the bundled annual rate", () => {
    expect(EUR_RON_ANNUAL.rate).toBe("5.0424");
    expect(convertAmount("100", "eur", "lei").toString()).toBe("504.24");
    expect(convertAmount("504.24", "lei", "eur").toString()).toBe("100");
  });

  it("accepts an explicit rate", () => {
    expect(convertAmount("10", "eur", "lei", "5").toString()).toBe("50");
  });
});

describe("withCurrency", () => {
  it("sets eur and keeps other params", () => {
    expect(withCurrency({ an: "2025" }, "eur")).toEqual({
      an: "2025",
      currency: "eur",
    });
  });

  it("drops the param for the lei default", () => {
    expect(withCurrency({ an: "2025", currency: "eur" }, "lei")).toEqual({
      an: "2025",
    });
  });
});

import { afterEach, describe, expect, it } from "vitest";
import { activateLocale } from "../src/i18n-core";
import {
  activeLocale,
  formatEur,
  formatLei,
  formatMilliarde,
  formatMilliardeLei,
  formatNumber,
  formatPercent,
  formatSignedPercent,
} from "../src/lib/format";

afterEach(() => {
  activateLocale("ro");
});

describe("formatLei", () => {
  it("formats with Romanian grouping", () => {
    expect(formatLei("9427")).toBe("9.427 lei");
  });

  it("accepts Decimal values", () => {
    expect(formatLei("1000000")).toBe("1.000.000 lei");
  });

  it("formats with English grouping on English pages", () => {
    expect(formatLei("9427", "en")).toBe("9,427 lei");
  });
});

describe("formatMilliardeLei", () => {
  it("formats billions with one decimal", () => {
    expect(formatMilliardeLei("217814450000")).toBe("217,8 mld. lei");
  });

  it("formats smaller amounts", () => {
    expect(formatMilliardeLei("35928663000")).toBe("35,9 mld. lei");
  });

  it("uses the English unit and decimal point in English", () => {
    expect(formatMilliardeLei("217814450000", "en")).toBe("217.8 bn lei");
  });
});

describe("formatMilliarde", () => {
  it("formats values already in billions", () => {
    expect(formatMilliarde(12.34)).toBe("12,3 mld. lei");
    expect(formatMilliarde(12.34, "en")).toBe("12.3 bn lei");
  });
});

describe("formatPercent", () => {
  it("formats with one decimal and Romanian comma", () => {
    expect(formatPercent("7.1")).toBe("7,1%");
    expect(formatPercent("54.93")).toBe("54,9%");
  });

  it("formats with a decimal point in English", () => {
    expect(formatPercent("7.1", "en")).toBe("7.1%");
  });
});

describe("formatSignedPercent", () => {
  it("prefixes positive and negative values", () => {
    expect(formatSignedPercent("7.2")).toBe("+7,2%");
    expect(formatSignedPercent("-2.3")).toBe("−2,3%");
  });

  it("keeps the sign and switches the separator in English", () => {
    expect(formatSignedPercent("-2.3", "en")).toBe("−2.3%");
  });
});

describe("formatNumber / formatEur", () => {
  it("groups and rounds per locale", () => {
    expect(formatNumber(1234567.89)).toBe("1.234.568");
    expect(formatNumber(1234567.89, { locale: "en" })).toBe("1,234,568");
    expect(formatNumber(2.345, { maximumFractionDigits: 2 })).toBe("2,35");
    expect(formatEur(1234)).toBe("1.234 €");
    expect(formatEur(1234, "en")).toBe("1,234 €");
  });
});

describe("default locale follows the active Lingui locale", () => {
  it("formats Romanian when the /ro/ locale is active", () => {
    activateLocale("ro");
    expect(activeLocale()).toBe("ro");
    expect(formatMilliardeLei("217814450000")).toBe("217,8 mld. lei");
    expect(formatLei("9427")).toBe("9.427 lei");
  });

  it("formats English when the English locale is active", () => {
    activateLocale("en");
    expect(activeLocale()).toBe("en");
    expect(formatMilliardeLei("217814450000")).toBe("217.8 bn lei");
    expect(formatLei("9427")).toBe("9,427 lei");
    expect(formatPercent("7.1")).toBe("7.1%");
  });
});

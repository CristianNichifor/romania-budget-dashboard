import { Decimal } from "decimal.js";

export type Currency = "lei" | "eur";

/** URL search param that carries the display currency across tabs. */
export const CURRENCY_PARAM = "currency";

/**
 * ECB annual average EUR/RON reference rate for 2025 (data API series
 * EXR/A.RON.EUR.SP00.A, checked 2026-10-14). A single bundled rate keeps
 * static mode deterministic; it is shown next to every converted chart.
 */
export const EUR_RON_ANNUAL = {
  year: "2025",
  rate: "5.0424",
} as const;

/** "eur" when the param says so; lei is the default for anything else. */
export function parseCurrency(value: unknown): Currency {
  return value === "eur" ? "eur" : "lei";
}

/** Converts an amount between lei and euro at `rate` lei per euro. */
export function convertAmount(
  value: Decimal.Value,
  from: Currency,
  to: Currency,
  rate: Decimal.Value = EUR_RON_ANNUAL.rate
): Decimal {
  const amount = new Decimal(value);
  if (from === to) {
    return amount;
  }
  return from === "eur" ? amount.mul(rate) : amount.div(rate);
}

/** Search params with the currency set; lei, the default, drops the param. */
export function withCurrency(
  search: Record<string, unknown>,
  currency: Currency
): Record<string, unknown> {
  const { [CURRENCY_PARAM]: _previous, ...rest } = search;
  return currency === "lei" ? rest : { ...rest, [CURRENCY_PARAM]: currency };
}

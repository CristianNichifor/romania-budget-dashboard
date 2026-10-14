import { i18n } from "@lingui/core";
import { Decimal } from "decimal.js";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./routeTable";
import type { DecimalValue } from "./salary";

/**
 * One formatter module for every number the UI shows. The locale follows the
 * page: `/ro/…` formats Romanian ("217,8 mld. lei"), the English paths format
 * English ("217.8 bn lei"). Callers may pass the locale explicitly; by default
 * it is the Lingui locale the router activated from the path.
 */

const BCP47: Record<Locale, string> = { ro: "ro-RO", en: "en-GB" };

const BILLION_SUFFIX: Record<Locale, string> = { ro: "mld. lei", en: "bn lei" };

const BILLION = new Decimal(1_000_000_000);

const formatterCache = new Map<string, Intl.NumberFormat>();

function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** The active UI locale; falls back to the site default before activation. */
export function activeLocale(): Locale {
  const current = i18n.locale;
  return typeof current === "string" && isLocale(current)
    ? current
    : DEFAULT_LOCALE;
}

function numberFormatter(
  locale: Locale,
  maximumFractionDigits: number,
  minimumFractionDigits = 0
): Intl.NumberFormat {
  const key = `${locale}:${minimumFractionDigits}:${maximumFractionDigits}`;
  let formatter = formatterCache.get(key);
  if (formatter === undefined) {
    formatter = new Intl.NumberFormat(BCP47[locale], {
      minimumFractionDigits,
      maximumFractionDigits,
    });
    formatterCache.set(key, formatter);
  }
  return formatter;
}

export interface FormatNumberOptions {
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  locale?: Locale;
}

/** "9.427" (ro) / "9,427" (en) — plain number with locale grouping. */
export function formatNumber(
  value: DecimalValue | number,
  options: FormatNumberOptions = {}
): string {
  const locale = options.locale ?? activeLocale();
  const number =
    typeof value === "number" ? value : new Decimal(value).toNumber();
  return numberFormatter(
    locale,
    options.maximumFractionDigits ?? 0,
    options.minimumFractionDigits ?? 0
  ).format(number);
}

/** "9.427 lei" (ro) / "9,427 lei" (en) */
export function formatLei(value: DecimalValue, locale?: Locale): string {
  return `${formatNumber(value, { locale })} lei`;
}

/** "1.234 €" (ro) / "1,234 €" (en) */
export function formatEur(
  value: DecimalValue | number,
  locale?: Locale
): string {
  return `${formatNumber(value, { locale })} €`;
}

/** "217,8 mld. lei" (ro) / "217.8 bn lei" (en) */
export function formatMilliardeLei(
  value: DecimalValue,
  locale: Locale = activeLocale()
): string {
  const milliarde = new Decimal(value).div(BILLION).toNumber();
  return `${formatNumber(milliarde, { maximumFractionDigits: 1, locale })} ${BILLION_SUFFIX[locale]}`;
}

/** Same unit, for values already expressed in billions of lei. */
export function formatMilliarde(
  milliarde: number,
  locale: Locale = activeLocale()
): string {
  return `${formatNumber(milliarde, { maximumFractionDigits: 1, locale })} ${BILLION_SUFFIX[locale]}`;
}

/** "7,1%" (ro) / "7.1%" (en) */
export function formatPercent(value: DecimalValue, locale?: Locale): string {
  return `${formatNumber(value, { maximumFractionDigits: 1, locale })}%`;
}

/** "+7,2%" / "−2,3%" (ro); "+7.2%" / "−2.3%" (en) */
export function formatSignedPercent(
  value: DecimalValue,
  locale?: Locale
): string {
  const number = new Decimal(value).toNumber();
  const formatted = formatNumber(Math.abs(number), {
    maximumFractionDigits: 1,
    locale,
  });
  return number >= 0 ? `+${formatted}%` : `−${formatted}%`;
}

/**
 * What the UI shows for a value it does not have: an em dash, never 0 and
 * never an empty cell, so a missing year cannot be read as a real zero.
 */
export const MISSING = "—";

/**
 * `formatter(value)` when the value is usable, `MISSING` otherwise. Unusable:
 * `null`, `undefined`, an empty string, or a number that is not finite.
 */
export function formatOrMissing<T>(
  value: T | null | undefined,
  formatter: (value: T) => string
): string {
  if (value === null || value === undefined || value === "") {
    return MISSING;
  }
  if (typeof value === "number" && !Number.isFinite(value)) {
    return MISSING;
  }
  return formatter(value);
}

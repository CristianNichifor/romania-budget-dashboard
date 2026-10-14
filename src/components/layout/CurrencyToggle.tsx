import { useLingui } from "@lingui/react";
import { cn } from "../../lib/cn";
import type { Currency } from "../../lib/currency";
import { m } from "../../messages";
import { useCurrency } from "../../store/useCurrency";

const OPTIONS: Array<{ value: Currency; label: string }> = [
  { value: "lei", label: "lei" },
  { value: "eur", label: "€" },
];

/** lei/€ switch for the wage charts; the choice lives in `?currency=`. */
export function CurrencyToggle() {
  const { i18n } = useLingui();
  const [currency, setCurrency] = useCurrency();

  return (
    <div
      role="group"
      aria-label={i18n._(m["currency.label"])}
      className="flex overflow-hidden rounded-md border border-slate-200"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={currency === option.value}
          onClick={() => setCurrency(option.value)}
          className={cn(
            "min-h-6 px-2 py-1 text-xs font-medium",
            currency === option.value
              ? "bg-budget-blue text-white"
              : "bg-white text-slate-600 hover:bg-slate-50"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

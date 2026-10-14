import { useLingui } from "@lingui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchBudgetYears } from "../../api/client";
import { m } from "../../messages";
import {
  pickDefaultYear,
  useBudgetYearStore,
} from "../../store/useBudgetYearStore";

/**
 * Segmented control that picks the budget year for the balance sections
 * (KPIs, sankey, treemap, drilldown). The current year is marked as
 * in-progress because its amounts grow as monthly reports land.
 */
export function YearSelector() {
  const { i18n } = useLingui();
  const year = useBudgetYearStore((state) => state.year);
  const setYear = useBudgetYearStore((state) => state.setYear);

  const { data: years } = useQuery({
    queryKey: ["budget-years"],
    queryFn: fetchBudgetYears,
  });

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (year === null && years !== undefined) {
      const defaultYear = pickDefaultYear(years);
      if (defaultYear !== null) {
        setYear(defaultYear);
      }
    }
  }, [year, years, setYear]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-slate-700">
        {i18n._(m["year.label"])}
      </span>
      <div
        role="group"
        aria-label={i18n._(m["year.groupLabel"])}
        className="flex flex-wrap rounded-lg border border-slate-200 bg-white p-1 shadow-sm"
      >
        {(years ?? []).map((option) => {
          const selected = year === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              className={
                selected
                  ? "rounded-md bg-budget-blue px-3 py-1.5 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-budget-blue"
                  : "rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-budget-blue"
              }
              onClick={() => setYear(option)}
            >
              {option}
              {option === currentYear && (
                <span
                  className={
                    selected
                      ? "ml-1.5 text-xs font-normal text-white"
                      : "ml-1.5 text-xs font-normal text-amber-800"
                  }
                >
                  {i18n._(m["year.inProgress"])}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { useLingui } from "@lingui/react";
import { useQuery } from "@tanstack/react-query";
import type { Decimal } from "decimal.js";
import { fetchBudgetYears, fetchDestinations } from "../../api/client";
import { BUDGET_YEAR } from "../../data/budget2026";
import { expandRest } from "../../lib/expandRest";
import { formatNumber } from "../../lib/format";
import { splitContribution } from "../../lib/taxSplit";
import { m } from "../../messages";
import { QueryError } from "./SectionError";
import { SkeletonCard } from "./SkeletonCard";
import { SourceBadge } from "./SourceBadge";

/** The latest year that has destinations; the seed year when none does. */
async function latestDestinations() {
  const years = await fetchBudgetYears();
  const latest = Math.max(...years, BUDGET_YEAR);
  const destinations = await fetchDestinations(String(latest));
  if (destinations.length > 0 || latest === BUDGET_YEAR) {
    return { year: latest, destinations };
  }
  return {
    year: BUDGET_YEAR,
    destinations: await fetchDestinations(String(BUDGET_YEAR)),
  };
}

/**
 * "What 1 leu of your tax buys": the monthly state contribution split pro
 * rata by the budget's destination shares. An estimate, and labelled so —
 * taxes are not earmarked.
 */
export function LeuBridge({ contribution }: { contribution: Decimal }) {
  const { i18n } = useLingui();
  const query = useQuery({
    queryKey: ["destinations-latest"],
    queryFn: latestDestinations,
  });
  const data = query.data;
  const rows =
    data === undefined
      ? []
      : splitContribution(contribution, expandRest(data.destinations));
  const bani = (perLeu: Decimal) =>
    formatNumber(perLeu.mul(100), { maximumFractionDigits: 1 });
  const lei = (amount: Decimal) =>
    `${formatNumber(amount, { maximumFractionDigits: 2, minimumFractionDigits: 2 })} lei`;

  return (
    <section className="space-y-4" aria-labelledby="leu-bridge-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="leu-bridge-title" className="text-xl font-bold">
            {i18n._(m["leuBridge.title"])}
          </h2>
          <p className="text-sm text-slate-500">
            {i18n._({
              ...m["leuBridge.description"],
              values: { amount: lei(contribution.toDecimalPlaces(2)) },
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <SourceBadge source="leuBridge.estimate" />
          {data !== undefined && (
            <SourceBadge
              source="source.budgetYear"
              values={{ year: data.year }}
            />
          )}
        </div>
      </div>

      {rows.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <table className="w-full text-sm" data-testid="leu-bridge">
            <thead>
              <tr className="text-left text-xs text-slate-500">
                <th className="pb-2 font-medium">
                  {i18n._(m["leuBridge.destination"])}
                </th>
                <th className="pb-2 text-right font-medium">
                  {i18n._(m["leuBridge.perLeu"])}
                </th>
                <th className="pb-2 text-right font-medium">
                  {i18n._(m["leuBridge.perMonth"])}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="py-1.5 pr-3">
                    <span className="block">{row.name}</span>
                    <span
                      aria-hidden="true"
                      className="mt-1 block h-1.5 rounded-full bg-budget-blue"
                      style={{ width: `${row.perLeu.mul(100).toNumber()}%` }}
                    />
                  </td>
                  <td className="py-1.5 text-right tabular-nums">
                    {bani(row.perLeu)} {i18n._(m["leuBridge.bani"])}
                  </td>
                  <td className="py-1.5 text-right font-semibold tabular-nums">
                    {lei(row.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-slate-500">
            {i18n._(m["leuBridge.note"])}
          </p>
        </div>
      )}
      <QueryError query={query} title={i18n._(m["leuBridge.title"])} />
      {query.isPending && <SkeletonCard className="h-64" />}
    </section>
  );
}

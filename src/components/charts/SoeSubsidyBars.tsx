import { useLingui } from "@lingui/react";
import { Decimal } from "decimal.js";
import type { SoeSubsidies } from "../../api/client";
import { formatLei, formatMilliardeLei } from "../../lib/format";
import { m } from "../../messages";

interface SoeSubsidyBarsProps {
  subsidies: SoeSubsidies;
  limit?: number;
}

/**
 * Horizontal bar list of the top subsidy operators. Pure divs (no chart
 * library) so every row stays accessible and readable on mobile.
 */
export function SoeSubsidyBars({ subsidies, limit = 12 }: SoeSubsidyBarsProps) {
  const { i18n } = useLingui();

  const operators = subsidies.operators.slice(0, limit);
  const maxSubsidy = operators.reduce(
    (max, operator) => Decimal.max(max, new Decimal(operator.subsidy)),
    new Decimal(1)
  );

  return (
    <div>
      <p className="mb-3 text-sm text-slate-600">
        {i18n._({
          ...m["soe.subsidies.total"],
          values: {
            year: subsidies.year,
            total: formatMilliardeLei(subsidies.total),
          },
        })}
      </p>
      <ul className="space-y-2">
        {operators.map((operator) => {
          const width = new Decimal(operator.subsidy)
            .div(maxSubsidy)
            .times(100)
            .toNumber();
          return (
            <li
              key={operator.cui}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{operator.name}</p>
                <p className="truncate text-xs text-slate-500">
                  {operator.uat}
                  {operator.sector !== "" ? ` · ${operator.sector}` : ""}
                </p>
                <div
                  aria-hidden="true"
                  className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100"
                >
                  <div
                    className="h-2 rounded-full bg-budget-blue"
                    style={{ width: `${Math.max(width, 1)}%` }}
                  />
                </div>
              </div>
              <span className="tabular-nums text-sm font-semibold text-slate-700">
                {formatLei(operator.subsidy)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

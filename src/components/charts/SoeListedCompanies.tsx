import { useLingui } from "@lingui/react";
import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import type { SoeListed } from "../../api/client";
import {
  MISSING,
  formatLei,
  formatMilliarde,
  formatPercent,
} from "../../lib/format";
import { m } from "../../messages";

interface SoeListedCompaniesProps {
  listed: SoeListed;
}

function PriceSparkline({
  points,
}: {
  points: { ym: string; priceLei: number }[];
}) {
  const data = points.map((point) => ({ ym: point.ym, price: point.priceLei }));
  const last = points.at(-1);
  const first = points[0];
  const positive =
    last !== undefined &&
    first !== undefined &&
    last.priceLei >= first.priceLei;

  return (
    <div className="flex items-center gap-2">
      <div className="h-12 w-28">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 4, right: 2, bottom: 4, left: 2 }}
          >
            <YAxis hide domain={["dataMin", "dataMax"]} />
            <Line
              type="monotone"
              dataKey="price"
              stroke={positive ? "#0f766e" : "#dc2626"}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <span className="tabular-nums text-sm font-semibold">
        {last !== undefined ? formatLei(last.priceLei) : MISSING}
      </span>
    </div>
  );
}

export function SoeListedCompanies({ listed }: SoeListedCompaniesProps) {
  const { i18n } = useLingui();

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {listed.companies.map((company) => {
        const lastProfit = company.yearlyProfit.at(-1);
        return (
          <li
            key={company.ticker}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{company.name}</p>
                <p className="text-xs text-slate-500">
                  {company.ticker} · {company.ministry}
                </p>
              </div>
              <span className="rounded-md bg-budget-blue/10 px-2 py-0.5 text-xs font-semibold text-budget-blue">
                {i18n._({
                  ...m["soe.listed.state"],
                  values: { percent: formatPercent(company.statePercent) },
                })}
              </span>
            </div>
            <div className="mt-3">
              <PriceSparkline points={company.monthlyPrice} />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {i18n._(m["soe.listed.profit"])}:{" "}
              <span className="tabular-nums font-medium text-slate-700">
                {lastProfit !== undefined
                  ? `${formatMilliarde(lastProfit.profitMldLei)} (${lastProfit.year})`
                  : MISSING}
              </span>
            </p>
          </li>
        );
      })}
    </ul>
  );
}

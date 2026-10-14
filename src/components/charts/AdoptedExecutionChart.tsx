import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLingui } from "@lingui/react";
import type { AdoptedExecutionChartPoint } from "../../lib/adoptedComparison";
import { formatMilliarde } from "../../lib/format";
import { m } from "../../messages";

interface AdoptedExecutionChartProps {
  data: AdoptedExecutionChartPoint[];
}

function DeficitTooltip({
  active,
  payload,
  label,
  adoptedLabel,
  executedLabel,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{
    name?: string | number;
    payload?: AdoptedExecutionChartPoint;
  }>;
  label?: string | number;
  adoptedLabel: string;
  executedLabel: string;
}) {
  if (active !== true || payload === undefined || payload.length === 0) {
    return null;
  }
  const datum = payload[0]?.payload;
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2 text-xs shadow-md">
      <p className="font-semibold">{label ?? ""}</p>
      {datum !== undefined && (
        <>
          <p className="tabular-nums text-slate-600">
            {adoptedLabel}: {formatMilliarde(datum.adoptedDeficitMld)}
          </p>
          {datum.executedDeficitMld !== null && (
            <p className="tabular-nums text-slate-600">
              {executedLabel}: {formatMilliarde(datum.executedDeficitMld)}
            </p>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Deficit depth per year: adopted (law) vs executed (reports). Both are
 * negative in the data; the chart plots their magnitude.
 */
export function AdoptedExecutionChart({ data }: AdoptedExecutionChartProps) {
  const { i18n } = useLingui();
  const adoptedLabel = i18n._(m["comparison.legend.adopted"]);
  const executedLabel = i18n._(m["comparison.legend.executed"]);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="year" />
          <YAxis
            tickFormatter={(value: number) => formatMilliarde(value)}
            width={70}
          />
          <Tooltip
            content={(props) => (
              <DeficitTooltip
                {...props}
                adoptedLabel={adoptedLabel}
                executedLabel={executedLabel}
              />
            )}
          />
          <Legend />
          <Bar
            dataKey="adoptedDeficitMld"
            name={adoptedLabel}
            fill="#94a3b8"
            radius={[3, 3, 0, 0]}
            isAnimationActive={false}
          />
          <Bar
            dataKey="executedDeficitMld"
            name={executedLabel}
            fill="#dc2626"
            radius={[3, 3, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

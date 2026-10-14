import {
  Bar,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MISSING, formatMilliarde, formatNumber } from "../../lib/format";
import type { PensionAgePoint } from "../../lib/macro";

interface PensionAgeChartProps {
  data: PensionAgePoint[];
  pensionsLabel: string;
  dependencyLabel: string;
  ariaLabel: string;
}

function PensionAgeTooltip({
  active,
  payload,
  label,
  pensionsLabel,
  dependencyLabel,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{
    name?: string | number;
    payload?: PensionAgePoint;
  }>;
  label?: string | number;
  pensionsLabel: string;
  dependencyLabel: string;
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
            {pensionsLabel}:{" "}
            {datum.pensiiMilliarde === null
              ? MISSING
              : formatMilliarde(datum.pensiiMilliarde)}
          </p>
          <p className="tabular-nums text-slate-600">
            {dependencyLabel}:{" "}
            {datum.oldAgeDependency === null
              ? MISSING
              : formatNumber(datum.oldAgeDependency, {
                  maximumFractionDigits: 1,
                })}
          </p>
        </>
      )}
    </div>
  );
}

/**
 * Pensions spending bars (left axis, milliarde lei) against the old-age
 * dependency ratio line (right axis, 65+ per 100 aged 15–64).
 */
export function PensionAgeChart({
  data,
  pensionsLabel,
  dependencyLabel,
  ariaLabel,
}: PensionAgeChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
          aria-label={ariaLabel}
        >
          <XAxis dataKey="year" />
          <YAxis
            yAxisId="pensions"
            tickFormatter={(value: number) => `${value} mld.`}
            width={70}
          />
          <YAxis yAxisId="dependency" orientation="right" width={44} />
          <Tooltip
            content={(props) => (
              <PensionAgeTooltip
                {...props}
                pensionsLabel={pensionsLabel}
                dependencyLabel={dependencyLabel}
              />
            )}
          />
          <Legend />
          <Bar
            yAxisId="pensions"
            dataKey="pensiiMilliarde"
            name={pensionsLabel}
            fill="#2563eb"
            radius={[3, 3, 0, 0]}
            isAnimationActive={false}
          />
          <Line
            yAxisId="dependency"
            dataKey="oldAgeDependency"
            name={dependencyLabel}
            stroke="#dc2626"
            strokeWidth={2}
            dot
            isAnimationActive={false}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

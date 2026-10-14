import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMilliarde, formatNumber } from "../../lib/format";
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
              ? "—"
              : formatMilliarde(datum.pensiiMilliarde)}
          </p>
          <p className="tabular-nums text-slate-600">
            {dependencyLabel}:{" "}
            {datum.oldAgeDependency === null
              ? "—"
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
 * Pensions spending and the old-age dependency ratio as two small multiples
 * with one y-axis each: bars in milliarde lei, then a line with 65+ per 100
 * aged 15–64. Each panel is headed by its series label.
 */
export function PensionAgeChart({
  data,
  pensionsLabel,
  dependencyLabel,
  ariaLabel,
}: PensionAgeChartProps) {
  const tooltip = (
    <Tooltip
      content={(props) => (
        <PensionAgeTooltip
          {...props}
          pensionsLabel={pensionsLabel}
          dependencyLabel={dependencyLabel}
        />
      )}
    />
  );
  return (
    <div className="grid w-full gap-4 md:grid-cols-2" aria-label={ariaLabel}>
      <section>
        <h3 className="mb-1 text-sm font-medium text-slate-700">
          {pensionsLabel}
        </h3>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
            >
              <XAxis dataKey="year" />
              <YAxis
                tickFormatter={(value: number) => `${value} mld.`}
                width={70}
              />
              {tooltip}
              <Bar
                dataKey="pensiiMilliarde"
                name={pensionsLabel}
                fill="#2563eb"
                radius={[3, 3, 0, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section>
        <h3 className="mb-1 text-sm font-medium text-slate-700">
          {dependencyLabel}
        </h3>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
            >
              <XAxis dataKey="year" />
              <YAxis width={44} />
              {tooltip}
              <Line
                dataKey="oldAgeDependency"
                name={dependencyLabel}
                stroke="#dc2626"
                strokeWidth={2}
                dot
                isAnimationActive={false}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

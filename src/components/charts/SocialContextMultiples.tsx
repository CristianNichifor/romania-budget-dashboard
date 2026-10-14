import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MISSING, formatNumber } from "../../lib/format";
import type { DualTrendPoint } from "../../lib/trendJoin";

interface SocialContextMultiplesProps {
  data: DualTrendPoint[];
  budgetLabel: string;
  budgetUnit: string;
  insLabel: string;
  insUnit: string;
}

function Panel({
  title,
  unit,
  children,
}: {
  title: string;
  unit: string;
  children: React.ReactElement;
}) {
  return (
    <figure className="min-w-0" aria-label={`${title} (${unit})`}>
      <figcaption className="mb-1">
        <span className="block text-sm font-semibold text-slate-700">
          {title}
        </span>
        <span className="block text-xs text-slate-500">{unit}</span>
      </figcaption>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </figure>
  );
}

const tooltipValue =
  (unit: string) =>
  (value: unknown): string =>
    typeof value === "number"
      ? `${formatNumber(value, { maximumFractionDigits: 1 })} ${unit}`
      : MISSING;

/**
 * Health spending and the chosen INS indicator as two small multiples on a
 * shared year axis. Each panel has its own labelled Y axis, so neither
 * series' scale can be read against the other's.
 */
export function SocialContextMultiples({
  data,
  budgetLabel,
  budgetUnit,
  insLabel,
  insUnit,
}: SocialContextMultiplesProps) {
  const axisLabel = (unit: string) => ({
    value: unit,
    angle: -90,
    position: "insideLeft" as const,
    style: { fontSize: 11, fill: "#64748b", textAnchor: "middle" as const },
  });

  return (
    <div className="grid gap-6 md:grid-cols-2" data-testid="social-multiples">
      <Panel title={budgetLabel} unit={budgetUnit}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} />
          <YAxis
            tick={{ fontSize: 11 }}
            width={56}
            label={axisLabel(budgetUnit)}
            tickFormatter={(value: number) =>
              formatNumber(value, { maximumFractionDigits: 1 })
            }
          />
          <Tooltip
            formatter={(value) => [
              tooltipValue(budgetUnit)(value),
              budgetLabel,
            ]}
            contentStyle={{ fontSize: 12 }}
          />
          <Bar
            dataKey="budgetMilliardeEur"
            name={budgetLabel}
            fill="#2563eb"
            radius={[3, 3, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </Panel>
      <Panel title={insLabel} unit={insUnit}>
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} />
          <YAxis
            tick={{ fontSize: 11 }}
            width={56}
            label={axisLabel(insUnit)}
            tickFormatter={(value: number) =>
              formatNumber(value, { maximumFractionDigits: 1 })
            }
          />
          <Tooltip
            formatter={(value) => [tooltipValue(insUnit)(value), insLabel]}
            contentStyle={{ fontSize: 12 }}
          />
          <Line
            dataKey="ins"
            name={insLabel}
            stroke="#dc2626"
            strokeWidth={2}
            dot
            isAnimationActive={false}
            connectNulls
          />
        </LineChart>
      </Panel>
    </div>
  );
}

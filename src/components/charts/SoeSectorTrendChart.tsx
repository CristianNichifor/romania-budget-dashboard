import { useLingui } from "@lingui/react";
import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SoeSectorTrend } from "../../api/client";
import { m } from "../../messages";

interface SoeSectorTrendChartProps {
  trend: SoeSectorTrend;
}

const LINE_COLORS = [
  "#2563eb",
  "#dc2626",
  "#0f766e",
  "#b45309",
  "var(--chart-violet)",
  "var(--chart-neutral)",
];

export function SoeSectorTrendChart({ trend }: SoeSectorTrendChartProps) {
  const { i18n } = useLingui();

  const data = useMemo(() => {
    const years = Array.from(
      new Set(
        trend.sectors.flatMap((sector) => sector.series.map((p) => p.year))
      )
    ).sort((a, b) => a - b);
    return years.map((year) => {
      const row: Record<string, number> = { year };
      for (const sector of trend.sectors) {
        const point = sector.series.find((entry) => entry.year === year);
        if (point !== undefined) {
          row[sector.key] = point.lossPercent;
        }
      }
      return row;
    });
  }, [trend]);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 12, right: 16, bottom: 8, left: 0 }}
          aria-label={i18n._(m["soe.sectors.title"])}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11 }}
            tickFormatter={(value: number) => String(value)}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(value: number) => `${value}%`}
            label={{
              value: i18n._(m["soe.sectors.y"]),
              angle: -90,
              position: "insideLeft",
              fontSize: 11,
              style: { textAnchor: "middle", fill: "var(--chart-text)" },
            }}
            width={58}
          />
          <Tooltip
            formatter={(value) => [`${String(value)}%`]}
            labelFormatter={(label) => `An ${String(label)}`}
            contentStyle={{ fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {trend.sectors.map((sector, index) => (
            <Line
              key={sector.key}
              type="monotone"
              dataKey={sector.key}
              name={sector.label}
              stroke={
                LINE_COLORS[index % LINE_COLORS.length] ??
                "var(--chart-neutral)"
              }
              strokeWidth={2}
              dot={{ r: 2.5 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

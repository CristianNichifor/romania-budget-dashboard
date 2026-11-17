import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { shortQuarter } from "../../lib/macro";

interface GdpGrowthBarsProps {
  data: { quarter: string; pctChange: number }[];
  ariaLabel: string;
}

/**
 * Quarterly GDP growth as bars, coloured by sign (green growth, red
 * contraction), with a zero reference line.
 */
export function GdpGrowthBars({ data, ariaLabel }: GdpGrowthBarsProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 12, right: 16, bottom: 4, left: 0 }}
          aria-label={ariaLabel}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="quarter"
            tick={{ fontSize: 11 }}
            tickFormatter={shortQuarter}
            minTickGap={24}
          />
          <YAxis tick={{ fontSize: 11 }} width="auto" unit="%" />
          <Tooltip
            formatter={(value) => [`${Number(value).toFixed(1)}%`]}
            labelFormatter={(label) => String(label)}
            contentStyle={{ fontSize: 12 }}
          />
          <ReferenceLine y={0} stroke="#94a3b8" />
          <Bar dataKey="pctChange" isAnimationActive={false}>
            {data.map((point) => (
              <Cell
                key={point.quarter}
                fill={point.pctChange >= 0 ? "#16a34a" : "#dc2626"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

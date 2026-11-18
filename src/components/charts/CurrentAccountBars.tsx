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
import type { CurrentAccountBarPoint } from "../../lib/macro";

interface CurrentAccountBarsProps {
  data: CurrentAccountBarPoint[];
  ariaLabel: string;
}

/**
 * Quarterly current account balance (mld. EUR): red bars for deficits,
 * green for surpluses, with a zero reference line.
 */
export function CurrentAccountBars({
  data,
  ariaLabel,
}: CurrentAccountBarsProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 12, right: 16, bottom: 4, left: 0 }}
          aria-label={ariaLabel}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis
            dataKey="quarter"
            tick={{ fontSize: 11 }}
            tickFormatter={shortQuarter}
            minTickGap={24}
          />
          <YAxis tick={{ fontSize: 11 }} width="auto" unit=" mld." />
          <Tooltip
            formatter={(value) => [`${Number(value).toFixed(1)} mld. €`]}
            labelFormatter={(label) => String(label)}
            contentStyle={{ fontSize: 12 }}
          />
          <ReferenceLine y={0} stroke="var(--chart-axis)" />
          <Bar dataKey="balanceMldEur" isAnimationActive={false}>
            {data.map((point) => (
              <Cell
                key={point.quarter}
                fill={point.balanceMldEur >= 0 ? "#16a34a" : "#dc2626"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

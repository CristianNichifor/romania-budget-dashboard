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
import type { SocietySpendingPoint } from "../../lib/society";

interface SocietySpendingChartProps {
  data: SocietySpendingPoint[];
  healthLabel: string;
  educationLabel: string;
  ariaLabel: string;
}

/**
 * Health and education government spending, percent of GDP, as two lines.
 */
export function SocietySpendingChart({
  data,
  healthLabel,
  educationLabel,
  ariaLabel,
}: SocietySpendingChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 12, right: 16, bottom: 4, left: 0 }}
          aria-label={ariaLabel}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} minTickGap={24} />
          <YAxis tick={{ fontSize: 11 }} width="auto" unit="%" />
          <Tooltip
            formatter={(value, name) => [
              `${Number(value).toFixed(1)}%`,
              String(name),
            ]}
            labelFormatter={(label) => String(label)}
            contentStyle={{ fontSize: 12 }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="healthPctGdp"
            name={healthLabel}
            stroke="#dc2626"
            strokeWidth={2}
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="educationPctGdp"
            name={educationLabel}
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

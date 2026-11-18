import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TradeBalanceChartProps {
  data: {
    year: string;
    exportsPctGdp: number;
    importsPctGdp: number;
    balancePctGdp: number;
  }[];
  exportsLabel: string;
  importsLabel: string;
  balanceLabel: string;
  ariaLabel: string;
}

/**
 * Exports and imports as percent of GDP with the derived balance as a
 * dashed line against the zero reference.
 */
export function TradeBalanceChart({
  data,
  exportsLabel,
  importsLabel,
  balanceLabel,
  ariaLabel,
}: TradeBalanceChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
          aria-label={ariaLabel}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} unit="%" width="auto" />
          <Tooltip
            formatter={(value) => [`${Number(value).toFixed(1)}%`]}
            contentStyle={{ fontSize: 12 }}
          />
          <Legend />
          <ReferenceLine y={0} stroke="var(--chart-axis)" />
          <Line
            type="monotone"
            dataKey="exportsPctGdp"
            name={exportsLabel}
            stroke="#2563eb"
            strokeWidth={2}
            dot
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="importsPctGdp"
            name={importsLabel}
            stroke="var(--chart-text)"
            strokeWidth={2}
            dot
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="balancePctGdp"
            name={balanceLabel}
            stroke="#dc2626"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

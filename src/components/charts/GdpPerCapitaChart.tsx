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
import { formatNumber } from "../../lib/format";

interface GdpPerCapitaChartProps {
  data: { year: string; pps: number; eu27Index: number }[];
  ppsLabel: string;
  indexLabel: string;
  ariaLabel: string;
}

/**
 * GDP per capita in PPS (left axis) alongside the EU27 = 100 volume index
 * (right axis, reference line at 100).
 */
export function GdpPerCapitaChart({
  data,
  ppsLabel,
  indexLabel,
  ariaLabel,
}: GdpPerCapitaChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
          aria-label={ariaLabel}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="year" tick={{ fontSize: 11 }} />
          <YAxis
            yAxisId="pps"
            tick={{ fontSize: 11 }}
            tickFormatter={(value?: number) => formatNumber(value ?? 0)}
            width={64}
          />
          <YAxis
            yAxisId="index"
            orientation="right"
            tick={{ fontSize: 11 }}
            width={40}
          />
          <Tooltip
            formatter={(value, name) => [
              name === "pps"
                ? formatNumber(Number(value ?? 0))
                : `${Number(value ?? 0).toFixed(0)}`,
            ]}
            contentStyle={{ fontSize: 12 }}
          />
          <Legend />
          <ReferenceLine
            yAxisId="index"
            y={100}
            stroke="#059669"
            strokeDasharray="5 5"
            label={{
              value: "UE 100",
              position: "insideTopRight",
              fontSize: 11,
              fill: "#047857",
            }}
          />
          <Line
            yAxisId="pps"
            type="monotone"
            dataKey="pps"
            name={ppsLabel}
            stroke="#2563eb"
            strokeWidth={2}
            dot
            isAnimationActive={false}
          />
          <Line
            yAxisId="index"
            type="monotone"
            dataKey="eu27Index"
            name={indexLabel}
            stroke="#059669"
            strokeWidth={2}
            dot
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

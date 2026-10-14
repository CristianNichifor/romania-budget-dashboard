import {
  CartesianGrid,
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
 * GDP per capita as two small multiples with one y-axis each: the level in
 * PPS, and the EU27 = 100 volume index with a reference line at 100. Each
 * panel is headed by its series label, so colour is never the only key.
 */
export function GdpPerCapitaChart({
  data,
  ppsLabel,
  indexLabel,
  ariaLabel,
}: GdpPerCapitaChartProps) {
  return (
    <div className="grid w-full gap-4 md:grid-cols-2" aria-label={ariaLabel}>
      <section>
        <h3 className="mb-1 text-sm font-medium text-slate-700">{ppsLabel}</h3>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(value?: number) => formatNumber(value ?? 0)}
                width={64}
              />
              <Tooltip
                formatter={(value) => [formatNumber(Number(value ?? 0))]}
                contentStyle={{ fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="pps"
                name={ppsLabel}
                stroke="#2563eb"
                strokeWidth={2}
                dot
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section>
        <h3 className="mb-1 text-sm font-medium text-slate-700">
          {indexLabel}
        </h3>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={40} />
              <Tooltip
                formatter={(value) => [`${Number(value ?? 0).toFixed(0)}`]}
                contentStyle={{ fontSize: 12 }}
              />
              <ReferenceLine
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
      </section>
    </div>
  );
}

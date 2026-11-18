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

interface RegionGdpBarProps {
  data: { code: string; label: string; indexEu27: number }[];
  ariaLabel: string;
}

/**
 * Horizontal bar chart of NUTS2 GDP per inhabitant (index EU27 = 100),
 * with a reference line at the EU27 average. Bars above 100 are richer
 * than the EU average.
 */
export function RegionGdpBar({ data, ariaLabel }: RegionGdpBarProps) {
  const sorted = [...data].sort((a, b) => a.indexEu27 - b.indexEu27);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 12, right: 24, bottom: 4, left: 8 }}
          aria-label={ariaLabel}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis
            type="number"
            tick={{ fontSize: 11 }}
            unit=""
            domain={[0, "dataMax"]}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={116}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(value) => [`${Number(value).toFixed(0)}`, "EU27 = 100"]}
            labelFormatter={(label) => String(label)}
            contentStyle={{ fontSize: 12 }}
          />
          <ReferenceLine x={100} stroke="#f59e0b" strokeDasharray="5 5" />
          <Bar dataKey="indexEu27" isAnimationActive={false}>
            {sorted.map((point) => (
              <Cell
                key={point.code}
                fill={point.indexEu27 >= 100 ? "#16a34a" : "#2563eb"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

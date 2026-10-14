import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MISSING } from "../../lib/format";

export interface SmallMultiplePanel {
  title: string;
  dataKey: string;
  kind: "bar" | "line";
  color: string;
  format: (value: number) => string;
  /** Optional horizontal reference, e.g. EU27 = 100. */
  reference?: { y: number; label: string };
}

interface SmallMultiplesProps {
  data: object[];
  xKey: string;
  panels: SmallMultiplePanel[];
  ariaLabel: string;
}

/**
 * One single-axis chart per series on a shared X axis, so no series can be
 * read against another's scale (no dual axis, F2.4).
 */
export function SmallMultiples({
  data,
  xKey,
  panels,
  ariaLabel,
}: SmallMultiplesProps) {
  return (
    <div
      className="grid gap-6 md:grid-cols-2"
      role="group"
      aria-label={ariaLabel}
    >
      {panels.map((panel) => {
        const axis = (
          <YAxis
            tick={{ fontSize: 11 }}
            width={64}
            tickFormatter={(value: number) => panel.format(value)}
          />
        );
        const tooltip = (
          <Tooltip
            formatter={(value) => [
              typeof value === "number" ? panel.format(value) : MISSING,
              panel.title,
            ]}
            contentStyle={{ fontSize: 12 }}
          />
        );
        const reference = panel.reference && (
          <ReferenceLine
            y={panel.reference.y}
            stroke={panel.color}
            strokeDasharray="5 5"
            label={{
              value: panel.reference.label,
              position: "insideTopRight",
              fontSize: 11,
              fill: panel.color,
            }}
          />
        );
        const margin = { top: 8, right: 8, left: 0, bottom: 0 };
        return (
          <figure
            key={panel.dataKey}
            className="min-w-0"
            aria-label={panel.title}
          >
            <figcaption className="mb-1 text-sm font-semibold text-slate-700">
              {panel.title}
            </figcaption>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {panel.kind === "bar" ? (
                  <BarChart data={data} margin={margin}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
                    {axis}
                    {tooltip}
                    {reference}
                    <Bar
                      dataKey={panel.dataKey}
                      name={panel.title}
                      fill={panel.color}
                      radius={[3, 3, 0, 0]}
                      isAnimationActive={false}
                    />
                  </BarChart>
                ) : (
                  <LineChart data={data} margin={margin}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
                    {axis}
                    {tooltip}
                    {reference}
                    <Line
                      type="monotone"
                      dataKey={panel.dataKey}
                      name={panel.title}
                      stroke={panel.color}
                      strokeWidth={2}
                      dot
                      connectNulls
                      isAnimationActive={false}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </figure>
        );
      })}
    </div>
  );
}

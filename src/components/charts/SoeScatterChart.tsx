import { useLingui } from "@lingui/react";
import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SoeScatter } from "../../api/client";
import { formatLei, formatPercent } from "../../lib/format";
import { MARGIN_LIMIT, clampMargin } from "../../lib/soeScatter";
import { m } from "../../messages";

interface SoeScatterChartProps {
  scatter: SoeScatter;
  minWage: number | null;
  onSelect?: (cui: string) => void;
}

interface ScatterDatum {
  cui: string;
  name: string;
  marginPercent: number;
  /** Margin on the clipped ±100% axis. */
  plottedMargin: number;
  offScale: boolean;
  maxSalary: number;
  employees: number;
  annualCost: string;
}

function ScatterTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: ScatterDatum }>;
}) {
  const { i18n } = useLingui();
  if (active !== true || payload === undefined || payload.length === 0) {
    return null;
  }

  const point = payload[0]?.payload;
  if (point === undefined) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2 text-xs shadow-md">
      <p className="font-semibold">{point.name}</p>
      <p className="tabular-nums text-slate-600">
        {formatPercent(point.marginPercent)} · {formatLei(point.maxSalary)}{" "}
        {i18n._(m["salary.perMonth"])}
      </p>
    </div>
  );
}

export function SoeScatterChart({
  scatter,
  minWage,
  onSelect,
}: SoeScatterChartProps) {
  const { i18n } = useLingui();

  const data: ScatterDatum[] = scatter.points.map((point) => ({
    cui: point.cui,
    name: point.name,
    marginPercent: point.marginPercent,
    plottedMargin: clampMargin(point.marginPercent).plotted,
    offScale: clampMargin(point.marginPercent).offScale,
    maxSalary: Number(point.maxSalary),
    employees: point.employees,
    annualCost: point.annualCost,
  }));

  const onScale = data.filter((point) => !point.offScale);
  const offScale = data.filter((point) => point.offScale);

  return (
    <div className="space-y-2">
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 16, right: 16, bottom: 8, left: 8 }}
            aria-label={i18n._(m["soe.scatter.title"])}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              dataKey="plottedMargin"
              domain={[-MARGIN_LIMIT, MARGIN_LIMIT]}
              allowDataOverflow
              ticks={[-100, -50, 0, 50, 100]}
              name={i18n._(m["soe.scatter.x"])}
              tickFormatter={(value: number) => `${value}%`}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="maxSalary"
              name={i18n._(m["soe.scatter.y"])}
              tickFormatter={(value: number) => formatLei(value)}
              tick={{ fontSize: 11 }}
              width={86}
            />
            <ReferenceLine
              x={0}
              stroke="#64748b"
              strokeWidth={1.5}
              label={{
                value: i18n._(m["soe.scatter.breakEven"]),
                position: "insideTopRight",
                fontSize: 11,
                fill: "#64748b",
              }}
            />
            {minWage !== null && minWage > 0 && (
              <ReferenceLine
                y={minWage}
                stroke="#f59e0b"
                strokeDasharray="5 5"
                label={{
                  value: i18n._(m["soe.scatter.minWage"]),
                  position: "insideBottomRight",
                  fontSize: 11,
                  fill: "#b45309",
                }}
              />
            )}
            {[
              { points: onScale, fill: "#2563eb", shape: "circle" as const },
              { points: offScale, fill: "#dc2626", shape: "triangle" as const },
            ].map((series) => (
              <Scatter
                key={series.shape}
                name={i18n._(m["soe.scatter.title"])}
                data={series.points}
                fill={series.fill}
                shape={series.shape}
                fillOpacity={0.65}
                isAnimationActive={false}
                onClick={(entry) => {
                  const cui = (entry.payload as ScatterDatum | undefined)?.cui;
                  if (cui !== undefined && onSelect !== undefined) {
                    onSelect(cui);
                  }
                }}
              />
            ))}
            <Tooltip
              content={(props) => <ScatterTooltip {...props} />}
              cursor={{ strokeDasharray: "3 3", stroke: "#94a3b8" }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      {offScale.length > 0 && (
        <p className="text-xs text-slate-500">
          {i18n._({
            ...m["soe.scatter.offScale"],
            values: { count: offScale.length },
          })}
        </p>
      )}
    </div>
  );
}

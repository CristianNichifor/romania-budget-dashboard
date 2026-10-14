import { i18n } from "@lingui/core";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type BarShapeProps,
} from "recharts";
import { convertAmount, type Currency } from "../../lib/currency";
import { formatEur, formatLei } from "../../lib/format";
import type { WaterfallRow } from "../../lib/waterfall";
import { lookupMessage } from "../../messages";

interface WaterfallChartDatum {
  name: string;
  base: number;
  value: number;
  kind: WaterfallRow["kind"];
}

interface SalaryWaterfallProps {
  rows: WaterfallRow[];
  currency?: Currency;
}

/** Waterfall rows are lei; € values are converted at the display boundary. */
function toChartData(
  rows: WaterfallRow[],
  currency: Currency
): WaterfallChartDatum[] {
  const shown = (lei: number) =>
    convertAmount(lei, "lei", currency).toDecimalPlaces(0).toNumber();
  return rows.map((row) => ({
    name: row.labelKey,
    base: shown(Math.min(row.start, row.end)),
    value: shown(Math.abs(row.amount)),
    kind: row.kind,
  }));
}

function formatMoney(value: number, currency: Currency): string {
  return currency === "eur" ? formatEur(value) : formatLei(value);
}

function WaterfallBar(props: BarShapeProps) {
  const { x, y, width, height, payload } = props;
  const kind = (payload as WaterfallChartDatum | undefined)?.kind;
  const fill = kind === "total" ? "#2563eb" : "#dc2626";

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      rx={2}
      stroke="none"
    />
  );
}

function WaterfallTooltip({
  active,
  payload,
  labelId,
  currency,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: WaterfallChartDatum }>;
  labelId: (id: string) => string;
  currency: Currency;
}) {
  if (active !== true || payload === undefined || payload.length === 0) {
    return null;
  }

  const datum = payload[0]?.payload;
  if (datum === undefined) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2 text-xs shadow-md">
      <p className="font-semibold">{labelId(datum.name)}</p>
      <p className="tabular-nums text-slate-600">
        {formatMoney(datum.value, currency)}
      </p>
    </div>
  );
}

/**
 * Waterfall: employer cost → deductions → net salary.
 * Recharts has no native waterfall; built from stacked bars with a
 * transparent base series (same composition technique as the official
 * candlestick example). Blue = totals, red = deductions.
 */
export function SalaryWaterfall({
  rows,
  currency = "lei",
}: SalaryWaterfallProps) {
  const data = toChartData(rows, currency);

  return (
    <div
      className="h-96 w-full"
      data-testid="salary-waterfall"
      data-currency={currency}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 24, right: 8, left: 32, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            interval={0}
            angle={-30}
            textAnchor="end"
            height={110}
            tick={{ fontSize: 11, fill: "#475569" }}
            tickFormatter={(id: string) => i18n._(lookupMessage(id))}
          />
          <YAxis
            tickFormatter={(value: number) => formatMoney(value, currency)}
            width={90}
          />
          <Tooltip
            content={(props) => (
              <WaterfallTooltip
                {...props}
                labelId={(id) => i18n._(lookupMessage(id))}
                currency={currency}
              />
            )}
            cursor={{ fill: "#f1f5f9" }}
          />
          <Bar
            dataKey="base"
            stackId="waterfall"
            fill="transparent"
            isAnimationActive={false}
          />
          <Bar
            dataKey="value"
            stackId="waterfall"
            shape={(props) => <WaterfallBar {...props} />}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="value"
              position="top"
              fontSize={11}
              fill="#334155"
              formatter={(value: unknown) =>
                typeof value === "number" ? formatMoney(value, currency) : ""
              }
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

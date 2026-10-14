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
import { useLingui } from "@lingui/react";
import { shortQuarter } from "../../lib/macro";
import { ChartTable } from "../shared/ChartTable";
import { CsvDownloadButton } from "../shared/CsvDownloadButton";
import { m } from "../../messages";

interface MacroTrendChartProps {
  data: { label: string; value: number }[];
  color: string;
  valueFormatter: (value: number) => string;
  ariaLabel: string;
  reference?: { value: number; label: string };
  heightClass?: string;
  /** When set, renders a CSV download button for the series. */
  exportFilename?: string;
}

function shortLabel(label: string): string {
  if (/^\d{4}$/.test(label)) {
    return label;
  }
  if (/^\d{4}-Q\d$/.test(label)) {
    return shortQuarter(label);
  }
  if (/^\d{4}-S\d$/.test(label)) {
    return `${label.slice(0, 4)} S${label.slice(6)}`;
  }
  if (/^\d{4}-\d{2}$/.test(label)) {
    return label.endsWith("-01") ? label.slice(0, 4) : label.slice(0, 7);
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(label)) {
    return label.slice(0, 7);
  }
  return "";
}

export function MacroTrendChart({
  data,
  color,
  valueFormatter,
  ariaLabel,
  reference,
  heightClass = "h-72",
  exportFilename,
}: MacroTrendChartProps) {
  const { i18n } = useLingui();

  return (
    <div>
      {exportFilename !== undefined && (
        <div className="mb-2 flex justify-end">
          <CsvDownloadButton
            filename={exportFilename}
            headers={[
              i18n._(m["chart.csv.period"]),
              i18n._(m["chart.csv.value"]),
            ]}
            rows={data.map((point) => [point.label, point.value])}
          />
        </div>
      )}
      <div className={`w-full ${heightClass}`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 12, right: 16, bottom: 4, left: 0 }}
            aria-label={ariaLabel}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              tickFormatter={shortLabel}
              minTickGap={24}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={valueFormatter}
              width={56}
              domain={["auto", "auto"]}
            />
            <Tooltip
              formatter={(value) => [valueFormatter(Number(value))]}
              labelFormatter={(label) => String(label)}
              contentStyle={{ fontSize: 12 }}
            />
            {reference !== undefined && (
              <ReferenceLine
                y={reference.value}
                stroke="#f59e0b"
                strokeDasharray="5 5"
                label={{
                  value: reference.label,
                  position: "insideTopRight",
                  fontSize: 11,
                  fill: "#b45309",
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <ChartTable
        caption={ariaLabel}
        headers={[i18n._(m["chart.csv.period"]), i18n._(m["chart.csv.value"])]}
        rows={data.map((point) => [point.label, valueFormatter(point.value)])}
      />
    </div>
  );
}

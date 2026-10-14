import { useLingui } from "@lingui/react";
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
import type { RealWageSeries } from "../../api/client";
import { convertAmount, type Currency } from "../../lib/currency";
import { formatEur, formatLei } from "../../lib/format";
import { m } from "../../messages";

interface RealWageLineProps {
  series: RealWageSeries["series"];
  currency?: Currency;
}

/** The series is in €; lei values are converted at the display boundary. */
function inCurrency(
  series: RealWageSeries["series"],
  currency: Currency
): RealWageSeries["series"] {
  if (currency === "eur") {
    return series;
  }
  const lei = (eur: number) =>
    convertAmount(eur, "eur", "lei").toDecimalPlaces(0).toNumber();
  return series.map((point) => ({
    ...point,
    nominalEur: lei(point.nominalEur),
    realEur: lei(point.realEur),
  }));
}

function formatMoney(value: number, currency: Currency): string {
  return currency === "eur" ? formatEur(value) : formatLei(value);
}

function RealWageTooltip({
  active,
  payload,
  label,
  currency = "eur",
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
  label?: string;
  currency?: Currency;
}) {
  if (active !== true || payload === undefined || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2 text-xs shadow-md">
      <p className="font-semibold">{label ?? ""}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="tabular-nums text-slate-600">
          {entry.name}: {formatMoney(entry.value, currency)}
        </p>
      ))}
    </div>
  );
}

export function RealWageLine({ series, currency = "eur" }: RealWageLineProps) {
  const { i18n } = useLingui();

  return (
    <div
      className="h-72 w-full"
      data-testid="real-wage"
      data-currency={currency}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={inCurrency(series, currency)}
          margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="quarter" />
          <YAxis
            tickFormatter={(value: number) => formatMoney(value, currency)}
            width={90}
          />
          <Tooltip content={<RealWageTooltip currency={currency} />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="nominalEur"
            name={i18n._(m["realWage.nominal"])}
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="realEur"
            name={i18n._(m["realWage.real"])}
            stroke="#dc2626"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

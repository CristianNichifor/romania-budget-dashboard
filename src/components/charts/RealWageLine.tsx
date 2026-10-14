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
import { formatEur } from "../../lib/format";
import { m } from "../../messages";

interface RealWageLineProps {
  series: RealWageSeries["series"];
}

function RealWageTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
  label?: string;
}) {
  if (active !== true || payload === undefined || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2 text-xs shadow-md">
      <p className="font-semibold">{label ?? ""}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="tabular-nums text-slate-600">
          {entry.name}: {formatEur(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function RealWageLine({ series }: RealWageLineProps) {
  const { i18n } = useLingui();

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={series}
          margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="quarter" />
          <YAxis
            tickFormatter={(value: number) => formatEur(value)}
            width={90}
          />
          <Tooltip content={<RealWageTooltip />} />
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

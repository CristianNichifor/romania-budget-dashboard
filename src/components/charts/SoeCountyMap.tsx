import { i18n } from "@lingui/core";
import { useLingui } from "@lingui/react";
import { useMemo } from "react";
import { Tooltip, Treemap, ResponsiveContainer } from "recharts";
import type { SoeByCounty } from "../../api/client";
import { formatMilliardeLei, formatPercent } from "../../lib/format";
import { pickIntensityColor } from "../../lib/investmentColor";
import { m } from "../../messages";

interface SoeCountyMapProps {
  byCounty: SoeByCounty;
}

type TreemapDatum = {
  name: string;
  amount: number;
  companies: number;
  onLoss: number;
  lossPercent: number;
};

interface CellProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  amount?: number;
  companies?: number;
  onLoss?: number;
  lossPercent?: number;
  minLoss: number;
  maxLoss: number;
}

function CountyCell(props: CellProps) {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    name,
    amount = 0,
    companies = 0,
    onLoss = 0,
    lossPercent = 0,
    minLoss,
    maxLoss,
  } = props;

  const fill = pickIntensityColor(lossPercent, minLoss, maxLoss);

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} rx={4}>
        <title>
          {`${name ?? ""} — ${i18n._({
            ...m["soe.county.summary"],
            values: {
              companies,
              onLoss,
              lossPercent: formatPercent(lossPercent),
            },
          })} · ${formatMilliardeLei(amount)}`}
        </title>
      </rect>
      {width > 58 && height > 34 && (
        <text
          x={x + 6}
          y={y + 16}
          fontSize={11}
          fill={
            fill === "#2563eb" || fill === "#60a5fa" ? "#ffffff" : "#1e3a5f"
          }
          fontWeight={600}
        >
          {name ?? ""}
        </text>
      )}
      {width > 58 && height > 52 && (
        <text
          x={x + 6}
          y={y + 32}
          fontSize={10}
          fill={
            fill === "#2563eb" || fill === "#60a5fa" ? "#dbeafe" : "#1d4ed8"
          }
        >
          {i18n._({
            ...m["soe.county.lossShare"],
            values: { lossPercent: formatPercent(lossPercent) },
          })}
        </text>
      )}
    </g>
  );
}

function CountyTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: TreemapDatum }>;
}) {
  if (active !== true || payload === undefined || payload.length === 0) {
    return null;
  }

  const county = payload[0]?.payload;
  if (county === undefined) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2 text-xs shadow-md">
      <p className="font-semibold">{county.name}</p>
      <p className="tabular-nums text-slate-600">
        {i18n._({
          ...m["soe.county.summary"],
          values: {
            companies: county.companies,
            onLoss: county.onLoss,
            lossPercent: formatPercent(county.lossPercent),
          },
        })}
      </p>
      <p className="tabular-nums text-slate-600">
        {formatMilliardeLei(county.amount)}
      </p>
    </div>
  );
}

export function SoeCountyMap({ byCounty }: SoeCountyMapProps) {
  const { i18n } = useLingui();

  const data: TreemapDatum[] = useMemo(
    () =>
      byCounty.counties.map((county) => ({
        name: county.name,
        amount: Number(county.revenue),
        companies: county.companies,
        onLoss: county.onLoss,
        lossPercent: county.lossPercent,
      })),
    [byCounty]
  );

  const lossValues = data.map((county) => county.lossPercent);
  const minLoss = Math.min(...lossValues);
  const maxLoss = Math.max(...lossValues);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={data}
          dataKey="amount"
          aspectRatio={4 / 3}
          stroke="#fff"
          isAnimationActive={false}
          content={(props) => (
            <CountyCell
              {...(props as unknown as CellProps)}
              minLoss={minLoss}
              maxLoss={maxLoss}
            />
          )}
        >
          <Tooltip content={(props) => <CountyTooltip {...props} />} />
        </Treemap>
      </ResponsiveContainer>
      <div className="mt-2 flex items-center justify-end gap-2 text-xs text-slate-500">
        <span aria-hidden="true">
          {i18n._(m["soe.counties.lossPct"])}: {formatPercent(minLoss)}
        </span>
        <span
          aria-hidden="true"
          className="inline-block h-3 w-24 rounded-full"
          style={{
            background:
              "linear-gradient(to right, #dbeafe, #bfdbfe, #93c5fd, #60a5fa, #2563eb)",
          }}
        />
        <span aria-hidden="true">{formatPercent(maxLoss)}</span>
      </div>
    </div>
  );
}

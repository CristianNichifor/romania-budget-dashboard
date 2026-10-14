import { useLingui } from "@lingui/react";
import { Decimal } from "decimal.js";
import { useMemo } from "react";
import { Tooltip, Treemap, ResponsiveContainer } from "recharts";
import type { CountyInvestment } from "../../api/client";
import { formatMilliardeLei, formatPercent } from "../../lib/format";
import { pickIntensityColor } from "../../lib/investmentColor";
import { fitLabel, tileTextColors } from "../../lib/tileLabel";
import { m } from "../../messages";

interface InvestmentCartogramProps {
  counties: CountyInvestment[];
  total: string;
}

/**
 * Recharts 3 requires numeric node values (string amounts are treated as 0),
 * so amounts become JS numbers at the chart boundary only.
 */
type TreemapDatum = Omit<CountyInvestment, "amount"> & { amount: number };

interface CartogramCellProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  county?: string;
  amount?: number;
  min: string;
  max: string;
}

function CartogramCell(props: CartogramCellProps) {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    county,
    amount,
    min,
    max,
  } = props;
  const fill =
    amount !== undefined ? pickIntensityColor(amount, min, max) : "#dbeafe";

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} rx={4}>
        <title>{`${county ?? ""} — ${amount !== undefined ? formatMilliardeLei(amount) : ""}`}</title>
      </rect>
      {width > 58 && height > 32 && (
        <text
          stroke="none"
          x={x + 6}
          y={y + 16}
          fontSize={11}
          fill={tileTextColors(fill).label}
          fontWeight={600}
        >
          {fitLabel(county ?? "", width, 11)}
        </text>
      )}
    </g>
  );
}

interface CartogramTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: TreemapDatum }>;
  total: string;
}

function CartogramTooltip({ active, payload, total }: CartogramTooltipProps) {
  const { i18n } = useLingui();

  if (active !== true || payload === undefined || payload.length === 0) {
    return null;
  }

  const county = payload[0]?.payload;
  if (county === undefined) {
    return null;
  }

  const share = new Decimal(county.amount).div(total).times(100);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2 text-xs shadow-md">
      <p className="font-semibold">{county.county}</p>
      <p className="text-slate-500">{county.region}</p>
      <p className="tabular-nums text-slate-600">
        {formatMilliardeLei(county.amount)}
      </p>
      <p className="tabular-nums text-slate-500">
        {i18n._({
          ...m["investments.shareOfTotal"],
          values: { sharePercent: formatPercent(share.toDecimalPlaces(1)) },
        })}
      </p>
    </div>
  );
}

export function InvestmentCartogram({
  counties,
  total,
}: InvestmentCartogramProps) {
  const { min, max } = useMemo(() => {
    if (counties.length === 0) {
      return { min: "0", max: "0" };
    }
    const amounts = counties.map((county) => new Decimal(county.amount));
    return {
      min: Decimal.min(...amounts).toString(),
      max: Decimal.max(...amounts).toString(),
    };
  }, [counties]);

  const data: TreemapDatum[] = counties.map((county) => ({
    ...county,
    amount: Number(county.amount),
  }));

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={data}
          dataKey="amount"
          nameKey="county"
          aspectRatio={1}
          stroke="#fff"
          isAnimationActive={false}
          content={(props) => (
            <CartogramCell
              {...(props as unknown as CartogramCellProps)}
              min={min}
              max={max}
            />
          )}
        >
          <Tooltip
            content={(props) => <CartogramTooltip {...props} total={total} />}
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
}

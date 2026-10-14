import { useLingui } from "@lingui/react";
import { Decimal } from "decimal.js";
import { useMemo } from "react";
import { Tooltip, Treemap, ResponsiveContainer } from "recharts";
import type { CountyInvestment } from "../../api/client";
import { formatMilliardeLei, formatPercent } from "../../lib/format";
import { pickIntensityColor } from "../../lib/investmentColor";
import { tileLayout, tileTextColors, wrapLabel } from "../../lib/tileLabel";
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

const LABEL_SIZE = 11;

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
  const colors = tileTextColors(fill);
  const layout = tileLayout(width, height, LABEL_SIZE);
  const lines = wrapLabel(county ?? "", width, LABEL_SIZE, layout.lines);
  const lineHeight = LABEL_SIZE * 1.3;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} rx={4}>
        <title>{`${county ?? ""} — ${amount !== undefined ? formatMilliardeLei(amount) : ""}`}</title>
      </rect>
      {lines.length > 0 && (
        <text
          stroke="none"
          x={x + 8}
          y={y + 8 + LABEL_SIZE}
          fontSize={LABEL_SIZE}
          fill={colors.label}
          fontWeight={600}
        >
          {lines.map((line, index) => (
            <tspan key={index} x={x + 8} dy={index === 0 ? 0 : lineHeight}>
              {line}
            </tspan>
          ))}
        </text>
      )}
      {lines.length > 0 && layout.showAmount && amount !== undefined && (
        <text
          stroke="none"
          x={x + 8}
          y={y + 8 + LABEL_SIZE + lines.length * lineHeight}
          fontSize={LABEL_SIZE - 2}
          fill={colors.amount}
        >
          {formatMilliardeLei(amount)}
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

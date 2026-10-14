import { Tooltip, Treemap, ResponsiveContainer } from "recharts";
import type { BudgetDestination } from "../../data/budget2026";
import { formatMilliardeLei } from "../../lib/format";
import {
  INTENSITY_COLORS,
  pickIntensityIndex,
} from "../../lib/investmentColor";
import { fitLabel, tileTextColors } from "../../lib/tileLabel";

interface DestinationTreemapProps {
  destinations: BudgetDestination[];
  onSelect?: (destinationId: string) => void;
}

/**
 * Recharts 3 requires numeric node values (string amounts are treated as 0),
 * so amounts become JS numbers at the chart boundary only — the no-floats
 * rule applies to calculations, display values stay strings everywhere else.
 */
type TreemapDatum = Omit<BudgetDestination, "amount"> & { amount: number };

interface TreemapCellProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  id?: string;
  name?: string;
  amount?: number;
  minAmount: number;
  maxAmount: number;
  onSelect?: (destinationId: string) => void;
}

function TreemapCell(props: TreemapCellProps) {
  const {
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    id,
    name,
    amount = 0,
    minAmount,
    maxAmount,
    onSelect,
  } = props;

  const index = pickIntensityIndex(amount, minAmount, maxAmount);
  const fill = INTENSITY_COLORS[index] ?? INTENSITY_COLORS[0];
  const { label: labelFill, amount: amountFill } = tileTextColors(fill);

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        rx={4}
        className={
          onSelect !== undefined
            ? "cursor-pointer transition-opacity hover:opacity-85"
            : undefined
        }
        onClick={() => {
          if (onSelect !== undefined && id !== undefined) {
            onSelect(id);
          }
        }}
      >
        <title>{`${name ?? ""} — ${amount !== undefined ? formatMilliardeLei(amount) : ""}`}</title>
      </rect>
      {width > 70 && height > 40 && (
        <>
          <text
            x={x + 8}
            y={y + 18}
            fontSize={12}
            fill={labelFill}
            fontWeight={600}
          >
            {fitLabel(name ?? "", width, 12)}
          </text>
          <text x={x + 8} y={y + 34} fontSize={10} fill={amountFill}>
            {amount !== undefined ? formatMilliardeLei(amount) : ""}
          </text>
        </>
      )}
    </g>
  );
}

function TreemapTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: TreemapDatum }>;
}) {
  if (active !== true || payload === undefined || payload.length === 0) {
    return null;
  }

  const destination = payload[0]?.payload;
  if (destination === undefined) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2 text-xs shadow-md">
      <p className="font-semibold">{destination.name}</p>
      <p className="tabular-nums text-slate-600">
        {formatMilliardeLei(destination.amount)}
      </p>
    </div>
  );
}

export function DestinationTreemap({
  destinations,
  onSelect,
}: DestinationTreemapProps) {
  const data: TreemapDatum[] = destinations.map((destination) => ({
    ...destination,
    amount: Number(destination.amount),
  }));

  const amounts = data.map((destination) => destination.amount);
  const minAmount = Math.min(...amounts);
  const maxAmount = Math.max(...amounts);

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
            <TreemapCell
              {...(props as unknown as TreemapCellProps)}
              minAmount={minAmount}
              maxAmount={maxAmount}
              onSelect={onSelect}
            />
          )}
        >
          <Tooltip content={(props) => <TreemapTooltip {...props} />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
}

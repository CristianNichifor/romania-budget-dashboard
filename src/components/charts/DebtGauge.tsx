import { useLingui } from "@lingui/react";
import { m } from "../../messages";
import { formatPercent } from "../../lib/format";

interface DebtGaugeProps {
  /** Deficit as % of GDP. */
  valuePercent: number;
  /** Reference threshold (Maastricht). */
  referencePercent?: number;
  /** Upper bound of the scale. */
  maxPercent?: number;
}

function polar(
  centerX: number,
  centerY: number,
  radius: number,
  angleDegrees: number
): { x: number; y: number } {
  const angleRadians = ((angleDegrees - 180) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleRadians),
    y: centerY + radius * Math.sin(angleRadians),
  };
}

function describeArc(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polar(centerX, centerY, radius, endAngle);
  const end = polar(centerX, centerY, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
}

/**
 * Semicircular gauge (180° → 0°). The arc fills proportionally to the
 * value, with a tick marking the reference threshold.
 */
export function DebtGauge({
  valuePercent,
  referencePercent = 3,
  maxPercent = 10,
}: DebtGaugeProps) {
  const width = 220;
  // Room under the dial for the value, clear of the needle hub.
  const height = 156;
  const radius = 90;
  const centerX = width / 2;
  const centerY = 118;

  const valueAngle = 180 * Math.min(valuePercent / maxPercent, 1);
  const referenceAngle = 180 * (referencePercent / maxPercent);
  const overReference = valuePercent > referencePercent;

  const start = polar(centerX, centerY, radius, 0);
  const needleEnd = polar(centerX, centerY, radius - 6, valueAngle);
  const { i18n } = useLingui();

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      role="img"
      aria-label={i18n._({
        ...m["gauge.ariaLabel"],
        values: { valuePercent: formatPercent(valuePercent) },
      })}
    >
      <path
        d={describeArc(centerX, centerY, radius, 0, 180)}
        fill="none"
        stroke="var(--chart-grid)"
        strokeWidth={14}
        strokeLinecap="round"
      />
      <path
        d={describeArc(centerX, centerY, radius, 0, valueAngle)}
        fill="none"
        stroke={overReference ? "#dc2626" : "#2563eb"}
        strokeWidth={14}
        strokeLinecap="round"
      />
      <line
        x1={centerX}
        y1={centerY}
        x2={start.x}
        y2={start.y}
        stroke="var(--chart-axis)"
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <line
        x1={centerX}
        y1={centerY}
        x2={needleEnd.x}
        y2={needleEnd.y}
        stroke="var(--chart-strong)"
        strokeWidth={2}
      />
      <circle cx={centerX} cy={centerY} r={4} fill="var(--chart-strong)" />
      <text
        x={centerX}
        y={height - 8}
        textAnchor="middle"
        fontSize={22}
        fontWeight={700}
        fill={overReference ? "#dc2626" : "#2563eb"}
      >
        {formatPercent(valuePercent)}
      </text>
      <text
        x={polar(centerX, centerY, radius - 12, referenceAngle).x}
        y={polar(centerX, centerY, radius - 12, referenceAngle).y - 6}
        textAnchor="middle"
        fontSize={10}
        fill="var(--chart-text)"
      >
        {formatPercent(referencePercent)}
      </text>
    </svg>
  );
}

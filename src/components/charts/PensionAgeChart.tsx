import { formatMilliarde, formatNumber } from "../../lib/format";
import type { PensionAgePoint } from "../../lib/macro";
import { SmallMultiples } from "./SmallMultiples";

interface PensionAgeChartProps {
  data: PensionAgePoint[];
  pensionsLabel: string;
  dependencyLabel: string;
  ariaLabel: string;
}

/**
 * Pensions spending (milliarde lei) and the old-age dependency ratio (65+ per
 * 100 aged 15–64) as two small multiples, one axis each.
 */
export function PensionAgeChart({
  data,
  pensionsLabel,
  dependencyLabel,
  ariaLabel,
}: PensionAgeChartProps) {
  return (
    <SmallMultiples
      data={data}
      xKey="year"
      ariaLabel={ariaLabel}
      panels={[
        {
          title: pensionsLabel,
          dataKey: "pensiiMilliarde",
          kind: "bar",
          color: "#2563eb",
          format: (value) => formatMilliarde(value),
        },
        {
          title: dependencyLabel,
          dataKey: "oldAgeDependency",
          kind: "line",
          color: "#dc2626",
          format: (value) => formatNumber(value, { maximumFractionDigits: 1 }),
        },
      ]}
    />
  );
}

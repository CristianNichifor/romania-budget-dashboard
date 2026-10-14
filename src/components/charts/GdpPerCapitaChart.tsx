import { formatNumber } from "../../lib/format";
import { SmallMultiples } from "./SmallMultiples";

interface GdpPerCapitaChartProps {
  data: { year: string; pps: number; eu27Index: number }[];
  ppsLabel: string;
  indexLabel: string;
  ariaLabel: string;
}

/**
 * GDP per capita in PPS and the EU27 = 100 volume index (reference line at
 * 100) as two small multiples, one axis each.
 */
export function GdpPerCapitaChart({
  data,
  ppsLabel,
  indexLabel,
  ariaLabel,
}: GdpPerCapitaChartProps) {
  return (
    <SmallMultiples
      data={data}
      xKey="year"
      ariaLabel={ariaLabel}
      panels={[
        {
          title: ppsLabel,
          dataKey: "pps",
          kind: "line",
          color: "#2563eb",
          format: (value) => formatNumber(value),
        },
        {
          title: indexLabel,
          dataKey: "eu27Index",
          kind: "line",
          color: "#059669",
          format: (value) => formatNumber(value),
          reference: { y: 100, label: "UE 100" },
        },
      ]}
    />
  );
}

/** The scatter's x-axis spans ±100% margin; a handful of outliers go far beyond. */
export const MARGIN_LIMIT = 100;

/**
 * Where to plot a margin on the clipped axis. Outliers sit on the edge and
 * are flagged so the chart can mark them; the tooltip keeps the real value.
 */
export function clampMargin(marginPercent: number): {
  plotted: number;
  offScale: boolean;
} {
  const plotted = Math.max(
    -MARGIN_LIMIT,
    Math.min(MARGIN_LIMIT, marginPercent)
  );
  return { plotted, offScale: plotted !== marginPercent };
}

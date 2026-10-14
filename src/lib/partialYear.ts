/**
 * A budget year is partial while execution is still being reported. The BFF
 * says so with an additive `partial` flag; older responses without it fall
 * back to "the current calendar year is partial".
 */
export function isPartialYear(
  summary: { year: number; partial?: boolean },
  currentYear: number
): boolean {
  return summary.partial ?? summary.year === currentYear;
}

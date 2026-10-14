/**
 * Label colours and fitting for treemap / cartogram tiles. Pure helpers:
 * WCAG relative luminance picks dark or light text per fill, and labels are
 * cut to the tile width so they never spill over neighbouring tiles.
 */

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const n = Number.parseInt(hex.replace("#", ""), 16);
  return (
    0.2126 * channel((n >> 16) & 255) +
    0.7152 * channel((n >> 8) & 255) +
    0.0722 * channel(n & 255)
  );
}

export function contrastRatio(foreground: string, background: string): number {
  const [a, b] = [luminance(foreground), luminance(background)];
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const DARK = { label: "#0f172a", amount: "#1e3a8a" };
const LIGHT = { label: "#ffffff", amount: "#eff6ff" };

export function tileTextColors(fill: string): {
  label: string;
  amount: string;
} {
  return contrastRatio(DARK.label, fill) >= contrastRatio(LIGHT.label, fill)
    ? DARK
    : LIGHT;
}

/** Cuts `text` to roughly fit `width` px at `fontSize` (average glyph ≈ 0.55em). */
export function fitLabel(
  text: string,
  width: number,
  fontSize: number
): string {
  const max = Math.floor((width - 16) / (fontSize * 0.55));
  if (text.length <= max) {
    return text;
  }
  return max <= 1 ? "" : `${text.slice(0, max - 1).trimEnd()}…`;
}

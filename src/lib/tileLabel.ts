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

const TILE_PADDING = 8;
const LINE_HEIGHT = 1.3;
/** Fewer characters than this read as noise ("Pe…"); the tooltip has the name. */
const MIN_LABEL_CHARS = 4;

export interface TileLayout {
  /** How many label lines fit: 0 (no label), 1 or 2. */
  lines: 0 | 1 | 2;
  /** Whether an amount line fits under the label. */
  showAmount: boolean;
}

/**
 * Decides how much text a tile can hold: up to two label lines at `fontSize`
 * plus a smaller amount line, within the tile height minus padding.
 */
export function tileLayout(
  width: number,
  height: number,
  fontSize: number
): TileLayout {
  const maxChars = Math.floor((width - 2 * TILE_PADDING) / (fontSize * 0.55));
  const available = height - 2 * TILE_PADDING;
  const lineHeight = fontSize * LINE_HEIGHT;
  const amountHeight = (fontSize - 2) * LINE_HEIGHT;

  if (maxChars < MIN_LABEL_CHARS || available < lineHeight) {
    return { lines: 0, showAmount: false };
  }
  const lines: 1 | 2 = available >= 2 * lineHeight ? 2 : 1;
  return {
    lines,
    showAmount: available >= lines * lineHeight + amountHeight,
  };
}

/**
 * Wraps `text` on spaces into at most `maxLines` lines that fit `width` px at
 * `fontSize`; the last line is cut with an ellipsis when words remain. Returns
 * no lines when fewer than four characters would fit.
 */
export function wrapLabel(
  text: string,
  width: number,
  fontSize: number,
  maxLines: number
): string[] {
  const maxChars = Math.floor((width - 2 * TILE_PADDING) / (fontSize * 0.55));
  if (maxLines <= 0 || maxChars < MIN_LABEL_CHARS || text.length === 0) {
    return [];
  }
  if (text.length <= maxChars) {
    return [text];
  }

  const words = text.split(/\s+/).filter((word) => word.length > 0);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current.length === 0 ? word : `${current} ${word}`;
    if (candidate.length <= maxChars) {
      current = candidate;
      continue;
    }
    if (current.length > 0) {
      lines.push(current);
      current = word;
    } else {
      current = word;
    }
    if (lines.length === maxLines) {
      break;
    }
  }
  if (lines.length < maxLines && current.length > 0) {
    lines.push(current);
  }

  const used = lines.join(" ").split(/\s+/).length;
  const complete =
    used === words.length && lines.every((l) => l.length <= maxChars);
  if (complete) {
    return lines;
  }

  const last = lines.length - 1;
  const tail = lines[last] ?? "";
  lines[last] =
    tail.length >= maxChars
      ? `${tail.slice(0, maxChars - 1).trimEnd()}…`
      : `${tail}…`;
  return lines.slice(0, maxLines);
}

import { describe, expect, it } from "vitest";
import { INTENSITY_COLORS } from "../src/lib/investmentColor";
import {
  contrastRatio,
  fitLabel,
  tileLayout,
  tileTextColors,
  wrapLabel,
} from "../src/lib/tileLabel";

describe("tileTextColors", () => {
  it.each(INTENSITY_COLORS)(
    "keeps the label at 4.5:1 contrast or better on %s",
    (fill) => {
      const { label } = tileTextColors(fill);
      expect(contrastRatio(label, fill)).toBeGreaterThanOrEqual(4.5);
    }
  );

  it.each(INTENSITY_COLORS)(
    "keeps the amount at 3:1 contrast or better on %s",
    (fill) => {
      const { amount } = tileTextColors(fill);
      expect(contrastRatio(amount, fill)).toBeGreaterThanOrEqual(3);
    }
  );
});

describe("fitLabel", () => {
  it("leaves short labels alone", () => {
    expect(fitLabel("Pensii", 200, 12)).toBe("Pensii");
  });

  it("truncates labels wider than the tile with an ellipsis", () => {
    const label = fitLabel(
      "Transferuri din bugetul de stat catre bugetul asigurarilor sociale",
      120,
      12
    );
    expect(label.endsWith("…")).toBe(true);
    expect(label.length).toBeLessThanOrEqual(16);
  });
});

describe("wrapLabel", () => {
  it("keeps a short label on one line", () => {
    expect(wrapLabel("Pensii", 120, 12, 2)).toEqual(["Pensii"]);
  });

  it("wraps on spaces into two lines when the tile is wide enough", () => {
    // 120 px → 15 chars per line at 12 px
    expect(wrapLabel("Asistență socială", 120, 12, 2)).toEqual([
      "Asistență",
      "socială",
    ]);
  });

  it("cuts the last line with an ellipsis when words remain", () => {
    // 15 chars fit: "Fonduri externe" fills the line, so the cut eats a glyph.
    expect(wrapLabel("Fonduri externe nerambursabile", 120, 12, 1)).toEqual([
      "Fonduri extern…",
    ]);
    expect(wrapLabel("Fonduri externe nerambursabile", 100, 12, 2)).toEqual([
      "Fonduri",
      "externe…",
    ]);
  });

  it("cuts a single word that is too long", () => {
    expect(wrapLabel("Nerambursabile", 60, 12, 2)).toEqual(["Neram…"]);
  });

  it("drops the label when fewer than four characters fit", () => {
    expect(wrapLabel("Pensii", 30, 12, 2)).toEqual([]);
  });
});

describe("tileLayout", () => {
  it("fits two label lines and an amount in a tall tile", () => {
    expect(tileLayout(120, 80, 12)).toEqual({ lines: 2, showAmount: true });
  });

  it("falls back to one line plus the amount in a shorter tile", () => {
    expect(tileLayout(120, 46, 12)).toEqual({ lines: 1, showAmount: true });
  });

  it("drops the amount before the label", () => {
    expect(tileLayout(120, 34, 12)).toEqual({ lines: 1, showAmount: false });
  });

  it("shows nothing in a tile too narrow or too low for a word", () => {
    expect(tileLayout(30, 80, 12)).toEqual({ lines: 0, showAmount: false });
    expect(tileLayout(120, 20, 12)).toEqual({ lines: 0, showAmount: false });
  });
});

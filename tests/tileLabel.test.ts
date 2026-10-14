import { describe, expect, it } from "vitest";
import { INTENSITY_COLORS } from "../src/lib/investmentColor";
import { contrastRatio, fitLabel, tileTextColors } from "../src/lib/tileLabel";

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

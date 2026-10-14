import { describe, expect, it } from "vitest";
import { MARGIN_LIMIT, clampMargin } from "../src/lib/soeScatter";

describe("clampMargin", () => {
  it("keeps margins inside ±100% as they are", () => {
    expect(clampMargin(-42.5)).toEqual({ plotted: -42.5, offScale: false });
    expect(clampMargin(100)).toEqual({ plotted: 100, offScale: false });
  });

  it("pins outliers to the edge and flags them", () => {
    expect(clampMargin(-2400)).toEqual({
      plotted: -MARGIN_LIMIT,
      offScale: true,
    });
    expect(clampMargin(350)).toEqual({ plotted: MARGIN_LIMIT, offScale: true });
  });
});

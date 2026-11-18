import { describe, expect, it } from "vitest";
import { otherTheme, parseTheme, resolveTheme } from "../src/lib/theme";

describe("theme", () => {
  it("accepts only the two themes", () => {
    expect(parseTheme("dark")).toBe("dark");
    expect(parseTheme("light")).toBe("light");
    expect(parseTheme("sepia")).toBeNull();
    expect(parseTheme(null)).toBeNull();
  });

  it("lets a stored choice win over the system preference", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("follows the system preference without a stored choice", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme("sepia", false)).toBe("light");
  });

  it("switches to the other theme", () => {
    expect(otherTheme("dark")).toBe("light");
    expect(otherTheme("light")).toBe("dark");
  });
});

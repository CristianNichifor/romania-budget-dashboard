import { describe, expect, it } from "vitest";
import {
  absoluteUrl,
  counterpartPath,
  localeFromPath,
  PAGES,
  TAB_PAGES,
} from "../src/lib/routeTable";

describe("routeTable", () => {
  it("reads the locale from the path", () => {
    expect(localeFromPath("/")).toBe("en");
    expect(localeFromPath("/your-share/")).toBe("en");
    expect(localeFromPath("/ro/")).toBe("ro");
    expect(localeFromPath("/ro")).toBe("ro");
    expect(localeFromPath("/ro/felia-ta/")).toBe("ro");
    expect(localeFromPath("/robots/")).toBe("en");
  });

  it("maps every page to its counterpart in the other language", () => {
    for (const page of TAB_PAGES) {
      expect(counterpartPath(page.en, "ro")).toBe(page.ro);
      expect(counterpartPath(page.ro, "en")).toBe(page.en);
    }
    expect(counterpartPath("/labor-market", "ro")).toBe("/ro/piata-muncii/");
  });

  it("falls back to the first tab for home and unknown paths", () => {
    expect(counterpartPath("/", "ro")).toBe("/ro/felia-ta/");
    expect(counterpartPath("/nowhere/", "ro")).toBe("/ro/felia-ta/");
    expect(counterpartPath("/ro/nicaieri/", "en")).toBe("/your-share/");
  });

  it("keeps Romanian under /ro/ and English at the root", () => {
    for (const page of PAGES) {
      expect(page.ro.startsWith("/ro/")).toBe(true);
      expect(page.en.endsWith("/")).toBe(true);
      expect(page.en.startsWith("/ro")).toBe(false);
    }
  });

  it("builds absolute URLs with the trailing slash", () => {
    expect(absoluteUrl("/")).toBe("https://budget.cristian-nichifor.com/");
    expect(absoluteUrl("/ro/felia-ta/")).toBe(
      "https://budget.cristian-nichifor.com/ro/felia-ta/"
    );
  });
});

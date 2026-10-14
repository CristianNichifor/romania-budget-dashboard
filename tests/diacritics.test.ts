import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// UXG-B5 (partial): Romanian is written with comma-below ș/ț. The cedilla forms
// ş/ţ come from legacy encodings and render as the wrong letter in many fonts.
// This guards every string the app ships itself; labels from the BFF still
// need the same fix at the source.
const CEDILLA = /[şţŞŢ]/u;

const root = join(__dirname, "..");
const files = [
  ...readdirSync(join(root, "src/data")).map((name) => join("src/data", name)),
  "src/messages.ts",
  "src/locales/ro/messages.po",
  "src/locales/en/messages.po",
];

describe("Romanian diacritics", () => {
  it.each(files)("%s uses comma-below ș/ț, never cedilla ş/ţ", (file) => {
    const offending = readFileSync(join(root, file), "utf8")
      .split("\n")
      .map((line, index) => ({ line, number: index + 1 }))
      .filter(({ line }) => CEDILLA.test(line))
      .map(({ line, number }) => `${number}: ${line.trim()}`);
    expect(offending).toEqual([]);
  });

  it("the check itself catches a cedilla", () => {
    expect(CEDILLA.test("Sănătate şi învăţământ")).toBe(true);
    expect(CEDILLA.test("Sănătate și învățământ")).toBe(false);
  });
});

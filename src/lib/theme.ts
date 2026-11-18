/**
 * Colour theme: the reader's explicit choice, or the system preference when
 * there is none. The choice is the `data-theme` attribute on <html>, which
 * `src/styles.css` reads; `index.html` applies the stored value before first
 * paint with the same key.
 */

export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_STORAGE_KEY = "theme";

export function parseTheme(value: unknown): Theme | null {
  return value === "light" || value === "dark" ? value : null;
}

/** The theme on screen: the stored choice wins over the system preference. */
export function resolveTheme(
  stored: unknown,
  systemPrefersDark: boolean
): Theme {
  return parseTheme(stored) ?? (systemPrefersDark ? "dark" : "light");
}

export function otherTheme(theme: Theme): Theme {
  return theme === "dark" ? "light" : "dark";
}

import { useLingui } from "@lingui/react";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import {
  otherTheme,
  resolveTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from "../../lib/theme";
import { m } from "../../messages";

function readStored(): string | null {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

function currentTheme(): Theme {
  const systemPrefersDark =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return resolveTheme(
    document.documentElement.dataset.theme ?? readStored(),
    systemPrefersDark
  );
}

/** The dark theme needs light-dark(); without it the switch would do nothing. */
function supportsThemes(): boolean {
  return (
    typeof CSS !== "undefined" &&
    typeof CSS.supports === "function" &&
    CSS.supports("color", "light-dark(#000, #fff)")
  );
}

/** Dark/light switch; the choice is kept in this browser only. */
export function ThemeToggle() {
  const { i18n } = useLingui();
  const [theme, setTheme] = useState<Theme>(currentTheme);
  const [supported] = useState(supportsThemes);

  if (!supported) {
    return null;
  }

  const toggle = () => {
    const next = otherTheme(theme);
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode: the choice lasts for this page view.
    }
    setTheme(next);
  };

  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      aria-pressed={theme === "dark"}
      aria-label={i18n._(m["theme.dark"])}
      title={i18n._(m["theme.dark"])}
      onClick={toggle}
      className="inline-flex size-11 items-center justify-center rounded-md border border-slate-200 bg-surface text-slate-600 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-budget-blue"
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  );
}

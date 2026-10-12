import { i18n } from "@lingui/core";
import { messages as enMessages } from "./locales/en/messages.po";
import { messages as roMessages } from "./locales/ro/messages.po";
import { localeFromPath, type Locale } from "./lib/routeTable";

export { DEFAULT_LOCALE, LOCALES, type Locale } from "./lib/routeTable";

i18n.load({ ro: roMessages, en: enMessages });

/** The locale comes from the path (`/ro/…` is Romanian), never from storage. */
export function activateLocale(locale: Locale): void {
  if (i18n.locale !== locale) {
    i18n.activate(locale);
  }
  if (typeof document !== "undefined") {
    document.documentElement.lang = locale;
  }
}

activateLocale(
  localeFromPath(typeof window === "undefined" ? "/" : window.location.pathname)
);

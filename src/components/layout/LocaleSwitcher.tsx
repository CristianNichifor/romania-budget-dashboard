import { useLingui } from "@lingui/react";
import { Link, useRouterState } from "@tanstack/react-router";
import { LOCALES, type Locale } from "../../i18n-core";
import { cn } from "../../lib/cn";
import { counterpartPath } from "../../lib/routeTable";
import { m } from "../../messages";

const LABELS: Record<Locale, string> = {
  ro: "RO",
  en: "EN",
};

/** Links to the same page in the other language; the path sets the locale. */
export function LocaleSwitcher() {
  const { i18n } = useLingui();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div
      role="group"
      aria-label={i18n._(m["lang.label"])}
      className="flex overflow-hidden rounded-md border border-slate-200"
    >
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          to={counterpartPath(pathname, locale)}
          hrefLang={locale}
          lang={locale}
          aria-current={i18n.locale === locale ? "true" : undefined}
          className={cn(
            "px-2 py-1 text-xs font-medium",
            i18n.locale === locale
              ? "bg-budget-blue text-white"
              : "bg-white text-slate-600 hover:bg-slate-50"
          )}
        >
          {LABELS[locale]}
        </Link>
      ))}
    </div>
  );
}

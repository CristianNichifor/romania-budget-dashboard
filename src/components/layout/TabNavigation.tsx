import { useLingui } from "@lingui/react";
import { Link } from "@tanstack/react-router";
import { cn } from "../../lib/cn";
import { TAB_PAGES, type Locale } from "../../lib/routeTable";
import { lookupMessage } from "../../messages";

export function TabNavigation() {
  const { i18n } = useLingui();
  const locale = i18n.locale as Locale;

  return (
    <nav
      aria-label={i18n._(lookupMessage("nav.label"))}
      className="mx-auto flex max-w-6xl gap-1 px-4"
    >
      {TAB_PAGES.map((tab) => (
        <Link
          key={tab.key}
          to={tab[locale]}
          className="text-sm font-medium"
          activeProps={{
            className: "text-sm font-medium",
            "aria-current": "page",
          }}
          inactiveProps={{
            className: "text-sm font-medium text-slate-500",
          }}
        >
          {({ isActive }) => (
            <span
              className={cn(
                "inline-block border-b-2 px-3 py-3 transition-colors",
                isActive
                  ? "border-budget-blue text-budget-blue"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              )}
            >
              {i18n._(lookupMessage(`nav.${tab.key}`))}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}

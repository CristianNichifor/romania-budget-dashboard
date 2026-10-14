import { useLingui } from "@lingui/react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { cn } from "../../lib/cn";
import { TAB_PAGES, type Locale } from "../../lib/routeTable";
import { lookupMessage } from "../../messages";

export function TabNavigation() {
  const { i18n } = useLingui();
  const locale = i18n.locale as Locale;
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navRef = useRef<HTMLElement>(null);

  // On narrow screens the bar scrolls sideways; keep the active tab visible.
  useEffect(() => {
    navRef.current
      ?.querySelector('[aria-current="page"]')
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [pathname]);

  return (
    <nav
      ref={navRef}
      aria-label={i18n._(lookupMessage("nav.label"))}
      className="mx-auto flex max-w-6xl gap-1 overflow-x-auto overscroll-x-contain px-4 [scrollbar-width:thin]"
    >
      {TAB_PAGES.map((tab) => (
        <Link
          key={tab.key}
          to={tab[locale]}
          className="shrink-0 text-sm font-medium whitespace-nowrap"
          activeProps={{ "aria-current": "page" }}
          inactiveProps={{ className: "text-slate-500" }}
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

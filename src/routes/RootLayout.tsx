import { useLingui } from "@lingui/react";
import { Link, Outlet } from "@tanstack/react-router";
import { DocumentLinks } from "../components/layout/DocumentLinks";
import { Header } from "../components/layout/Header";
import { TabNavigation } from "../components/layout/TabNavigation";
import { CONTENT_PAGES, type Locale } from "../lib/routeTable";
import { m } from "../messages";

const ABOUT = CONTENT_PAGES.find((page) => page.key === "about");

export function RootLayout() {
  const { i18n } = useLingui();

  return (
    <div className="min-h-screen">
      <DocumentLinks />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-budget-blue focus:shadow"
      >
        {i18n._(m["a11y.skipToContent"])}
      </a>
      <Header />
      <div className="border-b border-slate-200 bg-white">
        <TabNavigation />
      </div>
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
      <footer className="mx-auto flex max-w-6xl flex-wrap gap-x-4 gap-y-1 px-4 pb-8 text-xs text-slate-500">
        <span>{i18n._(m["app.footer"])}</span>
        {ABOUT !== undefined && (
          <Link
            to={ABOUT[i18n.locale as Locale]}
            className="font-medium text-budget-blue underline underline-offset-2"
          >
            {i18n._(m["footer.about"])}
          </Link>
        )}
      </footer>
    </div>
  );
}

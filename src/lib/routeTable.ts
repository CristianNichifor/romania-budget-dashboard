/**
 * One route table for both languages: English at the root, Romanian under
 * `/ro/` with translated slugs. The router, the tab navigation, the language
 * switch and the canonical/hreflang links all read it. Paths keep the
 * trailing slash the router serves (`trailingSlash: "always"`).
 */

export const LOCALES = ["en", "ro"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const SITE_URL = "https://budget.cristian-nichifor.com";

export const PAGES = [
  { key: "home", en: "/", ro: "/ro/" },
  { key: "citizenSlice", en: "/your-share/", ro: "/ro/felia-ta/" },
  {
    key: "nationalBalance",
    en: "/national-balance/",
    ro: "/ro/bilantul-national/",
  },
  {
    key: "companies",
    en: "/state-owned-companies/",
    ro: "/ro/companii-de-stat/",
  },
  { key: "economy", en: "/economy/", ro: "/ro/economie/" },
  { key: "society", en: "/society/", ro: "/ro/societate/" },
  { key: "energy", en: "/energy/", ro: "/ro/energie/" },
  { key: "labour", en: "/labor-market/", ro: "/ro/piata-muncii/" },
  { key: "justice", en: "/justice/", ro: "/ro/justitie/" },
] as const;

export type Page = (typeof PAGES)[number];
export type PageKey = Page["key"];

function withTrailingSlash(pathname: string): string {
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function localeFromPath(pathname: string): Locale {
  return withTrailingSlash(pathname).startsWith("/ro/") ? "ro" : "en";
}

/** The pages behind the tabs; the home path redirects to the first one. */
export const TAB_PAGES = PAGES.filter(
  (page): page is Exclude<Page, { key: "home" }> => page.key !== "home"
);
export type TabPage = (typeof TAB_PAGES)[number];

export function homeTarget(locale: Locale): TabPage[Locale] {
  return PAGES[1][locale];
}

export function findPage(pathname: string): Page | undefined {
  const path = withTrailingSlash(pathname);
  return PAGES.find((page) => page.en === path || page.ro === path);
}

/** The same tab in the other language; the first tab when unknown. */
export function counterpartPath(
  pathname: string,
  locale: Locale
): TabPage[Locale] {
  const page = findPage(pathname);
  return page === undefined || page.key === "home"
    ? homeTarget(locale)
    : page[locale];
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

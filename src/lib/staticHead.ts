/**
 * Static document head per route, written at build time so crawlers and link
 * previews see the right language, canonical, title and description without
 * running JavaScript. Pure: the Vite plugin in `vite.config.ts` does the I/O,
 * and `DocumentLinks` reuses `headFor` to keep the head current after
 * client-side navigation.
 */
import {
  CONTENT_PAGES,
  PAGES,
  SITE_URL,
  absoluteUrl,
  counterpartPath,
  localeFromPath,
  type ContentPage,
  type Locale,
} from "./routeTable";

export const OG_IMAGE = {
  path: "/og-image.png",
  width: 1200,
  height: 630,
} as const;

const SITE_NAME: Record<Locale, string> = {
  en: "Romania's Budget",
  ro: "Bugetul României",
};

type PageKey = ContentPage["key"];

/** Page title and description per language. English copy: needs human review. */
const PAGE_META: Record<
  PageKey,
  Record<Locale, { title: string; description: string }>
> = {
  citizenSlice: {
    ro: {
      title: "Feliuța ta",
      description:
        "Cât din salariul tău ajunge la stat și unde merg banii: CAS, CASS, impozit pe venit și TVA estimată, calculate pentru salariul tău brut.",
    },
    en: {
      title: "Your share",
      description:
        "How much of your salary goes to the state and where it ends up: pension and health contributions, income tax and estimated VAT for your gross pay.",
    },
  },
  nationalBalance: {
    ro: {
      title: "Bilanțul național",
      description:
        "Veniturile, cheltuielile și deficitul bugetului consolidat al României, bugetul adoptat comparat cu execuția și destinațiile banilor publici.",
    },
    en: {
      title: "National balance",
      description:
        "Revenue, spending and deficit of Romania's consolidated budget, the adopted budget against execution, and where public money goes.",
    },
  },
  companies: {
    ro: {
      title: "Companii de stat",
      description:
        "Companiile deținute de stat: profit și pierderi, salarii de conducere, subvenții, distribuția pe județe și companiile listate la bursă.",
    },
    en: {
      title: "State-owned companies",
      description:
        "Companies owned by the Romanian state: profit and losses, executive pay, subsidies, spread by county and listed companies.",
    },
  },
  economy: {
    ro: {
      title: "Economie",
      description:
        "Inflație, șomaj, curs EUR/RON, creșterea PIB, datoria publică, comerțul exterior și dobânzi pentru România, din Eurostat, BCE și BNR.",
    },
    en: {
      title: "Economy",
      description:
        "Inflation, unemployment, the EUR/RON rate, GDP growth, public debt, trade and interest rates for Romania, from Eurostat, the ECB and the NBR.",
    },
  },
  society: {
    ro: {
      title: "Societate",
      description:
        "Populație, cheltuieli cu sănătatea și educația, abandon școlar, medici și migrație în România, din Eurostat și INS.",
    },
    en: {
      title: "Society",
      description:
        "Population, health and education spending, early school leaving, physicians and migration in Romania, from Eurostat and the national statistics institute.",
    },
  },
  energy: {
    ro: {
      title: "Energie",
      description:
        "Prețul energiei electrice pentru gospodării, ponderea surselor regenerabile și dependența de importuri a României, din Eurostat.",
    },
    en: {
      title: "Energy",
      description:
        "Household electricity prices, the share of renewables and Romania's energy import dependency, from Eurostat.",
    },
  },
  labour: {
    ro: {
      title: "Piața muncii",
      description:
        "Tineri care nu lucrează și nu învață, șomajul în rândul tinerilor și locurile de muncă vacante în România, din Eurostat.",
    },
    en: {
      title: "Labour market",
      description:
        "Young people not in employment, education or training, youth unemployment and job vacancies in Romania, from Eurostat.",
    },
  },
  justice: {
    ro: {
      title: "Justiția în cifre",
      description:
        "Omucideri, populația din penitenciare și numărul de polițiști din România, din Eurostat.",
    },
    en: {
      title: "Justice in numbers",
      description:
        "Homicides, prison population and police officers in Romania, from Eurostat.",
    },
  },
  about: {
    ro: {
      title: "Despre",
      description:
        "Cine face tabloul de bord, de unde provin datele, sub ce licențe și ce date personale nu colectăm: fără cookie-uri și fără analytics.",
    },
    en: {
      title: "About",
      description:
        "Who runs the dashboard, where the data comes from, under which licences, and what we do not collect: no cookies and no analytics.",
    },
  },
};

export interface PageHead {
  path: string;
  lang: Locale;
  title: string;
  description: string;
  canonical: string;
  alternates: { en: string; ro: string; xDefault: string };
}

/** The head for a path; home paths take their first tab's head. */
export function headFor(pathname: string): PageHead {
  const lang = localeFromPath(pathname);
  const en = counterpartPath(pathname, "en");
  const ro = counterpartPath(pathname, "ro");
  const own = lang === "ro" ? ro : en;
  const key = CONTENT_PAGES.find((entry) => entry[lang] === own)?.key;
  const meta = PAGE_META[key ?? "citizenSlice"][lang];
  return {
    path: pathname,
    lang,
    title: `${meta.title} — ${SITE_NAME[lang]}`,
    description: meta.description,
    canonical: absoluteUrl(own),
    alternates: {
      en: absoluteUrl(en),
      ro: absoluteUrl(ro),
      xDefault: absoluteUrl(en),
    },
  };
}

function escapeAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function renderHeadTags(head: PageHead): string {
  const e = escapeAttribute;
  const ogLocale = head.lang === "ro" ? "ro_RO" : "en_GB";
  return [
    `<title>${e(head.title)}</title>`,
    `<meta name="description" content="${e(head.description)}" />`,
    `<link rel="canonical" href="${head.canonical}" />`,
    `<link rel="alternate" hreflang="en" href="${head.alternates.en}" />`,
    `<link rel="alternate" hreflang="ro" href="${head.alternates.ro}" />`,
    `<link rel="alternate" hreflang="x-default" href="${head.alternates.xDefault}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${e(SITE_NAME[head.lang])}" />`,
    `<meta property="og:locale" content="${ogLocale}" />`,
    `<meta property="og:title" content="${e(head.title)}" />`,
    `<meta property="og:description" content="${e(head.description)}" />`,
    `<meta property="og:url" content="${head.canonical}" />`,
    `<meta property="og:image" content="${SITE_URL}${OG_IMAGE.path}" />`,
    `<meta property="og:image:width" content="${OG_IMAGE.width}" />`,
    `<meta property="og:image:height" content="${OG_IMAGE.height}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join("\n    ");
}

const HEAD_REGION = /<!-- route-head:start -->[\s\S]*<!-- route-head:end -->/;

/** `index.html` with the route's lang and head tags in its marked region. */
export function applyHead(indexHtml: string, head: PageHead): string {
  if (!HEAD_REGION.test(indexHtml)) {
    throw new Error("index.html has no <!-- route-head:start/end --> region");
  }
  return indexHtml
    .replace(/<html lang="[^"]*">/, `<html lang="${head.lang}">`)
    .replace(
      HEAD_REGION,
      `<!-- route-head:start -->\n    ${renderHeadTags(head)}\n    <!-- route-head:end -->`
    );
}

/** One HTML file per route and language, keyed by its path under `dist/`. */
export function staticPages(
  indexHtml: string
): { fileName: string; html: string }[] {
  return PAGES.flatMap((page) => [page.en, page.ro]).map((path) => ({
    fileName: `${path.slice(1)}index.html`,
    html: applyHead(indexHtml, headFor(path)),
  }));
}

export function robotsTxt(): string {
  return [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
  ].join("\n");
}

export function sitemapXml(): string {
  const urls = CONTENT_PAGES.flatMap((page) =>
    [page.en, page.ro].map((path) =>
      [
        "  <url>",
        `    <loc>${absoluteUrl(path)}</loc>`,
        `    <xhtml:link rel="alternate" hreflang="en" href="${absoluteUrl(page.en)}" />`,
        `    <xhtml:link rel="alternate" hreflang="ro" href="${absoluteUrl(page.ro)}" />`,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl(page.en)}" />`,
        "  </url>",
      ].join("\n")
    )
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}

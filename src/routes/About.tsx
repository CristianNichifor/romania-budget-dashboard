import { useLingui } from "@lingui/react";
import type { MessageDescriptor } from "@lingui/core";
import { m } from "../messages";

const ISSUES_URL =
  "https://github.com/CristianNichifor/romania-budget-dashboard/issues";

interface Source {
  name: string;
  url: string;
  use: MessageDescriptor;
  /** Licence label and terms page; `null` when the publisher states none. */
  licence: { label: string; url: string } | { label: null; url: string } | null;
}

/**
 * Licences as verified from each publisher's terms page (see the BFF README
 * attribution table). Unverified terms link to the source without a claim.
 */
const SOURCES: Source[] = [
  {
    name: "Eurostat",
    url: "https://ec.europa.eu/eurostat",
    use: m["about.source.eurostat"],
    licence: {
      label: "CC BY 4.0",
      url: "https://ec.europa.eu/eurostat/web/main/help/copyright-notice",
    },
  },
  {
    name: "BCE / ECB",
    url: "https://data.ecb.europa.eu",
    use: m["about.source.ecb"],
    licence: {
      label: "ECB statistics usage policy",
      url: "https://www.ecb.europa.eu/stats/ecb_statistics/governance_and_quality_framework/html/usage_policy.en.html",
    },
  },
  {
    name: "MFP / data.gov.ro",
    url: "https://data.gov.ro",
    use: m["about.source.mfp"],
    licence: {
      label: "OGL-ROU-1.0",
      url: "https://data.gov.ro/base/images/logoinst/OGL-ROU-1.0.pdf",
    },
  },
  {
    name: "companiidestat.ro",
    url: "https://companiidestat.ro",
    use: m["about.source.soe"],
    licence: { label: "CC BY 4.0", url: "https://companiidestat.ro/date/" },
  },
  {
    name: "BNR",
    url: "https://www.bnr.ro",
    use: m["about.source.bnr"],
    licence: {
      label: null,
      url: "https://www.bnr.ro/2281-termeni-si-conditii",
    },
  },
  {
    name: "transparenta.eu",
    url: "https://transparenta.eu",
    use: m["about.source.transparenta"],
    licence: null,
  },
  {
    name: "Open Budget",
    url: "https://openbudget.ro/buget/2026/",
    use: m["about.source.openBudget"],
    licence: null,
  },
];

const linkClass =
  "font-medium text-budget-blue underline underline-offset-2 hover:text-blue-800";

/** In-page contents (design 05): section ids and their heading messages. */
const CONTENTS = [
  { id: "metoda", title: m["about.method.title"] },
  { id: "surse", title: m["about.sources.title"] },
  { id: "confidentialitate", title: m["about.privacy.title"] },
  { id: "cod", title: m["about.code.title"] },
] as const;

export function About() {
  const { i18n } = useLingui();

  return (
    <article className="max-w-3xl space-y-8">
      <section className="space-y-3">
        <h2 className="text-xl font-bold">{i18n._(m["about.title"])}</h2>
        <p className="text-slate-700">{i18n._(m["about.intro"])}</p>
        <p className="text-slate-700">
          {i18n._(m["about.operator"])}{" "}
          <a href={ISSUES_URL} className={linkClass}>
            {i18n._(m["about.contactLink"])}
          </a>
        </p>
      </section>

      <nav aria-label={i18n._(m["about.contents"])} className="text-sm">
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {CONTENTS.map((entry) => (
            <li key={entry.id}>
              <a href={`#${entry.id}`} className={linkClass}>
                {i18n._(entry.title)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="metoda" className="space-y-3">
        <h3 className="text-lg font-semibold">
          {i18n._(m["about.method.title"])}
        </h3>
        <p className="text-slate-700">{i18n._(m["about.method.salary"])}</p>
        <p className="text-slate-700">{i18n._(m["about.method.estimate"])}</p>
        <p className="text-slate-700">{i18n._(m["about.method.money"])}</p>
      </section>

      <section id="surse" className="space-y-3">
        <h3 className="text-lg font-semibold">
          {i18n._(m["about.sources.title"])}
        </h3>
        <p className="text-sm text-slate-600">
          {i18n._(m["about.sources.description"])}
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              {i18n._(m["about.sources.title"])}
            </caption>
            <thead className="bg-slate-50 text-xs text-slate-600">
              <tr>
                <th scope="col" className="px-4 py-2 font-medium">
                  {i18n._(m["about.sources.col.source"])}
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  {i18n._(m["about.sources.col.use"])}
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  {i18n._(m["about.sources.col.licence"])}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {SOURCES.map((source) => (
                <tr key={source.name}>
                  <th scope="row" className="px-4 py-3 font-normal">
                    <a href={source.url} className={linkClass}>
                      {source.name}
                    </a>
                  </th>
                  <td className="px-4 py-3 text-slate-600">
                    {i18n._(source.use)}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {source.licence === null ? (
                      i18n._(m["about.licence.none"])
                    ) : (
                      <a href={source.licence.url} className={linkClass}>
                        {source.licence.label ??
                          i18n._(m["about.licence.terms"])}
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="confidentialitate" className="space-y-3">
        <h3 className="text-lg font-semibold">
          {i18n._(m["about.privacy.title"])}
        </h3>
        <p className="text-slate-700">{i18n._(m["about.privacy.tracking"])}</p>
        <p className="text-slate-700">{i18n._(m["about.privacy.hosting"])}</p>
      </section>

      <section id="cod" className="space-y-3">
        <h3 className="text-lg font-semibold">
          {i18n._(m["about.code.title"])}
        </h3>
        <p className="text-slate-700">
          {i18n._(m["about.code.description"])}{" "}
          <a
            href="https://github.com/CristianNichifor/romania-budget-dashboard"
            className={linkClass}
          >
            GitHub
          </a>
        </p>
      </section>
    </article>
  );
}

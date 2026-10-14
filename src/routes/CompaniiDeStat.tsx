import { useLingui } from "@lingui/react";
import { useQuery } from "@tanstack/react-query";
import { Decimal } from "decimal.js";
import { useState } from "react";
import {
  fetchSoeByCounty,
  fetchSoeListed,
  fetchSoeScatter,
  fetchSoeSectorTrend,
  fetchSoeSubsidies,
  fetchSoeSummary,
} from "../api/client";
import { SoeCountyMap } from "../components/charts/SoeCountyMap";
import { SoeListedCompanies } from "../components/charts/SoeListedCompanies";
import { SoeScatterChart } from "../components/charts/SoeScatterChart";
import { SoeSectorTrendChart } from "../components/charts/SoeSectorTrendChart";
import { SoeSubsidyBars } from "../components/charts/SoeSubsidyBars";
import { KpiCard } from "../components/shared/KpiCard";
import { SkeletonCard } from "../components/shared/SkeletonCard";
import { SoeCompanyModal } from "../components/shared/SoeCompanyModal";
import { SourceBadge } from "../components/shared/SourceBadge";
import { formatMilliardeLei } from "../lib/format";
import { QueryError } from "../components/shared/SectionError";
import { m } from "../messages";

function toLeiFromMld(mld: string): Decimal {
  return new Decimal(mld).times(1e9);
}

export function CompaniiDeStat() {
  const { i18n } = useLingui();
  const [selectedCui, setSelectedCui] = useState<string | null>(null);
  const [subsidyYear, setSubsidyYear] = useState("2024");

  const summaryQuery = useQuery({
    queryKey: ["soe-summary"],
    queryFn: fetchSoeSummary,
  });
  const { data: summary, isPending: summaryPending } = summaryQuery;

  const scatterQuery = useQuery({
    queryKey: ["soe-scatter"],
    queryFn: fetchSoeScatter,
  });
  const { data: scatter } = scatterQuery;

  const trendQuery = useQuery({
    queryKey: ["soe-sector-trend"],
    queryFn: fetchSoeSectorTrend,
  });
  const { data: trend } = trendQuery;

  const byCountyQuery = useQuery({
    queryKey: ["soe-by-county"],
    queryFn: fetchSoeByCounty,
  });
  const { data: byCounty } = byCountyQuery;

  const subsidiesQuery = useQuery({
    queryKey: ["soe-subsidies", subsidyYear],
    queryFn: () => fetchSoeSubsidies(subsidyYear),
  });
  const { data: subsidies } = subsidiesQuery;

  const listedQuery = useQuery({
    queryKey: ["soe-listed"],
    queryFn: fetchSoeListed,
  });
  const { data: listed } = listedQuery;

  const minWage =
    summary?.payScale.find((row) => row.kind === "ref")?.value ?? null;

  const unavailable = summary === null;

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{i18n._(m["soe.title"])}</h2>
            <p className="text-sm text-slate-500">
              {i18n._(m["soe.description"])}
            </p>
          </div>
          <SourceBadge source="soe.source" />
        </div>

        {summaryPending && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((index) => (
              <SkeletonCard key={index} className="h-28" />
            ))}
          </div>
        )}

        {summary !== null && summary !== undefined && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard
                accent="blue"
                label={i18n._(m["soe.kpi.companies"])}
                value={summary.stats.totalCompanies.toLocaleString("ro-RO")}
                sub={`${summary.stats.central} centrale · ${summary.stats.local} locale`}
              />
              <KpiCard
                accent="slate"
                label={i18n._(m["soe.kpi.revenue"])}
                value={formatMilliardeLei(toLeiFromMld(summary.stats.revenue))}
              />
              <KpiCard
                accent="blue"
                label={i18n._(m["soe.kpi.profit"])}
                value={formatMilliardeLei(toLeiFromMld(summary.stats.profit))}
              />
              <KpiCard
                accent="red"
                label={i18n._(m["soe.kpi.losses"])}
                value={formatMilliardeLei(toLeiFromMld(summary.stats.losses))}
              />
            </div>
            <p className="text-xs text-slate-500">
              {i18n._({
                ...m["soe.kpi.updated"],
                values: {
                  year: summary.stats.year,
                  date: summary.stats.updatedAt,
                  companies: summary.stats.companiesWithData,
                },
              })}
              {" · "}
              {summary.stats.companiesOnLoss} pe pierdere
            </p>
          </>
        )}
        <QueryError query={summaryQuery} />

        {unavailable && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {i18n._(m["soe.unavailable"])}
          </div>
        )}
      </section>

      {scatter !== null && scatter !== undefined && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">
              {i18n._(m["soe.scatter.title"])}
            </h2>
            <p className="text-sm text-slate-500">
              {i18n._(m["soe.scatter.description"])}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <SoeScatterChart
              scatter={scatter}
              minWage={minWage}
              onSelect={setSelectedCui}
            />
          </div>
        </section>
      )}
      <QueryError query={scatterQuery} title={i18n._(m["soe.scatter.title"])} />

      {trend !== null && trend !== undefined && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">
              {i18n._(m["soe.sectors.title"])}
            </h2>
            <p className="text-sm text-slate-500">
              {i18n._(m["soe.sectors.description"])}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <SoeSectorTrendChart trend={trend} />
          </div>
        </section>
      )}
      <QueryError query={trendQuery} title={i18n._(m["soe.sectors.title"])} />

      {byCounty !== null && byCounty !== undefined && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">
              {i18n._(m["soe.counties.title"])}
            </h2>
            <p className="text-sm text-slate-500">
              {i18n._(m["soe.counties.description"])}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <SoeCountyMap byCounty={byCounty} />
          </div>
        </section>
      )}
      <QueryError
        query={byCountyQuery}
        title={i18n._(m["soe.counties.title"])}
      />

      {subsidies !== null && subsidies !== undefined && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">
                {i18n._(m["soe.subsidies.title"])}
              </h2>
              <p className="text-sm text-slate-500">
                {i18n._(m["soe.subsidies.description"])}
              </p>
            </div>
            <div
              role="group"
              className="flex overflow-hidden rounded-md border border-slate-200"
            >
              {["2024", "2025"].map((year) => (
                <button
                  key={year}
                  type="button"
                  aria-pressed={subsidyYear === year}
                  className={
                    subsidyYear === year
                      ? "bg-budget-blue px-3 py-1 text-xs font-medium text-white"
                      : "bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  }
                  onClick={() => setSubsidyYear(year)}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <SoeSubsidyBars subsidies={subsidies} />
          </div>
        </section>
      )}
      <QueryError
        query={subsidiesQuery}
        title={i18n._(m["soe.subsidies.title"])}
      />

      {listed !== null && listed !== undefined && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">
              {i18n._(m["soe.listed.title"])}
            </h2>
            <p className="text-sm text-slate-500">
              {i18n._(m["soe.listed.description"])}
            </p>
          </div>
          <SoeListedCompanies listed={listed} />
        </section>
      )}
      <QueryError query={listedQuery} title={i18n._(m["soe.listed.title"])} />

      {selectedCui !== null && (
        <SoeCompanyModal
          cui={selectedCui}
          onClose={() => setSelectedCui(null)}
        />
      )}
    </div>
  );
}

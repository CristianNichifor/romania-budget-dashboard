import { useLingui } from "@lingui/react";
import { useQuery } from "@tanstack/react-query";
import { fetchLabourContext } from "../api/client";
import { MacroTrendChart } from "../components/charts/MacroTrendChart";
import { KpiCard } from "../components/shared/KpiCard";
import { SkeletonCard } from "../components/shared/SkeletonCard";
import { SourceBadge } from "../components/shared/SourceBadge";
import { QueryError } from "../components/shared/SectionError";
import { m } from "../messages";

export function PiataMuncii() {
  const { i18n } = useLingui();

  const labourQuery = useQuery({
    queryKey: ["labour-context"],
    queryFn: fetchLabourContext,
  });
  const { data: labour, isPending } = labourQuery;

  const latestNeet = labour?.neet.at(-1);
  const latestYouth = labour?.youthUnemployment.at(-1);
  const latestVacancy = labour?.vacancies.at(-1);

  const neetData =
    labour?.neet.map((point) => ({ label: point.year, value: point.pct })) ??
    [];
  const youthData =
    labour?.youthUnemployment.map((point) => ({
      label: point.ym,
      value: point.rate,
    })) ?? [];
  const vacancyData =
    labour?.vacancies.map((point) => ({
      label: point.quarter,
      value: point.pct,
    })) ?? [];

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{i18n._(m["labour.title"])}</h2>
            <p className="text-sm text-slate-500">
              {i18n._(m["labour.description"])}
            </p>
          </div>
          <div className="flex gap-2">
            <SourceBadge source="source.eurostat" />
          </div>
        </div>

        {labour?.sourceUpdated !== undefined &&
          labour.sourceUpdated.length > 0 && (
            <p className="text-xs text-slate-400">
              {i18n._({
                ...m["source.updatedAt"],
                values: { date: labour.sourceUpdated },
              })}
            </p>
          )}

        {isPending && (
          <div className="grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <SkeletonCard key={index} className="h-28" />
            ))}
          </div>
        )}

        {latestNeet !== undefined &&
          latestYouth !== undefined &&
          latestVacancy !== undefined && (
            <div className="grid gap-4 sm:grid-cols-3">
              <KpiCard
                accent="red"
                label={i18n._(m["labour.kpi.neet"])}
                value={`${latestNeet.pct.toFixed(1)}%`}
                sub={latestNeet.year}
              />
              <KpiCard
                accent="amber"
                label={i18n._(m["labour.kpi.youth"])}
                value={`${latestYouth.rate.toFixed(1)}%`}
                sub={latestYouth.ym}
              />
              <KpiCard
                accent="blue"
                label={i18n._(m["labour.kpi.vacancy"])}
                value={`${latestVacancy.pct.toFixed(1)}%`}
                sub={latestVacancy.quarter}
              />
            </div>
          )}
      </section>

      {labour !== null && labour !== undefined && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                {i18n._(m["labour.neet.title"])}
              </h2>
              <p className="text-sm text-slate-500">
                {i18n._(m["labour.neet.description"])}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <MacroTrendChart
                data={neetData}
                color="#dc2626"
                ariaLabel={i18n._(m["labour.neet.title"])}
                valueFormatter={(value) => `${value.toFixed(1)}%`}
                exportFilename="piata-muncii-neet.csv"
              />
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                {i18n._(m["labour.youth.title"])}
              </h2>
              <p className="text-sm text-slate-500">
                {i18n._(m["labour.youth.description"])}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <MacroTrendChart
                data={youthData}
                color="#d97706"
                ariaLabel={i18n._(m["labour.youth.title"])}
                valueFormatter={(value) => `${value.toFixed(1)}%`}
                exportFilename="piata-muncii-somaj-tineri.csv"
              />
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                {i18n._(m["labour.vacancy.title"])}
              </h2>
              <p className="text-sm text-slate-500">
                {i18n._(m["labour.vacancy.description"])}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <MacroTrendChart
                data={vacancyData}
                color="#2563eb"
                ariaLabel={i18n._(m["labour.vacancy.title"])}
                valueFormatter={(value) => `${value.toFixed(1)}%`}
                exportFilename="piata-muncii-locuri-vacante.csv"
              />
            </div>
          </section>
        </div>
      )}
      <QueryError query={labourQuery} />

      {labour === null && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {i18n._(m["soe.unavailable"])}
        </div>
      )}
    </div>
  );
}

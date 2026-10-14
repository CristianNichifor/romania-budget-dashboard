import { useLingui } from "@lingui/react";
import { useQuery } from "@tanstack/react-query";
import { fetchJusticeContext } from "../api/client";
import { MacroTrendChart } from "../components/charts/MacroTrendChart";
import { KpiCard } from "../components/shared/KpiCard";
import { SkeletonCard } from "../components/shared/SkeletonCard";
import { SourceBadge } from "../components/shared/SourceBadge";
import { QueryError } from "../components/shared/SectionError";
import { m } from "../messages";

const countFormatter = new Intl.NumberFormat("ro-RO", {
  maximumFractionDigits: 0,
});

export function Justitie() {
  const { i18n } = useLingui();

  const justiceQuery = useQuery({
    queryKey: ["justice-context"],
    queryFn: fetchJusticeContext,
  });
  const { data: justice, isPending } = justiceQuery;

  const latestHomicides = justice?.homicides.at(-1);
  const latestPrison = justice?.prison.at(-1);
  const latestPolice = justice?.police.at(-1);

  const homicideData =
    justice?.homicides.map((point) => ({
      label: point.year,
      value: point.count,
    })) ?? [];
  const prisonData =
    justice?.prison.map((point) => ({
      label: point.year,
      value: point.prisoners,
    })) ?? [];
  const policeData =
    justice?.police.map((point) => ({
      label: point.year,
      value: point.officers,
    })) ?? [];

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{i18n._(m["justice.title"])}</h2>
            <p className="text-sm text-slate-500">
              {i18n._(m["justice.description"])}
            </p>
          </div>
          <div className="flex gap-2">
            <SourceBadge source="source.eurostat" />
          </div>
        </div>

        {justice?.sourceUpdated !== undefined &&
          justice.sourceUpdated.length > 0 && (
            <p className="text-xs text-slate-400">
              {i18n._({
                ...m["source.updatedAt"],
                values: { date: justice.sourceUpdated },
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

        {latestHomicides !== undefined &&
          latestPrison !== undefined &&
          latestPolice !== undefined && (
            <div className="grid gap-4 sm:grid-cols-3">
              <KpiCard
                accent="red"
                label={i18n._(m["justice.kpi.homicides"])}
                value={countFormatter.format(latestHomicides.count)}
                sub={latestHomicides.year}
              />
              <KpiCard
                accent="slate"
                label={i18n._(m["justice.kpi.prison"])}
                value={countFormatter.format(latestPrison.prisoners)}
                sub={latestPrison.year}
              />
              <KpiCard
                accent="blue"
                label={i18n._(m["justice.kpi.police"])}
                value={countFormatter.format(latestPolice.officers)}
                sub={latestPolice.year}
              />
            </div>
          )}
      </section>

      {justice !== null && justice !== undefined && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                {i18n._(m["justice.homicides.title"])}
              </h2>
              <p className="text-sm text-slate-500">
                {i18n._(m["justice.homicides.description"])}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <MacroTrendChart
                data={homicideData}
                color="#dc2626"
                ariaLabel={i18n._(m["justice.homicides.title"])}
                valueFormatter={(value) => countFormatter.format(value)}
                exportFilename="justitie-omucideri.csv"
              />
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                {i18n._(m["justice.prison.title"])}
              </h2>
              <p className="text-sm text-slate-500">
                {i18n._(m["justice.prison.description"])}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <MacroTrendChart
                data={prisonData}
                color="#475569"
                ariaLabel={i18n._(m["justice.prison.title"])}
                valueFormatter={(value) => countFormatter.format(value)}
                exportFilename="justitie-penitenciar.csv"
              />
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                {i18n._(m["justice.police.title"])}
              </h2>
              <p className="text-sm text-slate-500">
                {i18n._(m["justice.police.description"])}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <MacroTrendChart
                data={policeData}
                color="#2563eb"
                ariaLabel={i18n._(m["justice.police.title"])}
                valueFormatter={(value) => countFormatter.format(value)}
                exportFilename="justitie-politisti.csv"
              />
            </div>
          </section>
        </div>
      )}
      <QueryError query={justiceQuery} />

      {justice === null && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {i18n._(m["soe.unavailable"])}
        </div>
      )}
    </div>
  );
}

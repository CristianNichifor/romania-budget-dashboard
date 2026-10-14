import { useLingui } from "@lingui/react";
import { useQuery } from "@tanstack/react-query";
import { fetchEnergyContext } from "../api/client";
import { MacroTrendChart } from "../components/charts/MacroTrendChart";
import { KpiCard } from "../components/shared/KpiCard";
import { SkeletonCard } from "../components/shared/SkeletonCard";
import { SourceBadge } from "../components/shared/SourceBadge";
import { QueryError } from "../components/shared/SectionError";
import { m } from "../messages";

export function Energie() {
  const { i18n } = useLingui();

  const energyQuery = useQuery({
    queryKey: ["energy-context"],
    queryFn: fetchEnergyContext,
  });
  const { data: energy, isPending } = energyQuery;

  const latestElectricity = energy?.electricity.at(-1);
  const latestRenewables = energy?.renewables.at(-1);
  const latestImport = energy?.importDependency.at(-1);

  const electricityData =
    energy?.electricity.map((point) => ({
      label: point.period,
      value: point.eurPerKwh,
    })) ?? [];
  const renewablesData =
    energy?.renewables.map((point) => ({
      label: point.year,
      value: point.pct,
    })) ?? [];
  const importData =
    energy?.importDependency.map((point) => ({
      label: point.year,
      value: point.pct,
    })) ?? [];

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{i18n._(m["energy.title"])}</h2>
            <p className="text-sm text-slate-500">
              {i18n._(m["energy.description"])}
            </p>
          </div>
          <div className="flex gap-2">
            <SourceBadge source="source.eurostat" />
          </div>
        </div>

        {energy?.sourceUpdated !== undefined &&
          energy.sourceUpdated.length > 0 && (
            <p className="text-xs text-slate-400">
              {i18n._({
                ...m["source.updatedAt"],
                values: { date: energy.sourceUpdated },
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

        {latestElectricity !== undefined &&
          latestRenewables !== undefined &&
          latestImport !== undefined && (
            <div className="grid gap-4 sm:grid-cols-3">
              <KpiCard
                accent="amber"
                label={i18n._(m["energy.kpi.electricity"])}
                value={`${latestElectricity.eurPerKwh.toFixed(4)} €/kWh`}
                sub={latestElectricity.period}
              />
              <KpiCard
                accent="blue"
                label={i18n._(m["energy.kpi.renewables"])}
                value={`${latestRenewables.pct.toFixed(1)}%`}
                sub={`${latestRenewables.year} · ${i18n._(m["energy.renewablesLegend"])}`}
              />
              <KpiCard
                accent="red"
                label={i18n._(m["energy.kpi.import"])}
                value={`${latestImport.pct.toFixed(1)}%`}
                sub={`${latestImport.year} · ${i18n._(m["energy.importLegend"])}`}
              />
            </div>
          )}
      </section>

      {energy !== null && energy !== undefined && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                {i18n._(m["energy.electricity.title"])}
              </h2>
              <p className="text-sm text-slate-500">
                {i18n._(m["energy.electricity.description"])}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <MacroTrendChart
                data={electricityData}
                color="#d97706"
                ariaLabel={i18n._(m["energy.electricity.title"])}
                valueFormatter={(value) => `${value.toFixed(4)} €`}
                exportFilename="energie-pret-electricitate.csv"
              />
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                {i18n._(m["energy.renewables.title"])}
              </h2>
              <p className="text-sm text-slate-500">
                {i18n._(m["energy.renewables.description"])}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <MacroTrendChart
                data={renewablesData}
                color="#16a34a"
                ariaLabel={i18n._(m["energy.renewables.title"])}
                valueFormatter={(value) => `${value.toFixed(1)}%`}
                exportFilename="energie-regenerabile.csv"
              />
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                {i18n._(m["energy.import.title"])}
              </h2>
              <p className="text-sm text-slate-500">
                {i18n._(m["energy.import.description"])}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <MacroTrendChart
                data={importData}
                color="#dc2626"
                ariaLabel={i18n._(m["energy.import.title"])}
                valueFormatter={(value) => `${value.toFixed(1)}%`}
                exportFilename="energie-dependenta-import.csv"
              />
            </div>
          </section>
        </div>
      )}
      <QueryError query={energyQuery} />

      {energy === null && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {i18n._(m["soe.unavailable"])}
        </div>
      )}
    </div>
  );
}

import { useLingui } from "@lingui/react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  fetchInsCatalog,
  fetchInsMetric,
  fetchSocietyDemographics,
  fetchSocietyEducation,
  fetchSocietyHealth,
  fetchSocietyPopulation,
  fetchSocietySpending,
} from "../api/client";
import { MacroTrendChart } from "../components/charts/MacroTrendChart";
import { SocietySpendingChart } from "../components/charts/SocietySpendingChart";
import { InsMetricSelect } from "../components/shared/InsMetricSelect";
import { KpiCard } from "../components/shared/KpiCard";
import { SkeletonCard } from "../components/shared/SkeletonCard";
import { SourceBadge } from "../components/shared/SourceBadge";
import { joinPhysicianDensity, joinSpending } from "../lib/society";
import { DemoBadge } from "../components/shared/DemoBadge";
import { QueryError } from "../components/shared/SectionError";
import { MISSING, formatNumber } from "../lib/format";
import { m } from "../messages";

const DEFAULT_SOCIETY_METRIC = "infant-mortality";

export function Societate() {
  const { i18n } = useLingui();
  const [societyMetric, setSocietyMetric] = useState(DEFAULT_SOCIETY_METRIC);

  const populationQuery = useQuery({
    queryKey: ["society-population"],
    queryFn: fetchSocietyPopulation,
  });
  const { data: population } = populationQuery;

  const spendingQuery = useQuery({
    queryKey: ["society-spending"],
    queryFn: fetchSocietySpending,
  });
  const { data: spending } = spendingQuery;

  const educationQuery = useQuery({
    queryKey: ["society-education"],
    queryFn: fetchSocietyEducation,
  });
  const { data: education } = educationQuery;

  const healthQuery = useQuery({
    queryKey: ["society-health"],
    queryFn: fetchSocietyHealth,
  });
  const { data: health } = healthQuery;

  const demographicsQuery = useQuery({
    queryKey: ["society-demographics"],
    queryFn: fetchSocietyDemographics,
  });
  const { data: demographics } = demographicsQuery;

  const insCatalogQuery = useQuery({
    queryKey: ["ins-catalog"],
    queryFn: fetchInsCatalog,
  });
  const { data: insCatalog } = insCatalogQuery;

  const insMetricQuery = useQuery({
    queryKey: ["ins-metric", societyMetric],
    queryFn: () => fetchInsMetric(societyMetric),
  });
  const { data: insMetric } = insMetricQuery;

  const spendingData = useMemo(
    () => joinSpending(spending ?? { health: [], education: [] }),
    [spending]
  );

  const populationData =
    population?.yearly.map((point) => ({
      label: point.year,
      value: point.population,
    })) ?? [];

  const latestPopulation = population?.yearly.at(-1);
  const previousPopulation = population?.yearly.at(-2);

  const populationChange =
    latestPopulation !== undefined && previousPopulation !== undefined
      ? latestPopulation.population - previousPopulation.population
      : null;

  const insData =
    insMetric?.data.map((point) => ({
      label: String(point.year),
      value: point.value,
    })) ?? [];

  const physicianDensity = useMemo(
    () =>
      joinPhysicianDensity(health?.physicians ?? [], population?.yearly ?? []),
    [health, population]
  );

  const latestEarlyLeavers = education?.earlyLeavers.at(-1);
  const latestTertiary = education?.tertiaryAttainment.at(-1);
  const latestMedianAge = demographics?.medianAge.at(-1);
  const latestPhysicianDensity = physicianDensity.at(-1);

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{i18n._(m["society.title"])}</h2>
            <p className="text-sm text-slate-500">
              {i18n._(m["society.description"])}
            </p>
          </div>
          <div className="flex gap-2">
            <SourceBadge source="source.eurostat" />
            <SourceBadge source="source.ins" />
          </div>
        </div>

        {population?.sourceUpdated !== undefined &&
          population.sourceUpdated.length > 0 && (
            <p className="text-xs text-slate-400">
              {i18n._({
                ...m["source.updatedAt"],
                values: { date: population.sourceUpdated },
              })}
            </p>
          )}

        {population !== null && population !== undefined && (
          <div className="grid gap-4 sm:grid-cols-2">
            <KpiCard
              accent="slate"
              label={i18n._(m["society.kpi.population"])}
              value={
                latestPopulation === undefined
                  ? MISSING
                  : formatNumber(latestPopulation.population)
              }
              sub={`${latestPopulation?.year ?? ""} · Eurostat`}
            />
            <KpiCard
              accent="amber"
              label={i18n._(m["society.kpi.populationChange"])}
              value={
                populationChange === null
                  ? MISSING
                  : populationChange > 0
                    ? `+${formatNumber(populationChange)}`
                    : formatNumber(populationChange)
              }
              sub={i18n._(m["society.kpi.populationChangeSub"])}
            />
          </div>
        )}
      </section>

      {population !== null && population !== undefined && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">
              {i18n._(m["society.population.title"])}
            </h2>
            <p className="text-sm text-slate-500">
              {i18n._(m["society.population.description"])}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <MacroTrendChart
              data={populationData}
              color="#475569"
              ariaLabel={i18n._(m["society.population.title"])}
              valueFormatter={(value) =>
                `${(value / 1_000_000).toFixed(1)} mil.`
              }
            />
          </div>
        </section>
      )}
      <QueryError
        query={populationQuery}
        title={i18n._(m["society.population.title"])}
      />

      {spending !== null && spending !== undefined && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">
              {i18n._(m["society.spending.title"])}
            </h2>
            <p className="text-sm text-slate-500">
              {i18n._(m["society.spending.description"])}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <SocietySpendingChart
              data={spendingData}
              healthLabel={i18n._(m["society.spending.health"])}
              educationLabel={i18n._(m["society.spending.education"])}
              ariaLabel={i18n._(m["society.spending.title"])}
            />
          </div>
        </section>
      )}
      <QueryError
        query={spendingQuery}
        title={i18n._(m["society.spending.title"])}
      />

      {education !== null && education !== undefined && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">
              {i18n._(m["society.education.title"])}
            </h2>
            <p className="text-sm text-slate-500">
              {i18n._(m["society.education.description"])}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <KpiCard
              accent="blue"
              label={i18n._(m["society.education.earlyLeavers"])}
              value={
                latestEarlyLeavers === undefined
                  ? MISSING
                  : `${latestEarlyLeavers.pct.toFixed(1)}%`
              }
              sub={`${latestEarlyLeavers?.year ?? ""} · Eurostat`}
            />
            <KpiCard
              accent="slate"
              label={i18n._(m["society.education.tertiary"])}
              value={
                latestTertiary === undefined
                  ? MISSING
                  : `${latestTertiary.pct.toFixed(1)}%`
              }
              sub={`${latestTertiary?.year ?? ""} · Eurostat`}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <MacroTrendChart
                data={education.earlyLeavers.map((point) => ({
                  label: point.year,
                  value: point.pct,
                }))}
                color="#2563eb"
                ariaLabel={i18n._(m["society.education.earlyLeavers"])}
                valueFormatter={(value) => `${value.toFixed(1)}%`}
                heightClass="h-56"
              />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <MacroTrendChart
                data={education.tertiaryAttainment.map((point) => ({
                  label: point.year,
                  value: point.pct,
                }))}
                color="#0d9488"
                ariaLabel={i18n._(m["society.education.tertiary"])}
                valueFormatter={(value) => `${value.toFixed(1)}%`}
                heightClass="h-56"
              />
            </div>
          </div>
        </section>
      )}
      <QueryError
        query={educationQuery}
        title={i18n._(m["society.education.title"])}
      />

      {health !== null && health !== undefined && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">
              {i18n._(m["society.health.title"])}
            </h2>
            <p className="text-sm text-slate-500">
              {i18n._(m["society.health.description"])}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <KpiCard
              accent="slate"
              label={i18n._(m["society.health.physicians"])}
              value={
                latestPhysicianDensity === undefined
                  ? MISSING
                  : formatNumber(latestPhysicianDensity.per100k, {
                      maximumFractionDigits: 1,
                    })
              }
              sub={`${latestPhysicianDensity?.year ?? ""} · la 100.000 locuitori`}
            />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <MacroTrendChart
              data={physicianDensity.map((point) => ({
                label: point.year,
                value: point.per100k,
              }))}
              color="#0d9488"
              ariaLabel={i18n._(m["society.health.physicians"])}
              valueFormatter={(value) =>
                formatNumber(value, { maximumFractionDigits: 1 })
              }
              heightClass="h-56"
            />
          </div>
        </section>
      )}
      <QueryError
        query={healthQuery}
        title={i18n._(m["society.health.title"])}
      />

      {demographics !== null && demographics !== undefined && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">
              {i18n._(m["society.demographics.title"])}
            </h2>
            <p className="text-sm text-slate-500">
              {i18n._(m["society.demographics.description"])}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <KpiCard
              accent="slate"
              label={i18n._(m["society.demographics.medianAge"])}
              value={
                latestMedianAge === undefined
                  ? MISSING
                  : `${latestMedianAge.age.toFixed(1)} ani`
              }
              sub={`${latestMedianAge?.year ?? ""} · Eurostat`}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <MacroTrendChart
                data={demographics.medianAge.map((point) => ({
                  label: point.year,
                  value: point.age,
                }))}
                color="#475569"
                ariaLabel={i18n._(m["society.demographics.medianAge"])}
                valueFormatter={(value) => `${value.toFixed(1)}`}
                heightClass="h-56"
              />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <MacroTrendChart
                data={demographics.netMigration.map((point) => ({
                  label: point.year,
                  value: point.per1000,
                }))}
                color="#b45309"
                ariaLabel={i18n._(m["society.demographics.netMigration"])}
                valueFormatter={(value) => `${value.toFixed(1)}‰`}
                reference={{ value: 0, label: "0" }}
                heightClass="h-56"
              />
            </div>
          </div>
        </section>
      )}
      <QueryError
        query={demographicsQuery}
        title={i18n._(m["society.demographics.title"])}
      />

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">
            {i18n._(m["society.ins.title"])}
          </h2>
          <p className="text-sm text-slate-500">
            {i18n._(m["society.ins.description"])}
          </p>
          <DemoBadge />
        </div>
        {insCatalog !== undefined && insCatalog.length > 0 && (
          <InsMetricSelect
            options={insCatalog}
            value={societyMetric}
            onChange={setSocietyMetric}
          />
        )}
        {insMetric !== undefined && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <MacroTrendChart
              data={insData}
              color="#0d9488"
              ariaLabel={insMetric.label}
              valueFormatter={(value) => value.toFixed(1)}
            />
          </div>
        )}
        <QueryError query={insMetricQuery} />
      </section>

      {(populationQuery.isPending || spendingQuery.isPending) && (
        <SkeletonCard className="h-72" />
      )}
    </div>
  );
}

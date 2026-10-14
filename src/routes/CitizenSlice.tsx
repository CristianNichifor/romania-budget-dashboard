import { useLingui } from "@lingui/react";
import { useQuery } from "@tanstack/react-query";
import * as Slider from "@radix-ui/react-slider";
import { Wallet } from "lucide-react";
import {
  fetchFx,
  fetchRealWage,
  fetchSalaryBreakdown,
  fetchWageContext,
  fetchWageMonthly,
} from "../api/client";
import { MacroTrendChart } from "../components/charts/MacroTrendChart";
import { RealWageLine } from "../components/charts/RealWageLine";
import { SalaryWaterfall } from "../components/charts/SalaryWaterfall";
import { KpiCard } from "../components/shared/KpiCard";
import { SkeletonCard } from "../components/shared/SkeletonCard";
import { SourceBadge } from "../components/shared/SourceBadge";
import { formatEur, formatLei, formatPercent } from "../lib/format";
import { estimateAverageNetSalary } from "../lib/averageSalary";
import { buildSalaryWaterfallRows } from "../lib/waterfall";
import { useSalaryStore } from "../store/useSalaryStore";
import { QueryError } from "../components/shared/SectionError";
import { m } from "../messages";

export function CitizenSlice() {
  const { i18n } = useLingui();
  const gross = useSalaryStore((state) => state.gross);
  const setGross = useSalaryStore((state) => state.setGross);

  const breakdownQuery = useQuery({
    queryKey: ["salary", gross],
    queryFn: () => fetchSalaryBreakdown(gross),
  });
  const { data: breakdown } = breakdownQuery;

  const realWageQuery = useQuery({
    queryKey: ["real-wage"],
    queryFn: fetchRealWage,
  });
  const { data: realWage } = realWageQuery;

  const wageContextQuery = useQuery({
    queryKey: ["wage-context"],
    queryFn: fetchWageContext,
  });
  const { data: wageContext } = wageContextQuery;

  const wageMonthlyQuery = useQuery({
    queryKey: ["wage-monthly"],
    queryFn: fetchWageMonthly,
  });
  const { data: wageMonthly } = wageMonthlyQuery;

  const fxQuery = useQuery({
    queryKey: ["fx"],
    queryFn: fetchFx,
  });
  const { data: fx } = fxQuery;

  const estimatedAverageNet = estimateAverageNetSalary(
    wageContext?.sesAnchors ?? [],
    fx?.series ?? []
  );

  const vsAverage =
    breakdown !== null &&
    breakdown !== undefined &&
    estimatedAverageNet !== null
      ? breakdown.net.div(estimatedAverageNet).mul(100).minus(100).toNumber()
      : null;

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{i18n._(m["salary.title"])}</h2>
            <p className="text-sm text-slate-500">
              {i18n._(m["salary.description"])}
            </p>
          </div>
          <div className="flex gap-2">
            <SourceBadge source="source.budgetYear" values={{ year: 2026 }} />
            <SourceBadge source="source.ins" />
            <SourceBadge source="source.bnr" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <label
            htmlFor="salary-slider"
            className="text-sm font-medium text-slate-700"
          >
            {i18n._(m["salary.grossLabel"])}
          </label>
          <div className="mt-2 flex items-center gap-4">
            <Slider.Root
              id="salary-slider"
              className="relative flex h-5 flex-1 touch-none select-none items-center"
              min={1000}
              max={50000}
              step={100}
              value={[gross]}
              onValueChange={(values) => {
                const first = values[0];
                if (first !== undefined) {
                  setGross(first);
                }
              }}
            >
              <Slider.Track className="relative h-1.5 grow rounded-full bg-slate-200">
                <Slider.Range className="absolute h-full rounded-full bg-budget-blue" />
              </Slider.Track>
              <Slider.Thumb className="block size-5 rounded-full border-2 border-budget-blue bg-white shadow transition-colors focus-visible:outline-2 focus-visible:outline-budget-blue" />
            </Slider.Root>
            <span className="w-28 text-right text-lg font-bold tabular-nums">
              {formatLei(gross)}
            </span>
          </div>
        </div>

        {breakdown !== null && breakdown !== undefined && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <KpiCard
                accent="blue"
                label={i18n._(m["salary.netStat"])}
                value={`${formatLei(breakdown.net)} ${i18n._(m["salary.perMonth"])}`}
              />
              <KpiCard
                accent="red"
                label={i18n._(m["salary.stateShareStat"])}
                value={formatLei(breakdown.stateShare)}
                sub={`${formatPercent(breakdown.statePercent)} ${i18n._(m["salary.effectiveRate"])}`}
              />
              <KpiCard
                accent="slate"
                label={i18n._(m["salary.vsAverage"])}
                value={
                  vsAverage === null
                    ? "—"
                    : Math.abs(vsAverage) < 0.5
                      ? "0%"
                      : vsAverage > 0
                        ? `+${vsAverage.toFixed(0)}%`
                        : `${vsAverage.toFixed(0)}%`
                }
                sub={
                  estimatedAverageNet !== null
                    ? `${i18n._(m["salary.netStat"])}: ${formatLei(estimatedAverageNet)}`
                    : i18n._(m["salary.estimateLoading"])
                }
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <SalaryWaterfall rows={buildSalaryWaterfallRows(breakdown)} />
            </div>
          </>
        )}
        <QueryError query={breakdownQuery} />
        {(breakdown === null || breakdown === undefined) && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              {[0, 1, 2].map((index) => (
                <SkeletonCard key={index} className="h-28" />
              ))}
            </div>
            <SkeletonCard className="h-72" />
          </>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{i18n._(m["realWage.title"])}</h2>
            <p className="text-sm text-slate-500">
              {i18n._(m["realWage.description"])}
            </p>
          </div>
          <div className="flex gap-2">
            <SourceBadge source="source.eurostat" />
          </div>
        </div>

        {realWage !== null &&
          realWage !== undefined &&
          realWage.sourceUpdated.length > 0 && (
            <p className="text-xs text-slate-400">
              {i18n._({
                ...m["source.updatedAt"],
                values: { date: realWage.sourceUpdated },
              })}
            </p>
          )}

        {realWage !== null && realWage !== undefined && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <RealWageLine series={realWage.series} />
            {realWage.estimated && (
              <p className="mt-2 text-xs text-slate-400">
                {i18n._(m["wageContext.estimatedNote"])}
              </p>
            )}
          </div>
        )}
        <QueryError query={realWageQuery} />
        {(realWage === null || realWage === undefined) && (
          <SkeletonCard className="h-64" />
        )}
      </section>

      {wageContext !== null && wageContext !== undefined && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">
                {i18n._(m["wageContext.title"])}
              </h2>
              <p className="text-sm text-slate-500">
                {i18n._(m["wageContext.description"])}
              </p>
            </div>
            <div className="flex gap-2">
              <SourceBadge source="source.eurostat" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {wageContext.sesAnchors.map((anchor) => (
              <KpiCard
                key={anchor.year}
                accent="blue"
                label={i18n._({
                  ...m["wageContext.anchor"],
                  values: { year: anchor.year },
                })}
                value={formatEur(anchor.meanGrossEur)}
                sub={i18n._(m["wageContext.anchorSub"])}
              />
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700">
              {i18n._(m["wageContext.lciTitle"])}
            </h3>
            <p className="mb-2 text-xs text-slate-500">
              {i18n._(m["wageContext.lciDescription"])}
            </p>
            <MacroTrendChart
              data={wageContext.lciQuarterly.map((point) => ({
                label: point.quarter,
                value: point.pctChange,
              }))}
              color="#2563eb"
              ariaLabel={i18n._(m["wageContext.lciTitle"])}
              valueFormatter={(value) => `${value.toFixed(1)}%`}
              heightClass="h-56"
            />
          </div>

          {wageMonthly !== null && wageMonthly !== undefined && (
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-700">
                {i18n._(m["wageContext.monthlyTitle"])}
              </h3>
              <p className="mb-2 text-xs text-slate-500">
                {i18n._(m["wageContext.monthlyDescription"])}
              </p>
              <MacroTrendChart
                data={wageMonthly.monthly.map((point) => ({
                  label: point.quarter,
                  value: point.grossMonthlyEur,
                }))}
                color="#7c3aed"
                ariaLabel={i18n._(m["wageContext.monthlyTitle"])}
                valueFormatter={(value) => formatEur(value)}
                heightClass="h-56"
              />
              {wageMonthly.estimated && (
                <p className="mt-2 text-xs text-slate-400">
                  {i18n._(m["wageContext.estimatedNote"])}
                </p>
              )}
            </div>
          )}
        </section>
      )}
      <QueryError
        query={wageContextQuery}
        title={i18n._(m["wageContext.title"])}
      />

      <section className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <Wallet className="size-5 shrink-0" aria-hidden="true" />
        <p>{i18n._(m["salary.rateNote"])}</p>
      </section>
    </div>
  );
}

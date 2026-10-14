import { useLingui } from "@lingui/react";
import { useQuery } from "@tanstack/react-query";
import { Decimal } from "decimal.js";
import { useMemo, useState } from "react";
import {
  fetchBudgetComparison,
  fetchBudgetSummary,
  fetchBudgetTrend,
  fetchCountyInvestments,
  fetchDestinations,
  fetchInsCatalog,
  fetchInsMetric,
} from "../api/client";
import { AdoptedExecutionChart } from "../components/charts/AdoptedExecutionChart";
import { BudgetSankey } from "../components/charts/BudgetSankey";
import { DebtGauge } from "../components/charts/DebtGauge";
import { DestinationTreemap } from "../components/charts/DestinationTreemap";
import { DualAxisTrend } from "../components/charts/DualAxisTrend";
import { InvestmentCartogram } from "../components/charts/InvestmentCartogram";
import { DrilldownModal } from "../components/shared/DrilldownModal";
import { InsMetricSelect } from "../components/shared/InsMetricSelect";
import { KpiCard } from "../components/shared/KpiCard";
import { SkeletonCard } from "../components/shared/SkeletonCard";
import { SourceBadge } from "../components/shared/SourceBadge";
import { YearSelector } from "../components/shared/YearSelector";
import {
  formatMilliardeLei,
  formatPercent,
  formatSignedPercent,
} from "../lib/format";
import {
  deficitMagnitude,
  deficitOverrun,
  findComparisonPoint,
  toDeficitSeries,
} from "../lib/adoptedComparison";
import { computeTrendInsight, joinBudgetWithIns } from "../lib/trendJoin";
import { useBudgetYearStore } from "../store/useBudgetYearStore";
import { DemoBadge } from "../components/shared/DemoBadge";
import { EmptyState } from "../components/shared/EmptyState";
import { QueryError, SectionError } from "../components/shared/SectionError";
import { expandRest } from "../lib/expandRest";
import { isPartialYear } from "../lib/partialYear";
import { m } from "../messages";

const DEFAULT_CONTEXT_METRIC = "infant-mortality";
const CONTEXT_BUDGET_METRIC = "health-budget";

export function NationalBalance() {
  const { i18n } = useLingui();
  const [selectedDestinationId, setSelectedDestinationId] = useState<
    string | null
  >(null);
  const [contextMetric, setContextMetric] = useState(DEFAULT_CONTEXT_METRIC);
  const year = useBudgetYearStore((state) => state.year);
  const currentYear = new Date().getFullYear();

  const summaryQuery = useQuery({
    queryKey: ["budget-summary", year],
    queryFn: () => fetchBudgetSummary(String(year)),
    enabled: year !== null,
  });
  const { data: summary } = summaryQuery;

  const destinationsQuery = useQuery({
    queryKey: ["destinations", year],
    queryFn: () => fetchDestinations(String(year)),
    select: expandRest,
    enabled: year !== null,
  });
  const { data: destinations } = destinationsQuery;

  const budgetTrendQuery = useQuery({
    queryKey: ["budget-trend", CONTEXT_BUDGET_METRIC],
    queryFn: () => fetchBudgetTrend(CONTEXT_BUDGET_METRIC),
  });
  const { data: budgetTrend } = budgetTrendQuery;

  const insCatalogQuery = useQuery({
    queryKey: ["ins-catalog"],
    queryFn: fetchInsCatalog,
  });
  const { data: insCatalog } = insCatalogQuery;

  const insMetricQuery = useQuery({
    queryKey: ["ins-metric", contextMetric],
    queryFn: () => fetchInsMetric(contextMetric),
  });
  const { data: insMetric } = insMetricQuery;

  const investmentsQuery = useQuery({
    queryKey: ["investments-by-county"],
    queryFn: fetchCountyInvestments,
  });
  const { data: investments } = investmentsQuery;

  const comparisonQuery = useQuery({
    queryKey: ["budget-comparison"],
    queryFn: fetchBudgetComparison,
  });
  const { data: comparison } = comparisonQuery;

  const comparisonSeries = useMemo(
    () => toDeficitSeries(comparison?.points ?? []),
    [comparison]
  );

  const comparisonForYear = useMemo(
    () =>
      comparison !== null && comparison !== undefined && year !== null
        ? (findComparisonPoint(comparison.points, year) ?? null)
        : null,
    [comparison, year]
  );

  const comparisonOverrun =
    comparisonForYear === null ? null : deficitOverrun(comparisonForYear);

  const trendData = useMemo(() => {
    if (budgetTrend === undefined || insMetric === undefined) {
      return null;
    }
    return joinBudgetWithIns(budgetTrend.data, insMetric.data);
  }, [budgetTrend, insMetric]);

  const trendInsight = useMemo(() => {
    if (budgetTrend === undefined || insMetric === undefined) {
      return null;
    }
    return computeTrendInsight(budgetTrend.data, insMetric.data);
  }, [budgetTrend, insMetric]);

  const deficitPercent =
    summary !== undefined && summary !== null
      ? new Decimal(summary.deficitPercentGdp).toNumber()
      : 0;

  const partialYear =
    summary !== undefined && summary !== null
      ? isPartialYear(summary, currentYear)
      : year === currentYear;
  const partialMarker = partialYear
    ? i18n._(m["balance.kpi.partialYear"])
    : undefined;
  const emptyYear = (
    <EmptyState>
      {i18n._({ ...m["section.emptyYear"], values: { year: String(year) } })}
    </EmptyState>
  );

  const destinationIds = useMemo(
    () => new Set(destinations?.map((destination) => destination.id) ?? []),
    [destinations]
  );

  const selectedDestination =
    selectedDestinationId !== null
      ? (destinations?.find(
          (destination) => destination.id === selectedDestinationId
        ) ?? null)
      : null;

  const closeDrilldown = () => setSelectedDestinationId(null);

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{i18n._(m["balance.title"])}</h2>
            <p className="text-sm text-slate-500">
              {i18n._(m["balance.description"])}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <YearSelector />
            <SourceBadge
              source="source.budgetYear"
              values={{ year: year ?? "" }}
            />
            <DemoBadge />
          </div>
        </div>

        {partialYear && (
          <p className="text-xs text-amber-700">
            {i18n._(m["year.inProgressCaption"])}
          </p>
        )}

        {summary !== undefined && summary !== null && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              accent="blue"
              label={i18n._(m["balance.kpi.revenue"])}
              value={formatMilliardeLei(summary.revenue)}
              sub={partialMarker}
            />
            <KpiCard
              accent="slate"
              label={i18n._(m["balance.kpi.expenditure"])}
              value={formatMilliardeLei(summary.expenditure)}
              sub={partialMarker}
            />
            <KpiCard
              accent="red"
              label={i18n._(m["balance.kpi.deficit"])}
              value={formatMilliardeLei(summary.deficit)}
              sub={partialMarker}
            />
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                {i18n._(m["balance.kpi.deficitGdp"])}
              </p>
              <DebtGauge valuePercent={deficitPercent} />
              <p className="mt-1 text-center text-xs text-slate-500">
                {i18n._(m["balance.debtGauge.reference"])}
              </p>
            </div>
          </div>
        )}
        {summary === null && emptyYear}
        {summaryQuery.isPending && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((index) => (
              <SkeletonCard key={index} className="h-32" />
            ))}
          </div>
        )}
        <QueryError query={summaryQuery} />
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">
              {i18n._(m["comparison.title"])}
            </h2>
            <p className="text-sm text-slate-500">
              {i18n._(m["comparison.description"])}
            </p>
          </div>
          <div className="flex gap-2">
            <SourceBadge source="source.mfp" />
            <SourceBadge source="source.transparenta" />
          </div>
        </div>

        {comparisonForYear !== null && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              accent="slate"
              label={i18n._(m["comparison.kpi.adoptedDeficit"])}
              value={formatMilliardeLei(
                deficitMagnitude(comparisonForYear.adopted.deficit)
              )}
            />
            <KpiCard
              accent="red"
              label={i18n._(m["comparison.kpi.executedDeficit"])}
              value={
                comparisonForYear.executed === null
                  ? "—"
                  : formatMilliardeLei(
                      deficitMagnitude(comparisonForYear.executed.deficit)
                    )
              }
            />
            <KpiCard
              accent="amber"
              label={i18n._(m["comparison.kpi.delta"])}
              value={
                comparisonOverrun === null
                  ? "—"
                  : formatMilliardeLei(comparisonOverrun)
              }
            />
            <KpiCard
              accent="red"
              label={i18n._(m["comparison.kpi.executedGdp"])}
              value={
                comparisonForYear.executed === null
                  ? "—"
                  : formatPercent(comparisonForYear.executed.deficitPercentGdp)
              }
            />
          </div>
        )}

        {comparisonSeries.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <AdoptedExecutionChart data={comparisonSeries} />
            <p className="mt-3 text-xs text-slate-500">
              {i18n._(m["comparison.scopeNote"])}
            </p>
          </div>
        )}

        {comparison === null && (
          <p className="text-sm text-slate-500">
            {i18n._(m["comparison.unavailable"])}
          </p>
        )}
        {comparisonQuery.isPending && <SkeletonCard className="h-80" />}
        <QueryError query={comparisonQuery} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">{i18n._(m["sankey.title"])}</h2>
          <p className="text-sm text-slate-500">
            {i18n._(m["sankey.description"])}
          </p>
          <DemoBadge />
        </div>
        {summary != null && destinations !== undefined && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <BudgetSankey
              summary={summary}
              destinations={destinations}
              selectableIds={destinationIds}
              onSelect={setSelectedDestinationId}
            />
          </div>
        )}
        {(summary === null || destinations?.length === 0) && emptyYear}
        {(summaryQuery.isPending || destinationsQuery.isPending) && (
          <SkeletonCard className="h-[420px]" />
        )}
        <QueryError query={destinationsQuery} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">{i18n._(m["treemap.title"])}</h2>
          <p className="text-sm text-slate-500">
            {i18n._(m["treemap.description"])}
          </p>
          <DemoBadge />
        </div>
        {destinations !== undefined && destinations.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <DestinationTreemap
              destinations={destinations}
              onSelect={setSelectedDestinationId}
            />
          </div>
        )}
        {destinations?.length === 0 && emptyYear}
        {destinationsQuery.isPending && <SkeletonCard className="h-80" />}
        <QueryError query={destinationsQuery} />
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{i18n._(m["context.title"])}</h2>
            <p className="text-sm text-slate-500">
              {i18n._(m["context.description"])}
            </p>
          </div>
          <div className="flex gap-2">
            <SourceBadge source="source.eurostat" />
            <DemoBadge />
          </div>
        </div>
        {budgetTrend !== undefined && budgetTrend.sourceUpdated.length > 0 && (
          <p className="text-xs text-slate-400">
            {i18n._({
              ...m["source.updatedAt"],
              values: { date: budgetTrend.sourceUpdated },
            })}
          </p>
        )}
        {insCatalog !== undefined && insCatalog.length > 0 && (
          <InsMetricSelect
            options={insCatalog}
            value={contextMetric}
            onChange={setContextMetric}
          />
        )}
        {trendData !== null && insMetric !== undefined && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <DualAxisTrend
              data={trendData}
              leftLabel={i18n._(m["context.budgetLegend"])}
              rightLabel={insMetric.label}
            />
            {trendInsight !== null && (
              <p className="mt-3 text-sm text-slate-600">
                {i18n._({
                  ...m["context.insight"],
                  values: {
                    budgetChange: formatSignedPercent(
                      trendInsight.budgetChangePercent
                    ),
                    insChange: formatSignedPercent(
                      trendInsight.insChangePercent
                    ),
                    insLabel: insMetric.label,
                  },
                })}
              </p>
            )}
          </div>
        )}
        {(budgetTrendQuery.isPending || insMetricQuery.isPending) && (
          <SkeletonCard className="h-80" />
        )}
        {(budgetTrendQuery.isError || insMetricQuery.isError) && (
          <SectionError
            onRetry={() => {
              if (budgetTrendQuery.isError) void budgetTrendQuery.refetch();
              if (insMetricQuery.isError) void insMetricQuery.refetch();
            }}
          />
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">
              {i18n._(m["investments.title"])}
            </h2>
            <p className="text-sm text-slate-500">
              {i18n._(m["investments.description"])}
            </p>
          </div>
          <div className="flex gap-2">
            <SourceBadge source="source.demo" />
          </div>
        </div>
        {investments != null && investments.counties.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <InvestmentCartogram
              counties={investments.counties}
              total={investments.total}
            />
            {investments.estimated && (
              <p className="mt-2 text-xs text-slate-400">
                {i18n._(m["investments.estimatedNote"])}
              </p>
            )}
            <div className="mt-3 flex items-center justify-end gap-2 text-xs text-slate-500">
              <span>{i18n._(m["investments.legendMin"])}</span>
              <span
                aria-hidden="true"
                className="inline-block h-3 w-24 rounded-full"
                style={{
                  background:
                    "linear-gradient(to right, #dbeafe, #bfdbfe, #93c5fd, #60a5fa, #2563eb)",
                }}
              />
              <span>{i18n._(m["investments.legendMax"])}</span>
            </div>
          </div>
        )}
        {investmentsQuery.isPending && <SkeletonCard className="h-96" />}
        <QueryError query={investmentsQuery} />
      </section>

      {selectedDestination !== null && year !== null && (
        <DrilldownModal
          destination={selectedDestination}
          year={String(year)}
          onClose={closeDrilldown}
          onBackToOverview={closeDrilldown}
        />
      )}
    </div>
  );
}

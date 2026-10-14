import { useLingui } from "@lingui/react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  fetchCurrentAccount,
  fetchDebt,
  fetchDeficit,
  fetchDemographics,
  fetchEmployment,
  fetchFx,
  fetchGdpGrowth,
  fetchGdpPerCapita,
  fetchGdpRegions,
  fetchInflation,
  fetchPensionTrend,
  fetchRates,
  fetchTrade,
  fetchUnemployment,
} from "../api/client";
import { CurrentAccountBars } from "../components/charts/CurrentAccountBars";
import { GdpGrowthBars } from "../components/charts/GdpGrowthBars";
import { GdpPerCapitaChart } from "../components/charts/GdpPerCapitaChart";
import { MacroTrendChart } from "../components/charts/MacroTrendChart";
import { PensionAgeChart } from "../components/charts/PensionAgeChart";
import { RegionGdpBar } from "../components/charts/RegionGdpBar";
import { TradeBalanceChart } from "../components/charts/TradeBalanceChart";
import { KpiCard } from "../components/shared/KpiCard";
import { SkeletonCard } from "../components/shared/SkeletonCard";
import { SourceBadge } from "../components/shared/SourceBadge";
import { formatPercent, formatSignedPercent } from "../lib/format";
import { joinPensionAge, toBalanceMld } from "../lib/macro";
import { QueryError, SectionError } from "../components/shared/SectionError";
import { m } from "../messages";

const PENSION_YEARS_START = 2020;

export function Economie() {
  const { i18n } = useLingui();

  const inflationQuery = useQuery({
    queryKey: ["macro-inflation"],
    queryFn: fetchInflation,
  });
  const { data: inflation, isPending: inflationPending } = inflationQuery;

  const unemploymentQuery = useQuery({
    queryKey: ["macro-unemployment"],
    queryFn: fetchUnemployment,
  });
  const { data: unemployment, isPending: unemploymentPending } =
    unemploymentQuery;

  const fxQuery = useQuery({
    queryKey: ["macro-fx"],
    queryFn: fetchFx,
  });
  const { data: fx, isPending: fxPending } = fxQuery;

  const gdpGrowthQuery = useQuery({
    queryKey: ["macro-gdp-growth"],
    queryFn: fetchGdpGrowth,
  });
  const { data: gdpGrowth, isPending: gdpGrowthPending } = gdpGrowthQuery;

  const gdpPerCapitaQuery = useQuery({
    queryKey: ["macro-gdp-per-capita"],
    queryFn: fetchGdpPerCapita,
  });
  const { data: gdpPerCapita, isPending: gdpPerCapitaPending } =
    gdpPerCapitaQuery;

  const gdpRegionsQuery = useQuery({
    queryKey: ["macro-gdp-regions"],
    queryFn: fetchGdpRegions,
  });
  const { data: gdpRegions, isPending: gdpRegionsPending } = gdpRegionsQuery;

  const debtQuery = useQuery({
    queryKey: ["macro-debt"],
    queryFn: fetchDebt,
  });
  const { data: debt, isPending: debtPending } = debtQuery;

  const tradeQuery = useQuery({
    queryKey: ["macro-trade"],
    queryFn: fetchTrade,
  });
  const { data: trade, isPending: tradePending } = tradeQuery;

  const demographicsQuery = useQuery({
    queryKey: ["macro-demographics"],
    queryFn: fetchDemographics,
  });
  const { data: demographics, isPending: demographicsPending } =
    demographicsQuery;

  const deficitQuery = useQuery({
    queryKey: ["macro-deficit"],
    queryFn: fetchDeficit,
  });
  const { data: deficit, isPending: deficitPending } = deficitQuery;

  const employmentQuery = useQuery({
    queryKey: ["macro-employment"],
    queryFn: fetchEmployment,
  });
  const { data: employment, isPending: employmentPending } = employmentQuery;

  const currentAccountQuery = useQuery({
    queryKey: ["macro-current-account"],
    queryFn: fetchCurrentAccount,
  });
  const { data: currentAccount, isPending: currentAccountPending } =
    currentAccountQuery;

  const ratesQuery = useQuery({
    queryKey: ["macro-rates"],
    queryFn: fetchRates,
  });
  const { data: rates, isPending: ratesPending } = ratesQuery;

  const currentYear = new Date().getFullYear();
  const pensionYears = useMemo(() => {
    const years: number[] = [];
    for (let year = PENSION_YEARS_START; year <= currentYear; year += 1) {
      years.push(year);
    }
    return years;
  }, [currentYear]);

  const pensionTrendQuery = useQuery({
    queryKey: ["pension-trend", currentYear],
    queryFn: () => fetchPensionTrend(pensionYears),
  });
  const { data: pensionTrend, isPending: pensionPending } = pensionTrendQuery;

  const latestInflation = inflation?.monthly.at(-1);
  const latestUnemployment = unemployment?.monthly.at(-1);
  const latestFx = fx?.series.at(-1);
  const latestGrowth = gdpGrowth?.quarterly.at(-1);
  const latestPerCapita = gdpPerCapita?.yearly.at(-1);
  const latestDebt = debt?.yearly.at(-1);
  const latestTrade = trade?.yearly.at(-1);
  const latestDeficit = deficit?.quarterly.at(-1);
  const latestEmployment = employment?.quarterly.at(-1);
  const latestCurrentAccount = currentAccount?.quarterly.at(-1);
  const latestRate = rates?.ecb.at(-1);

  const inflationData =
    inflation?.monthly.map((point) => ({
      label: point.ym,
      value: point.annualRate,
    })) ?? [];
  const unemploymentData =
    unemployment?.monthly.map((point) => ({
      label: point.ym,
      value: point.rate,
    })) ?? [];
  const fxData =
    fx?.series
      .slice(-730)
      .map((point) => ({ label: point.date, value: point.eurRon })) ?? [];
  const debtData =
    debt?.yearly.map((point) => ({
      label: point.year,
      value: point.percentGdp,
    })) ?? [];
  const deficitData =
    deficit?.quarterly.map((point) => ({
      label: point.quarter,
      value: point.percentGdp,
    })) ?? [];
  const employmentData =
    employment?.quarterly.map((point) => ({
      label: point.quarter,
      value: point.rate,
    })) ?? [];
  const currentAccountData = toBalanceMld(currentAccount?.quarterly ?? []);
  const ratesData =
    rates?.ecb.map((point) => ({
      label: point.date,
      value: point.depositRate,
    })) ?? [];

  const pensionAgeData = useMemo(
    () => joinPensionAge(pensionTrend ?? [], demographics?.yearly ?? []),
    [pensionTrend, demographics]
  );

  const unavailable =
    inflation === null &&
    unemployment === null &&
    fx === null &&
    gdpGrowth === null &&
    gdpPerCapita === null &&
    debt === null &&
    trade === null &&
    demographics === null &&
    deficit === null &&
    employment === null &&
    currentAccount === null &&
    rates === null;

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{i18n._(m["economy.title"])}</h2>
            <p className="text-sm text-slate-500">
              {i18n._(m["economy.description"])}
            </p>
          </div>
          <div className="flex gap-2">
            <SourceBadge source="source.eurostat" />
            <SourceBadge source="source.ecb" />
            <SourceBadge source="source.bnr" />
            <SourceBadge source="source.budget" />
          </div>
        </div>

        {inflation !== null &&
          inflation !== undefined &&
          inflation.sourceUpdated.length > 0 && (
            <p className="text-xs text-slate-400">
              {i18n._({
                ...m["source.updatedAt"],
                values: { date: inflation.sourceUpdated },
              })}
            </p>
          )}

        {(inflationPending || unemploymentPending || fxPending) && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((index) => (
              <SkeletonCard key={index} className="h-28" />
            ))}
          </div>
        )}

        {latestInflation !== undefined &&
          latestUnemployment !== undefined &&
          latestFx !== undefined && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard
                accent="red"
                label={i18n._(m["economy.kpi.inflation"])}
                value={formatPercent(latestInflation.annualRate)}
                sub={latestInflation.ym}
              />
              <KpiCard
                accent="amber"
                label={i18n._(m["economy.kpi.target"])}
                value={formatPercent(inflation?.targetPercent ?? 0)}
                sub={i18n._(m["economy.inflation.targetLine"])}
              />
              <KpiCard
                accent="slate"
                label={i18n._(m["economy.kpi.unemployment"])}
                value={formatPercent(latestUnemployment.rate)}
                sub={latestUnemployment.ym}
              />
              <KpiCard
                accent="blue"
                label={i18n._(m["economy.kpi.fx"])}
                value={`${latestFx.eurRon.toFixed(4)} ${i18n._(m["economy.lei"])}`}
                sub={latestFx.date}
              />
            </div>
          )}

        {(gdpGrowthPending ||
          gdpPerCapitaPending ||
          debtPending ||
          tradePending ||
          deficitPending ||
          employmentPending ||
          currentAccountPending ||
          ratesPending) && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((index) => (
              <SkeletonCard key={index} className="h-28" />
            ))}
          </div>
        )}

        {latestGrowth !== undefined &&
          latestPerCapita !== undefined &&
          latestDebt !== undefined &&
          latestTrade !== undefined &&
          latestDeficit !== undefined &&
          latestEmployment !== undefined &&
          latestCurrentAccount !== undefined &&
          latestRate !== undefined && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard
                accent="blue"
                label={i18n._(m["economy.kpi.gdpGrowth"])}
                value={formatSignedPercent(latestGrowth.pctChange)}
                sub={latestGrowth.quarter}
              />
              <KpiCard
                accent="slate"
                label={i18n._(m["economy.kpi.gdpPerCapita"])}
                value={`${latestPerCapita.eu27Index.toFixed(0)}%`}
                sub={`${i18n._(m["economy.kpi.eu27"])} · ${latestPerCapita.year}`}
              />
              <KpiCard
                accent="red"
                label={i18n._(m["economy.kpi.debt"])}
                value={formatPercent(latestDebt.percentGdp)}
                sub={`${i18n._(m["economy.percentGdp"])} · ${latestDebt.year}`}
              />
              <KpiCard
                accent="amber"
                label={i18n._(m["economy.kpi.trade"])}
                value={formatSignedPercent(latestTrade.balancePctGdp)}
                sub={`${i18n._(m["economy.percentGdp"])} · ${latestTrade.year}`}
              />
              <KpiCard
                accent="red"
                label={i18n._(m["economy.kpi.deficit"])}
                value={formatSignedPercent(latestDeficit.percentGdp)}
                sub={`${i18n._(m["economy.percentGdp"])} · ${latestDeficit.quarter}`}
              />
              <KpiCard
                accent="blue"
                label={i18n._(m["economy.kpi.employment"])}
                value={formatPercent(latestEmployment.rate)}
                sub={latestEmployment.quarter}
              />
              <KpiCard
                accent="amber"
                label={i18n._(m["economy.kpi.currentAccount"])}
                value={`${latestCurrentAccount.balanceMioEur >= 0 ? "+" : "−"}${(
                  Math.abs(latestCurrentAccount.balanceMioEur) / 1000
                ).toFixed(1)} ${i18n._(m["economy.mldEur"])}`}
                sub={latestCurrentAccount.quarter}
              />
              <KpiCard
                accent="slate"
                label={i18n._(m["economy.kpi.rates"])}
                value={formatPercent(latestRate.depositRate)}
                sub={latestRate.date}
              />
            </div>
          )}

        {unavailable && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {i18n._(m["soe.unavailable"])}
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {inflation !== null && inflation !== undefined && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                {i18n._(m["economy.inflation.title"])}
              </h2>
              <p className="text-sm text-slate-500">
                {i18n._(m["economy.inflation.description"])}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <MacroTrendChart
                data={inflationData}
                color="#dc2626"
                ariaLabel={i18n._(m["economy.inflation.title"])}
                valueFormatter={(value) => `${value.toFixed(1)}%`}
                reference={{
                  value: inflation.targetPercent,
                  label: i18n._(m["economy.inflation.targetLine"]),
                }}
              />
            </div>
          </section>
        )}
        <QueryError
          query={inflationQuery}
          title={i18n._(m["economy.inflation.title"])}
        />

        {unemployment !== null && unemployment !== undefined && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                {i18n._(m["economy.unemployment.title"])}
              </h2>
              <p className="text-sm text-slate-500">
                {i18n._(m["economy.unemployment.description"])}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <MacroTrendChart
                data={unemploymentData}
                color="#475569"
                ariaLabel={i18n._(m["economy.unemployment.title"])}
                valueFormatter={(value) => `${value.toFixed(1)}%`}
              />
            </div>
          </section>
        )}
        <QueryError
          query={unemploymentQuery}
          title={i18n._(m["economy.unemployment.title"])}
        />

        {fx !== null && fx !== undefined && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                {i18n._(m["economy.fx.title"])}
              </h2>
              <p className="text-sm text-slate-500">
                {i18n._(m["economy.fx.description"])}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <MacroTrendChart
                data={fxData}
                color="#2563eb"
                ariaLabel={i18n._(m["economy.fx.title"])}
                valueFormatter={(value) => value.toFixed(2)}
              />
            </div>
          </section>
        )}
        <QueryError query={fxQuery} title={i18n._(m["economy.fx.title"])} />

        {gdpGrowth !== null && gdpGrowth !== undefined && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                {i18n._(m["economy.growth.title"])}
              </h2>
              <p className="text-sm text-slate-500">
                {i18n._(m["economy.growth.description"])}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <GdpGrowthBars
                data={gdpGrowth.quarterly}
                ariaLabel={i18n._(m["economy.growth.title"])}
              />
            </div>
          </section>
        )}
        <QueryError
          query={gdpGrowthQuery}
          title={i18n._(m["economy.growth.title"])}
        />

        {gdpPerCapita !== null && gdpPerCapita !== undefined && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                {i18n._(m["economy.gdpPerCapita.title"])}
              </h2>
              <p className="text-sm text-slate-500">
                {i18n._(m["economy.gdpPerCapita.description"])}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <GdpPerCapitaChart
                data={gdpPerCapita.yearly}
                ppsLabel={i18n._(m["economy.gdpPerCapita.ppsLegend"])}
                indexLabel={i18n._(m["economy.gdpPerCapita.indexLegend"])}
                ariaLabel={i18n._(m["economy.gdpPerCapita.title"])}
              />
            </div>
          </section>
        )}
        <QueryError
          query={gdpPerCapitaQuery}
          title={i18n._(m["economy.gdpPerCapita.title"])}
        />

        {gdpRegions !== null && gdpRegions !== undefined && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                {i18n._(m["economy.gdpRegions.title"])}
              </h2>
              <p className="text-sm text-slate-500">
                {i18n._(m["economy.gdpRegions.description"])}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <RegionGdpBar
                data={gdpRegions.regions}
                ariaLabel={i18n._(m["economy.gdpRegions.title"])}
              />
            </div>
          </section>
        )}
        <QueryError
          query={gdpRegionsQuery}
          title={i18n._(m["economy.gdpRegions.title"])}
        />
        {gdpRegionsPending && <SkeletonCard className="h-80" />}

        {debt !== null && debt !== undefined && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                {i18n._(m["economy.debt.title"])}
              </h2>
              <p className="text-sm text-slate-500">
                {i18n._(m["economy.debt.description"])}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <MacroTrendChart
                data={debtData}
                color="#7c3aed"
                ariaLabel={i18n._(m["economy.debt.title"])}
                valueFormatter={(value) => `${value.toFixed(1)}%`}
                reference={{
                  value: 60,
                  label: i18n._(m["economy.debt.maastricht"]),
                }}
              />
            </div>
          </section>
        )}
        <QueryError query={debtQuery} title={i18n._(m["economy.debt.title"])} />

        {trade !== null && trade !== undefined && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                {i18n._(m["economy.trade.title"])}
              </h2>
              <p className="text-sm text-slate-500">
                {i18n._(m["economy.trade.description"])}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <TradeBalanceChart
                data={trade.yearly}
                exportsLabel={i18n._(m["economy.trade.exports"])}
                importsLabel={i18n._(m["economy.trade.imports"])}
                balanceLabel={i18n._(m["economy.trade.balance"])}
                ariaLabel={i18n._(m["economy.trade.title"])}
              />
            </div>
          </section>
        )}
        <QueryError
          query={tradeQuery}
          title={i18n._(m["economy.trade.title"])}
        />

        {deficit !== null && deficit !== undefined && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                {i18n._(m["economy.deficit.title"])}
              </h2>
              <p className="text-sm text-slate-500">
                {i18n._(m["economy.deficit.description"])}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <MacroTrendChart
                data={deficitData}
                color="#dc2626"
                ariaLabel={i18n._(m["economy.deficit.title"])}
                valueFormatter={(value) => `${value.toFixed(1)}%`}
                reference={{
                  value: -3,
                  label: i18n._(m["economy.deficit.maastricht"]),
                }}
              />
            </div>
          </section>
        )}
        <QueryError
          query={deficitQuery}
          title={i18n._(m["economy.deficit.title"])}
        />

        {employment !== null && employment !== undefined && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                {i18n._(m["economy.employment.title"])}
              </h2>
              <p className="text-sm text-slate-500">
                {i18n._(m["economy.employment.description"])}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <MacroTrendChart
                data={employmentData}
                color="#0ea5e9"
                ariaLabel={i18n._(m["economy.employment.title"])}
                valueFormatter={(value) => `${value.toFixed(1)}%`}
              />
            </div>
          </section>
        )}
        <QueryError
          query={employmentQuery}
          title={i18n._(m["economy.employment.title"])}
        />

        {currentAccount !== null && currentAccount !== undefined && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                {i18n._(m["economy.currentAccount.title"])}
              </h2>
              <p className="text-sm text-slate-500">
                {i18n._(m["economy.currentAccount.description"])}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <CurrentAccountBars
                data={currentAccountData}
                ariaLabel={i18n._(m["economy.currentAccount.title"])}
              />
            </div>
          </section>
        )}
        <QueryError
          query={currentAccountQuery}
          title={i18n._(m["economy.currentAccount.title"])}
        />

        {rates !== null && rates !== undefined && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                {i18n._(m["economy.rates.title"])}
              </h2>
              <p className="text-sm text-slate-500">
                {i18n._(m["economy.rates.description"])}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <MacroTrendChart
                data={ratesData}
                color="#7c3aed"
                ariaLabel={i18n._(m["economy.rates.title"])}
                valueFormatter={(value) => `${value.toFixed(2)}%`}
              />
            </div>
          </section>
        )}
        <QueryError
          query={ratesQuery}
          title={i18n._(m["economy.rates.title"])}
        />
      </div>

      {!pensionPending &&
        !demographicsPending &&
        pensionTrend !== undefined &&
        demographics !== null &&
        demographics !== undefined && (
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">
                {i18n._(m["economy.pensions.title"])}
              </h2>
              <p className="text-sm text-slate-500">
                {i18n._(m["economy.pensions.description"])}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <PensionAgeChart
                data={pensionAgeData}
                pensionsLabel={i18n._(m["economy.pensions.pensionsLegend"])}
                dependencyLabel={i18n._(m["economy.pensions.dependencyLegend"])}
                ariaLabel={i18n._(m["economy.pensions.title"])}
              />
            </div>
          </section>
        )}

      {(pensionPending || demographicsPending) && (
        <SkeletonCard className="h-96" />
      )}
      {(pensionTrendQuery.isError || demographicsQuery.isError) && (
        <SectionError
          title={i18n._(m["economy.pensions.title"])}
          onRetry={() => {
            if (pensionTrendQuery.isError) void pensionTrendQuery.refetch();
            if (demographicsQuery.isError) void demographicsQuery.refetch();
          }}
        />
      )}
    </div>
  );
}

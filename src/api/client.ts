import { Decimal } from "decimal.js";
import { z } from "zod";
import { useDataModeStore } from "../store/useDataModeStore";
import {
  BUDGET_DESTINATIONS,
  BUDGET_SUMMARY,
  HEALTH_BUDGET_TREND,
  type BudgetDestination,
  type YearAmount,
} from "../data/budget2026";
import { INS_METRICS_SEED, type InsMetric } from "../data/insStats";
import { calculateSalaryBreakdown, type SalaryBreakdown } from "../lib/salary";

/**
 * Typed API client.
 * P2: calls the BFF (romania-budget-dashboard-bff); falls back to local demo
 * data when the BFF is unreachable, so the demo always renders.
 * Monetary amounts cross this boundary as STRINGS, per the no-floats rule.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";
const REQUEST_TIMEOUT_MS = 2500;

async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  timeoutMs: number = REQUEST_TIMEOUT_MS
): Promise<T | null> {
  if (import.meta.env.VITE_DATA_MODE === "static") {
    useDataModeStore.getState().reportRequest(false);
    return null;
  }
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const result = schema.parse(await response.json());
    useDataModeStore.getState().reportRequest(true);
    return result;
  } catch (error) {
    console.warn(`[api] BFF unreachable for ${path}, using local data`, error);
    useDataModeStore.getState().reportRequest(false);
    return null;
  }
}

export const budgetSummarySchema = z.object({
  year: z.number().int(),
  revenue: z.string(),
  expenditure: z.string(),
  deficit: z.string(),
  deficitPercentGdp: z.string(),
});

export type BudgetSummary = z.infer<typeof budgetSummarySchema>;

export const budgetSubDestinationSchema = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.string(),
});

export const budgetDestinationSchema = budgetSubDestinationSchema.extend({
  percentOfTotal: z.string(),
  subDestinations: z.array(budgetSubDestinationSchema).optional(),
});

const salaryResponseSchema = z.object({
  gross: z.string(),
  cas: z.string(),
  cass: z.string(),
  incomeTax: z.string(),
  employerContribution: z.string(),
  estimatedVat: z.string(),
  net: z.string(),
  employerCost: z.string(),
  stateShare: z.string(),
  statePercent: z.string(),
  entries: z.array(
    z.object({
      labelKey: z.string(),
      amount: z.string(),
    })
  ),
});

type SalaryResponse = z.infer<typeof salaryResponseSchema>;

function toSalaryBreakdown(response: SalaryResponse): SalaryBreakdown {
  return {
    gross: new Decimal(response.gross),
    cas: new Decimal(response.cas),
    cass: new Decimal(response.cass),
    incomeTax: new Decimal(response.incomeTax),
    employerContribution: new Decimal(response.employerContribution),
    estimatedVat: new Decimal(response.estimatedVat),
    net: new Decimal(response.net),
    employerCost: new Decimal(response.employerCost),
    stateShare: new Decimal(response.stateShare),
    statePercent: new Decimal(response.statePercent),
    entries: response.entries.map((entry) => ({
      labelKey: entry.labelKey,
      amount: new Decimal(entry.amount),
    })),
  };
}

export async function fetchBudgetSummary(year: string): Promise<BudgetSummary> {
  const remote = await request(
    `/api/budget/summary?year=${encodeURIComponent(year)}`,
    budgetSummarySchema
  );
  if (remote !== null) {
    return remote;
  }
  return budgetSummarySchema.parse(BUDGET_SUMMARY);
}

export async function fetchDestinations(
  year: string
): Promise<BudgetDestination[]> {
  const remote = await request(
    `/api/budget/destinations?year=${encodeURIComponent(year)}`,
    z.array(budgetDestinationSchema)
  );
  if (remote !== null) {
    return remote;
  }
  return z.array(budgetDestinationSchema).parse(BUDGET_DESTINATIONS);
}

export const institutionsResponseSchema = z.object({
  category: z.string(),
  total: z.string(),
  institutions: z.array(budgetSubDestinationSchema),
});

export type InstitutionsResponse = z.infer<typeof institutionsResponseSchema>;

export async function fetchInstitutions(
  year: string,
  category: string
): Promise<InstitutionsResponse> {
  const remote = await request(
    `/api/budget/institutions?category=${category}&year=${encodeURIComponent(year)}`,
    institutionsResponseSchema
  );
  if (remote !== null) {
    return remote;
  }
  const destination = BUDGET_DESTINATIONS.find(
    (entry) => entry.id === category
  );
  return {
    category,
    total: destination?.amount ?? "0",
    institutions: destination?.subDestinations ?? [],
  };
}

export const budgetYearsSchema = z.object({
  years: z.array(z.number().int()),
});

export type BudgetYears = z.infer<typeof budgetYearsSchema>;

export const FIRST_LOCAL_YEAR = 2020;

export function localBudgetYears(): number[] {
  const current = new Date().getFullYear();
  const years: number[] = [];
  for (let year = FIRST_LOCAL_YEAR; year <= current; year += 1) {
    years.push(year);
  }
  return years;
}

export async function fetchBudgetYears(): Promise<number[]> {
  const remote = await request("/api/budget/years", budgetYearsSchema);
  if (remote !== null) {
    return remote.years;
  }
  return localBudgetYears();
}

export const countyInvestmentSchema = z.object({
  county: z.string(),
  region: z.string(),
  amount: z.string(),
});

const investmentsByCountySchema = z.object({
  year: z.number().int(),
  total: z.string(),
  counties: z.array(countyInvestmentSchema),
  estimated: z.boolean(),
  note: z.string(),
});

export type InvestmentsByCounty = z.infer<typeof investmentsByCountySchema>;
export type CountyInvestment = z.infer<typeof countyInvestmentSchema>;

export async function fetchCountyInvestments(): Promise<InvestmentsByCounty | null> {
  return request("/api/investments/by-county", investmentsByCountySchema);
}

export async function fetchSalaryBreakdown(
  gross: number
): Promise<SalaryBreakdown | null> {
  const remote = await request(
    `/api/salary/calculate?gross=${gross}`,
    salaryResponseSchema
  );
  if (remote !== null) {
    return toSalaryBreakdown(remote);
  }
  return calculateSalaryBreakdown(gross);
}

export const realWageSeriesSchema = z.object({
  series: z.array(
    z.object({
      quarter: z.string(),
      nominalEur: z.number(),
      realEur: z.number(),
    })
  ),
  estimated: z.boolean(),
  note: z.string(),
  sourceUpdated: z.string(),
});

export type RealWageSeries = z.infer<typeof realWageSeriesSchema>;

export async function fetchRealWage(): Promise<RealWageSeries | null> {
  return request("/api/wages/real", realWageSeriesSchema);
}

export const insMetricSchema = z.object({
  code: z.string(),
  unit: z.string(),
  label: z.string(),
  data: z.array(
    z.object({
      year: z.number().int(),
      value: z.number(),
    })
  ),
});

export async function fetchInsMetric(code: string): Promise<InsMetric> {
  const remote = await request(
    `/api/ins/metrics?code=${code}`,
    insMetricSchema
  );
  if (remote !== null) {
    return remote;
  }
  return INS_METRICS_SEED[code] ?? { code, unit: "", label: code, data: [] };
}

export const insCatalogSchema = z.object({
  metrics: z.array(
    z.object({
      code: z.string(),
      label: z.string(),
      unit: z.string(),
    })
  ),
});

export type InsCatalogEntry = z.infer<
  typeof insCatalogSchema
>["metrics"][number];

export async function fetchInsCatalog(): Promise<InsCatalogEntry[]> {
  const remote = await request("/api/ins/catalog", insCatalogSchema);
  if (remote !== null) {
    return remote.metrics;
  }
  return Object.values(INS_METRICS_SEED).map(({ code, label, unit }) => ({
    code,
    label,
    unit,
  }));
}

export interface BudgetTrend {
  metric: string;
  source: string;
  sourceUpdated: string;
  data: YearAmount[];
}

const budgetTrendSchema = z.object({
  metric: z.string(),
  source: z.string(),
  sourceUpdated: z.string(),
  data: z.array(
    z.object({
      year: z.number().int(),
      amount: z.string(),
    })
  ),
});

export async function fetchBudgetTrend(metric: string): Promise<BudgetTrend> {
  const remote = await request(
    `/api/context/trends?metric=${metric}`,
    budgetTrendSchema
  );
  if (remote !== null) {
    return remote;
  }
  return {
    metric,
    source: "seed demo",
    sourceUpdated: "",
    data: HEALTH_BUDGET_TREND,
  };
}

// ── Buget adoptat vs. execuție (MFP via data.gov.ro, prin BFF) ────────

/**
 * The comparison joins adopted totals (CKAN anexa XML, cold-cache latency)
 * with per-year execution summaries — allow a generous timeout.
 */
const COMPARISON_TIMEOUT_MS = 30000;

export const budgetComparisonSchema = z.object({
  points: z.array(
    z.object({
      year: z.number().int(),
      adopted: z.object({
        revenue: z.string(),
        expenditure: z.string(),
        deficit: z.string(),
      }),
      executed: z
        .object({
          revenue: z.string(),
          expenditure: z.string(),
          deficit: z.string(),
          deficitPercentGdp: z.string(),
        })
        .nullable(),
      deficitDelta: z.string().nullable(),
      note: z.string(),
    })
  ),
});

export type BudgetComparison = z.infer<typeof budgetComparisonSchema>;
export type BudgetComparisonPoint = BudgetComparison["points"][number];

export async function fetchBudgetComparison(): Promise<BudgetComparison | null> {
  return request(
    "/api/budget/comparison",
    budgetComparisonSchema,
    COMPARISON_TIMEOUT_MS
  );
}

// ── Companii de stat (companiidestat.ro via BFF) ──────────────────────

const soeTopEntrySchema = z.object({
  cui: z.string(),
  name: z.string(),
  marginPercent: z.number(),
});

const soeTopEmployerSchema = z.object({
  cui: z.string(),
  name: z.string(),
  employees: z.number().int(),
  revenue: z.string(),
});

const soePayScaleRowSchema = z.object({
  kind: z.string(),
  label: z.string(),
  value: z.number(),
  unit: z.string(),
});

export const soeSummarySchema = z.object({
  stats: z.object({
    year: z.number().int(),
    updatedAt: z.string(),
    totalCompanies: z.number().int(),
    companiesWithData: z.number().int(),
    central: z.number().int(),
    local: z.number().int(),
    revenue: z.string(),
    profit: z.string(),
    losses: z.string(),
    companiesOnLoss: z.number().int(),
  }),
  payScale: z.array(soePayScaleRowSchema),
  topProfit: z.array(soeTopEntrySchema),
  topLoss: z.array(soeTopEntrySchema),
  topEmployers: z.array(soeTopEmployerSchema),
  emblematice: z.array(
    z.object({
      cui: z.string(),
      name: z.string(),
      label: z.string(),
      status: z.string(),
      marginPercent: z.number(),
      maxSalary: z.string(),
      subsidy2025MiiLei: z.string().nullable(),
    })
  ),
});

export type SoeSummary = z.infer<typeof soeSummarySchema>;

export const soeSectorTrendSchema = z.object({
  sectors: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      series: z.array(
        z.object({
          year: z.number().int(),
          total: z.number().int(),
          onLoss: z.number().int(),
          lossPercent: z.number(),
        })
      ),
    })
  ),
  sourceNote: z.string(),
});

export type SoeSectorTrend = z.infer<typeof soeSectorTrendSchema>;

export const soeByCountySchema = z.object({
  year: z.number().int(),
  counties: z.array(
    z.object({
      code: z.number(),
      name: z.string(),
      companies: z.number().int(),
      onLoss: z.number().int(),
      lossPercent: z.number(),
      medianMargin: z.number(),
      revenue: z.string(),
      profit: z.string(),
      losses: z.string(),
    })
  ),
});

export type SoeByCounty = z.infer<typeof soeByCountySchema>;

export const soeScatterSchema = z.object({
  year: z.number().int(),
  points: z.array(
    z.object({
      cui: z.string(),
      name: z.string(),
      marginPercent: z.number(),
      annualCost: z.string(),
      maxSalary: z.string(),
      employees: z.number().int(),
      levier: z.number(),
      roe: z.number(),
    })
  ),
});

export type SoeScatter = z.infer<typeof soeScatterSchema>;

export const soeCompanySchema = z.object({
  cui: z.string(),
  name: z.string(),
  county: z.string(),
  sectorKey: z.string(),
  sectorLabel: z.string(),
  caen: z.string(),
  ticker: z.string().nullable(),
  listed: z.boolean(),
  tier: z.number(),
  status: z.string(),
  status2025: z.string().nullable(),
  financials: z.array(
    z.object({
      year: z.number().int(),
      margin: z.number().nullable(),
      roe: z.number().nullable(),
      levier: z.number().nullable(),
      status: z.string(),
    })
  ),
  salaries: z.object({
    maxSalary: z.string(),
    annualCost: z.string(),
    people: z.number().int(),
  }),
  mfin: z.object({
    ca: z.string(),
    profit: z.string(),
    loss: z.string(),
    employees: z.number().int(),
    capitaluri: z.string(),
  }),
  subsidy2025MiiLei: z.string().nullable(),
  subsidy2025Source: z.string().nullable(),
});

export type SoeCompany = z.infer<typeof soeCompanySchema>;

export const soeSubsidiesSchema = z.object({
  year: z.number().int(),
  total: z.string(),
  uats: z.number().int(),
  counties: z.array(
    z.object({
      name: z.string(),
      total: z.string(),
      tr: z.string(),
      te: z.string(),
      uats: z.number().int(),
    })
  ),
  operators: z.array(
    z.object({
      cui: z.string(),
      name: z.string(),
      uat: z.string(),
      sector: z.string(),
      subsidy: z.string(),
      revenue: z.string(),
      profit: z.string(),
      loss: z.string(),
    })
  ),
});

export type SoeSubsidies = z.infer<typeof soeSubsidiesSchema>;

export const soeListedSchema = z.object({
  companies: z.array(
    z.object({
      ticker: z.string(),
      name: z.string(),
      listedYear: z.number().int(),
      statePercent: z.number(),
      ministry: z.string(),
      yearlyProfit: z.array(
        z.object({ year: z.number().int(), profitMldLei: z.number() })
      ),
      monthlyPrice: z.array(z.object({ ym: z.string(), priceLei: z.number() })),
    })
  ),
});

export type SoeListed = z.infer<typeof soeListedSchema>;

export async function fetchSoeSummary(): Promise<SoeSummary | null> {
  return request("/api/soe/summary", soeSummarySchema);
}

export async function fetchSoeSectorTrend(): Promise<SoeSectorTrend | null> {
  return request("/api/soe/sector-trend", soeSectorTrendSchema);
}

export async function fetchSoeByCounty(): Promise<SoeByCounty | null> {
  return request("/api/soe/by-county", soeByCountySchema);
}

export async function fetchSoeScatter(): Promise<SoeScatter | null> {
  return request("/api/soe/scatter", soeScatterSchema);
}

export async function fetchSoeCompany(cui: string): Promise<SoeCompany | null> {
  return request(`/api/soe/companies/${cui}`, soeCompanySchema);
}

export async function fetchSoeSubsidies(
  year: string
): Promise<SoeSubsidies | null> {
  return request(`/api/soe/subsidies?year=${year}`, soeSubsidiesSchema);
}

export async function fetchSoeListed(): Promise<SoeListed | null> {
  return request("/api/soe/listed", soeListedSchema);
}

// ── Macro (Eurostat + BCE via BFF) ────────────────────────────────────

export const inflationSchema = z.object({
  targetPercent: z.number(),
  monthly: z.array(z.object({ ym: z.string(), annualRate: z.number() })),
  sourceUpdated: z.string(),
});

export type InflationSeries = z.infer<typeof inflationSchema>;

export const unemploymentSchema = z.object({
  monthly: z.array(z.object({ ym: z.string(), rate: z.number() })),
  sourceUpdated: z.string(),
});

export type UnemploymentSeries = z.infer<typeof unemploymentSchema>;

export const fxSchema = z.object({
  series: z.array(z.object({ date: z.string(), eurRon: z.number() })),
  sourceUpdated: z.string(),
});

export type FxSeries = z.infer<typeof fxSchema>;

export async function fetchInflation(): Promise<InflationSeries | null> {
  return request("/api/macro/inflation", inflationSchema);
}

export async function fetchUnemployment(): Promise<UnemploymentSeries | null> {
  return request("/api/macro/unemployment", unemploymentSchema);
}

export async function fetchFx(): Promise<FxSeries | null> {
  return request("/api/macro/fx", fxSchema);
}

export const gdpGrowthSchema = z.object({
  quarterly: z.array(z.object({ quarter: z.string(), pctChange: z.number() })),
  sourceUpdated: z.string(),
});

export type GdpGrowthSeries = z.infer<typeof gdpGrowthSchema>;

export const gdpPerCapitaSchema = z.object({
  yearly: z.array(
    z.object({ year: z.string(), pps: z.number(), eu27Index: z.number() })
  ),
  sourceUpdated: z.string(),
});

export type GdpPerCapitaSeries = z.infer<typeof gdpPerCapitaSchema>;

export const gdpRegionsSchema = z.object({
  year: z.string(),
  regions: z.array(
    z.object({
      code: z.string(),
      label: z.string(),
      indexEu27: z.number(),
    })
  ),
  sourceUpdated: z.string(),
});

export type GdpRegionsSeries = z.infer<typeof gdpRegionsSchema>;

export const debtSchema = z.object({
  yearly: z.array(z.object({ year: z.string(), percentGdp: z.number() })),
  sourceUpdated: z.string(),
});

export type DebtSeries = z.infer<typeof debtSchema>;

export const tradeSchema = z.object({
  yearly: z.array(
    z.object({
      year: z.string(),
      exportsPctGdp: z.number(),
      importsPctGdp: z.number(),
      balancePctGdp: z.number(),
    })
  ),
  sourceUpdated: z.string(),
});

export type TradeSeries = z.infer<typeof tradeSchema>;

export const demographicsSchema = z.object({
  yearly: z.array(z.object({ year: z.string(), oldAgeDependency: z.number() })),
  sourceUpdated: z.string(),
});

export type DemographicSeries = z.infer<typeof demographicsSchema>;

export const deficitSeriesSchema = z.object({
  quarterly: z.array(z.object({ quarter: z.string(), percentGdp: z.number() })),
  sourceUpdated: z.string(),
});

export type DeficitSeries = z.infer<typeof deficitSeriesSchema>;

export const employmentSeriesSchema = z.object({
  quarterly: z.array(z.object({ quarter: z.string(), rate: z.number() })),
  sourceUpdated: z.string(),
});

export type EmploymentSeries = z.infer<typeof employmentSeriesSchema>;

export const currentAccountSeriesSchema = z.object({
  quarterly: z.array(
    z.object({ quarter: z.string(), balanceMioEur: z.number() })
  ),
  sourceUpdated: z.string(),
});

export type CurrentAccountSeries = z.infer<typeof currentAccountSeriesSchema>;

export const ratesSeriesSchema = z.object({
  ecb: z.array(z.object({ date: z.string(), depositRate: z.number() })),
  sourceUpdated: z.string(),
});

export type RatesSeries = z.infer<typeof ratesSeriesSchema>;

export async function fetchGdpGrowth(): Promise<GdpGrowthSeries | null> {
  return request("/api/macro/gdp-growth", gdpGrowthSchema);
}

export async function fetchGdpPerCapita(): Promise<GdpPerCapitaSeries | null> {
  return request("/api/macro/gdp-per-capita", gdpPerCapitaSchema);
}

export async function fetchGdpRegions(): Promise<GdpRegionsSeries | null> {
  return request("/api/macro/gdp-regions", gdpRegionsSchema);
}

export async function fetchDebt(): Promise<DebtSeries | null> {
  return request("/api/macro/debt", debtSchema);
}

export async function fetchTrade(): Promise<TradeSeries | null> {
  return request("/api/macro/trade", tradeSchema);
}

export async function fetchDemographics(): Promise<DemographicSeries | null> {
  return request("/api/macro/demographics", demographicsSchema);
}

export async function fetchDeficit(): Promise<DeficitSeries | null> {
  return request("/api/macro/deficit", deficitSeriesSchema);
}

export async function fetchEmployment(): Promise<EmploymentSeries | null> {
  return request("/api/macro/employment", employmentSeriesSchema);
}

export async function fetchCurrentAccount(): Promise<CurrentAccountSeries | null> {
  return request("/api/macro/current-account", currentAccountSeriesSchema);
}

export async function fetchRates(): Promise<RatesSeries | null> {
  return request("/api/macro/rates", ratesSeriesSchema);
}

// ── Context salarial (Eurostat LCI + SES via BFF) ─────────────────────

export const wageContextSchema = z.object({
  lciQuarterly: z.array(
    z.object({ quarter: z.string(), pctChange: z.number() })
  ),
  sesAnchors: z.array(z.object({ year: z.string(), meanGrossEur: z.number() })),
  note: z.string(),
  sourceUpdated: z.string(),
});

export type WageContext = z.infer<typeof wageContextSchema>;

export async function fetchWageContext(): Promise<WageContext | null> {
  return request("/api/wages/context", wageContextSchema);
}

export const wageMonthlySchema = z.object({
  monthly: z.array(
    z.object({ quarter: z.string(), grossMonthlyEur: z.number() })
  ),
  estimated: z.boolean(),
  note: z.string(),
  sourceUpdated: z.string(),
});

export type WageMonthly = z.infer<typeof wageMonthlySchema>;

export async function fetchWageMonthly(): Promise<WageMonthly | null> {
  return request("/api/wages/monthly", wageMonthlySchema);
}

// ── Societate (populație + cheltuieli sociale, Eurostat via BFF) ───────

export const societyPopulationSchema = z.object({
  yearly: z.array(z.object({ year: z.string(), population: z.number() })),
  sourceUpdated: z.string(),
});

export type SocietyPopulation = z.infer<typeof societyPopulationSchema>;

export const societySpendingSchema = z.object({
  health: z.array(z.object({ year: z.string(), percentGdp: z.number() })),
  education: z.array(z.object({ year: z.string(), percentGdp: z.number() })),
  sourceUpdated: z.string(),
});

export type SocietySpending = z.infer<typeof societySpendingSchema>;

export async function fetchSocietyPopulation(): Promise<SocietyPopulation | null> {
  return request("/api/society/population", societyPopulationSchema);
}

export async function fetchSocietySpending(): Promise<SocietySpending | null> {
  return request("/api/society/spending", societySpendingSchema);
}

export const societyEducationSchema = z.object({
  earlyLeavers: z.array(z.object({ year: z.string(), pct: z.number() })),
  tertiaryAttainment: z.array(z.object({ year: z.string(), pct: z.number() })),
  sourceUpdated: z.string(),
});

export type SocietyEducation = z.infer<typeof societyEducationSchema>;

export const societyHealthSchema = z.object({
  physicians: z.array(z.object({ year: z.string(), count: z.number() })),
  sourceUpdated: z.string(),
});

export type SocietyHealth = z.infer<typeof societyHealthSchema>;

export const societyDemographicsSchema = z.object({
  medianAge: z.array(z.object({ year: z.string(), age: z.number() })),
  netMigration: z.array(z.object({ year: z.string(), per1000: z.number() })),
  sourceUpdated: z.string(),
});

export type SocietyDemographics = z.infer<typeof societyDemographicsSchema>;

export async function fetchSocietyEducation(): Promise<SocietyEducation | null> {
  return request("/api/society/education", societyEducationSchema);
}

export async function fetchSocietyHealth(): Promise<SocietyHealth | null> {
  return request("/api/society/health", societyHealthSchema);
}

export async function fetchSocietyDemographics(): Promise<SocietyDemographics | null> {
  return request("/api/society/demographics", societyDemographicsSchema);
}

// ── Energie (Eurostat via BFF) ─────────────────────────────────────────

export const energyContextSchema = z.object({
  electricity: z.array(z.object({ period: z.string(), eurPerKwh: z.number() })),
  renewables: z.array(z.object({ year: z.string(), pct: z.number() })),
  importDependency: z.array(z.object({ year: z.string(), pct: z.number() })),
  sourceUpdated: z.string(),
});

export type EnergyContext = z.infer<typeof energyContextSchema>;

export async function fetchEnergyContext(): Promise<EnergyContext | null> {
  return request("/api/energy/context", energyContextSchema);
}

// ── Piața muncii (Eurostat via BFF) ────────────────────────────────────

export const labourContextSchema = z.object({
  neet: z.array(z.object({ year: z.string(), pct: z.number() })),
  youthUnemployment: z.array(z.object({ ym: z.string(), rate: z.number() })),
  vacancies: z.array(z.object({ quarter: z.string(), pct: z.number() })),
  sourceUpdated: z.string(),
});

export type LabourContext = z.infer<typeof labourContextSchema>;

export async function fetchLabourContext(): Promise<LabourContext | null> {
  return request("/api/labour/context", labourContextSchema);
}

// ── Justiție (Eurostat via BFF) ────────────────────────────────────────

export const justiceContextSchema = z.object({
  homicides: z.array(z.object({ year: z.string(), count: z.number() })),
  prison: z.array(z.object({ year: z.string(), prisoners: z.number() })),
  police: z.array(z.object({ year: z.string(), officers: z.number() })),
  sourceUpdated: z.string(),
});

export type JusticeContext = z.infer<typeof justiceContextSchema>;

export async function fetchJusticeContext(): Promise<JusticeContext | null> {
  return request("/api/justice/context", justiceContextSchema);
}

export interface PensionYearPoint {
  year: number;
  milliarde: number;
}

/** Functional code of the public-pensions destination (COFOG-style). */
export const PENSION_DESTINATION_ID = "68.03.00";

/**
 * Pensions spending per year, in milliarde lei, taken from the per-year
 * budget destinations. Falls back to the demo seed when the BFF is down.
 */
export async function fetchPensionTrend(
  years: number[]
): Promise<PensionYearPoint[]> {
  const results = await Promise.all(
    years.map(async (year) => {
      const destinations = await fetchDestinations(String(year));
      const pension = destinations.find(
        (destination) =>
          destination.id === PENSION_DESTINATION_ID ||
          destination.id === "pensii"
      );
      if (pension === undefined) {
        return null;
      }
      return {
        year,
        milliarde: new Decimal(pension.amount)
          .div(1e9)
          .toDecimalPlaces(1)
          .toNumber(),
      };
    })
  );
  return results.filter((point): point is PensionYearPoint => point !== null);
}

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Decimal } from "decimal.js";
import {
  fetchBudgetSummary,
  fetchDestinations,
  fetchInstitutions,
  fetchSalaryBreakdown,
  fetchInsMetric,
  fetchInsCatalog,
  fetchCountyInvestments,
  fetchInflation,
} from "../src/api/client";
import { useDataModeStore } from "../src/store/useDataModeStore";
import { BUDGET_SUMMARY } from "../src/data/budget2026";
import fixtures from "./fixtures/api-contract.json";

const summaryPath = "/api/budget/summary?year=2026";
const fetchSpy = vi.fn();
beforeEach(() => {
  vi.stubEnv("VITE_DATA_MODE", "remote");
  vi.stubGlobal("fetch", fetchSpy);
  fetchSpy.mockReset();
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
  useDataModeStore.setState({ mode: "unknown", successes: 0, failures: 0 });
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

const cases: [string, () => Promise<unknown>, unknown][] = [
  [summaryPath, () => fetchBudgetSummary("2026"), fixtures[summaryPath]],
  [
    "/api/budget/destinations?year=2026",
    () => fetchDestinations("2026"),
    fixtures["/api/budget/destinations?year=2026"],
  ],
  [
    "/api/budget/institutions?category=pensii&year=2026",
    () => fetchInstitutions("2026", "pensii"),
    fixtures["/api/budget/institutions?category=pensii&year=2026"],
  ],
  [
    "/api/ins/metrics?code=infant-mortality",
    () => fetchInsMetric("infant-mortality"),
    fixtures["/api/ins/metrics?code=infant-mortality"],
  ],
  ["/api/ins/catalog", fetchInsCatalog, fixtures["/api/ins/catalog"].metrics],
  [
    "/api/investments/by-county",
    fetchCountyInvestments,
    fixtures["/api/investments/by-county"],
  ],
];

describe("BFF wire contract consumed by the real client", () => {
  it.each(cases)("requests and validates %s", async (path, call, expected) => {
    const wire = fixtures[path as keyof typeof fixtures];
    fetchSpy.mockResolvedValue(new Response(JSON.stringify(wire)));
    expect(await call()).toEqual(expected);
    expect(fetchSpy).toHaveBeenCalledExactlyOnceWith(
      `http://localhost:3000${path}`,
      { signal: expect.any(AbortSignal) }
    );
    expect(useDataModeStore.getState()).toMatchObject({
      mode: "live",
      successes: 1,
      failures: 0,
    });
  });

  it("converts serialized salary amounts straight to Decimal", async () => {
    const path = "/api/salary/calculate?gross=9427.13";
    const wire = fixtures[path];
    fetchSpy.mockResolvedValue(new Response(JSON.stringify(wire)));
    const result = await fetchSalaryBreakdown(9427.13);
    expect(fetchSpy).toHaveBeenCalledWith(
      `http://localhost:3000${path}`,
      expect.anything()
    );
    expect(result?.gross).toBeInstanceOf(Decimal);
    expect(result?.gross.toFixed(2)).toBe(wire.gross);
    expect(result?.net.toFixed(2)).toBe(wire.net);
    expect(result?.statePercent.toFixed(4)).toBe(wire.statePercent);
    expect(result?.entries.map((entry) => entry.amount.toFixed(2))).toEqual(
      wire.entries.map((entry) => entry.amount)
    );
  });

  it("preserves decimal strings beyond JavaScript integer precision", async () => {
    const wire = { ...fixtures[summaryPath], revenue: "9007199254740993.01" };
    fetchSpy.mockResolvedValue(new Response(JSON.stringify(wire)));
    expect((await fetchBudgetSummary("2026")).revenue).toBe(wire.revenue);
  });

  it.each([
    [
      "numeric money",
      () =>
        Promise.resolve(
          new Response(
            JSON.stringify({ ...fixtures[summaryPath], revenue: 123 })
          )
        ),
    ],
    ["malformed JSON", () => Promise.resolve(new Response("{"))],
    [
      "HTTP failure",
      () => Promise.resolve(new Response("upstream down", { status: 502 })),
    ],
    ["network failure", () => Promise.reject(new TypeError("Failed to fetch"))],
    [
      "timeout",
      () => Promise.reject(new DOMException("Timed out", "TimeoutError")),
    ],
  ])("falls back once for %s", async (_name, response) => {
    fetchSpy.mockImplementation(response);
    expect(await fetchBudgetSummary("2026")).toEqual(BUDGET_SUMMARY);
    expect(useDataModeStore.getState()).toMatchObject({
      mode: "fallback",
      successes: 0,
      failures: 1,
    });
  });

  it("uses labeled demo data without network in explicit static mode", async () => {
    vi.stubEnv("VITE_DATA_MODE", "static");
    expect(await fetchBudgetSummary("2026")).toEqual(BUDGET_SUMMARY);
    expect(await fetchInflation()).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(useDataModeStore.getState().mode).toBe("fallback");
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ApiError,
  COMPARISON_TIMEOUT_MS,
  REQUEST_TIMEOUT_MS,
  fetchBudgetComparison,
  fetchBudgetSummary,
  fetchDestinations,
  fetchInflation,
  fetchInstitutions,
  fetchPensionTrend,
  isStaticMode,
} from "../src/api/client";
import { useDataModeStore } from "../src/store/useDataModeStore";
import { BUDGET_SUMMARY, BUDGET_YEAR } from "../src/data/budget2026";

const fetchSpy = vi.fn();

beforeEach(() => {
  vi.stubEnv("VITE_DATA_MODE", "remote");
  vi.stubGlobal("fetch", fetchSpy);
  fetchSpy.mockReset();
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
  useDataModeStore.setState({ mode: "unknown", successes: 0, failures: 0 });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

/** A fetch that only settles when its signal aborts. */
function hangingFetch(_url: string, init: RequestInit): Promise<Response> {
  return new Promise((_resolve, reject) => {
    init.signal?.addEventListener("abort", () => {
      reject(init.signal?.reason as Error);
    });
  });
}

describe("remote failures reach the caller", () => {
  it.each([
    [
      "http",
      () => Promise.resolve(new Response("upstream down", { status: 500 })),
    ],
    ["network", () => Promise.reject(new TypeError("Failed to fetch"))],
    ["invalid", () => Promise.resolve(new Response('{"year":"x"}'))],
    ["invalid", () => Promise.resolve(new Response("{"))],
  ])("rejects with an ApiError of kind %s", async (kind, response) => {
    fetchSpy.mockImplementation(response);
    const error = await fetchBudgetSummary("2026").catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ kind });
    expect(useDataModeStore.getState()).toMatchObject({
      mode: "fallback",
      failures: 1,
    });
  });

  it("keeps the HTTP status on the error", async () => {
    fetchSpy.mockResolvedValue(new Response("", { status: 503 }));
    await expect(fetchInflation()).rejects.toMatchObject({
      kind: "http",
      status: 503,
    });
  });

  it("does not substitute the demo seed for a failed request", async () => {
    fetchSpy.mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(fetchDestinations("2026")).rejects.toBeInstanceOf(ApiError);
    await expect(fetchInstitutions("2026", "pensii")).rejects.toBeInstanceOf(
      ApiError
    );
    await expect(fetchPensionTrend([2025, 2026])).rejects.toBeInstanceOf(
      ApiError
    );
  });
});

describe("request timeout", () => {
  it("waits at least 8 seconds before giving up", () => {
    expect(REQUEST_TIMEOUT_MS).toBeGreaterThanOrEqual(8000);
    expect(COMPARISON_TIMEOUT_MS).toBe(30_000);
  });

  it("turns a timeout into an ApiError of kind timeout", async () => {
    vi.useFakeTimers();
    fetchSpy.mockImplementation(hangingFetch);
    const settled = vi.fn();
    const pending = fetchInflation().catch((error: unknown) => {
      settled(error);
    });

    await vi.advanceTimersByTimeAsync(REQUEST_TIMEOUT_MS - 1);
    expect(settled).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    await pending;
    expect(settled).toHaveBeenCalledOnce();
    const error = settled.mock.calls[0]?.[0] as ApiError;
    expect(error).toBeInstanceOf(ApiError);
    expect(error.kind).toBe("timeout");
  });

  it("gives the comparison the longer timeout", async () => {
    vi.useFakeTimers();
    fetchSpy.mockImplementation(hangingFetch);
    const settled = vi.fn();
    const pending = fetchBudgetComparison().catch((error: unknown) => {
      settled(error);
    });

    await vi.advanceTimersByTimeAsync(REQUEST_TIMEOUT_MS);
    expect(settled).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(COMPARISON_TIMEOUT_MS);
    await pending;
    expect(settled.mock.calls[0]?.[0]).toMatchObject({ kind: "timeout" });
  });
});

describe("static mode", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_DATA_MODE", "static");
  });

  it("is reported as static", () => {
    expect(isStaticMode()).toBe(true);
  });

  it("serves the seed for the seed year without network", async () => {
    expect(await fetchBudgetSummary(String(BUDGET_YEAR))).toEqual(
      BUDGET_SUMMARY
    );
    expect(
      (await fetchDestinations(String(BUDGET_YEAR))).length
    ).toBeGreaterThan(0);
    expect(await fetchInflation()).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("returns empty results for any other seed year", async () => {
    expect(await fetchBudgetSummary("2024")).toBeNull();
    expect(await fetchDestinations("2024")).toEqual([]);
    expect(await fetchInstitutions("2024", "pensii")).toMatchObject({
      total: "0",
      institutions: [],
    });
  });

  it("does not repeat the seed across a multi-year trend", async () => {
    const trend = await fetchPensionTrend([2024, 2025, 2026]);
    expect(trend.map((point) => point.year)).toEqual([2026]);
  });
});

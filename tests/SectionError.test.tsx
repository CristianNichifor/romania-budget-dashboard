import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../src/api/client";
import { DemoBadge } from "../src/components/shared/DemoBadge";
import { QueryError } from "../src/components/shared/SectionError";
import { LinguiProvider } from "../src/i18n";

function Section({ queryFn }: { queryFn: () => Promise<string> }) {
  const query = useQuery({ queryKey: ["section"], queryFn });
  return (
    <>
      {query.data !== undefined && <p>{query.data}</p>}
      <QueryError query={query} title="Inflația" />
    </>
  );
}

function renderWithProviders(node: React.ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <LinguiProvider>
      <QueryClientProvider client={client}>{node}</QueryClientProvider>
    </LinguiProvider>
  );
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("QueryError", () => {
  it("shows an error card with retry when the query fails", async () => {
    const queryFn = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new ApiError("http", "/api/x", { status: 500 }))
      .mockResolvedValueOnce("date noi");

    renderWithProviders(<Section queryFn={queryFn} />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Inflația");
    expect(alert).toHaveTextContent("nu au putut fi încărcate");

    fireEvent.click(screen.getByRole("button", { name: /Reîncearcă/ }));

    expect(await screen.findByText("date noi")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(queryFn).toHaveBeenCalledTimes(2);
  });

  it("renders nothing while the query succeeds", async () => {
    renderWithProviders(<Section queryFn={() => Promise.resolve("ok")} />);
    expect(await screen.findByText("ok")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

describe("DemoBadge", () => {
  it("labels bundled data in static mode", () => {
    vi.stubEnv("VITE_DATA_MODE", "static");
    renderWithProviders(<DemoBadge />);
    expect(screen.getByText("date demo")).toBeInTheDocument();
  });

  it("stays hidden when data comes from the BFF", () => {
    vi.stubEnv("VITE_DATA_MODE", "remote");
    renderWithProviders(<DemoBadge />);
    expect(screen.queryByText("date demo")).not.toBeInTheDocument();
  });
});

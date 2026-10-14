import { useRouter, useRouterState } from "@tanstack/react-router";
import {
  CURRENCY_PARAM,
  parseCurrency,
  withCurrency,
  type Currency,
} from "../lib/currency";

/** Display currency, kept in the URL so a link or a tab switch carries it. */
export function useCurrency(): [Currency, (next: Currency) => void] {
  const router = useRouter();
  const location = useRouterState({ select: (state) => state.location });
  const search = location.search as Record<string, unknown>;
  const currency = parseCurrency(search[CURRENCY_PARAM]);
  const setCurrency = (next: Currency) => {
    const query = new URLSearchParams(
      Object.entries(withCurrency(search, next)).map(([key, value]) => [
        key,
        String(value),
      ])
    ).toString();
    void router.navigate({
      href: `${location.pathname}${query.length > 0 ? `?${query}` : ""}${location.hash.length > 0 ? `#${location.hash}` : ""}`,
      replace: true,
    });
  };
  return [currency, setCurrency];
}

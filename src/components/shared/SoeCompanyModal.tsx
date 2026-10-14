import * as Dialog from "@radix-ui/react-dialog";
import { useLingui } from "@lingui/react";
import { useQuery } from "@tanstack/react-query";
import { Decimal } from "decimal.js";
import { useEffect, useRef } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchSoeCompany } from "../../api/client";
import { formatLei, formatNumber } from "../../lib/format";
import { SourceBadge } from "./SourceBadge";
import { m } from "../../messages";

interface SoeCompanyModalProps {
  cui: string;
  onClose: () => void;
}

function statusStyle(status: string): string {
  if (status === "PROFIT") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (status === "PIERDERE") {
    return "bg-red-50 text-red-700 border-red-200";
  }
  return "bg-slate-100 text-slate-600 border-slate-200";
}

export function SoeCompanyModal({ cui, onClose }: SoeCompanyModalProps) {
  const { i18n } = useLingui();

  // Same render-time focus capture as DrilldownModal: the trigger is often
  // a chart element (SVG), not a native button, so Radix alone restores
  // focus to <body>.
  const triggerElementRef = useRef<Element | null>(null);
  if (triggerElementRef.current === null) {
    triggerElementRef.current = document.activeElement;
  }

  useEffect(() => {
    return () => {
      const element = triggerElementRef.current;
      if (element instanceof HTMLElement || element instanceof SVGElement) {
        element.focus({ preventScroll: true });
      }
    };
  }, []);

  const { data, isPending, isError } = useQuery({
    queryKey: ["soe-company", cui],
    queryFn: () => fetchSoeCompany(cui),
  });

  const marginSeries =
    data !== null && data !== undefined
      ? data.financials
          .filter((point) => point.margin !== null)
          .map((point) => ({ year: point.year, margin: point.margin }))
      : [];

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-lg font-bold">
                {data !== null && data !== undefined ? data.name : "…"}
              </Dialog.Title>
              {data !== null && data !== undefined && (
                <Dialog.Description className="mt-1 flex flex-wrap gap-2 text-sm text-slate-500">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${statusStyle(data.status)}`}
                  >
                    {data.status}
                  </span>
                  <span>
                    {i18n._(m["soe.company.sector"])}: {data.sectorLabel}
                  </span>
                  <span>
                    {i18n._(m["soe.company.county"])}: {data.county}
                  </span>
                  {data.listed && data.ticker !== null && (
                    <span className="font-semibold">{data.ticker}</span>
                  )}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-md border border-slate-200 px-2 py-1 text-slate-500 hover:bg-slate-50"
                aria-label={i18n._(m["soe.company.close"])}
              >
                ✕
              </button>
            </Dialog.Close>
          </div>

          {isPending && (
            <p className="mt-6 text-sm text-slate-500">
              {i18n._(m["soe.company.loading"])}
            </p>
          )}
          {isError && (
            <p className="mt-6 text-sm text-red-600">
              {i18n._(m["soe.unavailable"])}
            </p>
          )}

          {data !== null && data !== undefined && (
            <div className="mt-4 space-y-5">
              {marginSeries.length > 1 && (
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {i18n._(m["soe.company.marginHistory"])}
                  </p>
                  <div className="mt-2 h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={marginSeries}
                        margin={{ top: 8, right: 8, bottom: 0, left: -18 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                        <YAxis
                          tick={{ fontSize: 11 }}
                          tickFormatter={(value: number) => `${value}%`}
                        />
                        <Tooltip
                          formatter={(value) => [`${String(value)}%`]}
                          contentStyle={{ fontSize: 12 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="margin"
                          stroke="#2563eb"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-xs text-slate-500">
                    {i18n._(m["soe.company.management"])}
                  </p>
                  <p className="mt-1 text-sm font-semibold tabular-nums">
                    {formatLei(data.salaries.maxSalary)}
                    <span className="font-normal text-slate-500">/lună</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    {data.salaries.people} persoane
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-xs text-slate-500">
                    {i18n._(m["soe.company.employees"])}
                  </p>
                  <p className="mt-1 text-sm font-semibold tabular-nums">
                    {formatNumber(data.mfin.employees)}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-xs text-slate-500">
                    {i18n._(m["soe.company.subsidy"])}
                  </p>
                  <p className="mt-1 text-sm font-semibold tabular-nums">
                    {data.subsidy2025MiiLei !== null
                      ? formatLei(
                          new Decimal(data.subsidy2025MiiLei).times(1000)
                        )
                      : "—"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700">
                  {i18n._(m["soe.company.mfin"])}
                </p>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-xs text-slate-500">
                      {i18n._(m["soe.company.ca"])}
                    </dt>
                    <dd className="tabular-nums">{formatLei(data.mfin.ca)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">
                      {i18n._(m["soe.company.profit"])}
                    </dt>
                    <dd className="tabular-nums">
                      {formatLei(data.mfin.profit)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">
                      {i18n._(m["soe.company.loss"])}
                    </dt>
                    <dd className="tabular-nums">
                      {formatLei(data.mfin.loss)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">
                      {i18n._(m["soe.company.capital"])}
                    </dt>
                    <dd className="tabular-nums">
                      {formatLei(data.mfin.capitaluri)}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <SourceBadge source="soe.source" />
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
                  >
                    {i18n._(m["soe.company.close"])}
                  </button>
                </Dialog.Close>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

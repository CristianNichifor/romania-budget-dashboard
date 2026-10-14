import * as Dialog from "@radix-ui/react-dialog";
import { useLingui } from "@lingui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { fetchInstitutions } from "../../api/client";
import type { BudgetDestination } from "../../data/budget2026";
import { formatMilliardeLei, formatPercent } from "../../lib/format";
import { computeInstitutionShares } from "../../lib/institutions";
import { SourceBadge } from "./SourceBadge";
import { m } from "../../messages";

interface DrilldownModalProps {
  destination: BudgetDestination;
  year: string;
  onClose: () => void;
  onBackToOverview: () => void;
}

export function DrilldownModal({
  destination,
  year,
  onClose,
  onBackToOverview,
}: DrilldownModalProps) {
  const { i18n } = useLingui();

  // Capture the trigger element during render (before Radix moves focus
  // into the dialog) so focus returns to it — e.g. the sankey node — on
  // close. Radix alone restores to <body> for keyboard-opened dialogs
  // whose trigger is not a native button.
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
    queryKey: ["institutions", destination.id, year],
    queryFn: () => fetchInstitutions(year, destination.id),
  });

  const shares =
    data !== undefined
      ? computeInstitutionShares(data.institutions, data.total)
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
          <nav aria-label="breadcrumb" className="text-sm text-slate-500">
            <button
              type="button"
              className="hover:text-blue-700 hover:underline"
              onClick={onBackToOverview}
            >
              {i18n._(m["drilldown.breadcrumb.root"])}
            </button>
            <span aria-hidden="true"> › </span>
            <span>{i18n._(m["drilldown.breadcrumb.destinations"])}</span>
            <span aria-hidden="true"> › </span>
            <span className="font-semibold text-slate-700">
              {destination.name}
            </span>
          </nav>

          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-lg font-bold">
                {i18n._({
                  ...m["drilldown.title"],
                  values: { destination: destination.name },
                })}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-slate-500">
                {i18n._(m["drilldown.description"])}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="inline-flex min-h-6 min-w-6 items-center justify-center rounded-md border border-slate-200 px-2 py-1 text-slate-500 hover:bg-slate-50"
                aria-label={i18n._(m["drilldown.close"])}
              >
                ✕
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-4">
            {isPending && (
              <div className="space-y-3" aria-hidden="true">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="h-8 animate-pulse rounded-md bg-slate-100"
                  />
                ))}
              </div>
            )}
            {isError && (
              <p className="text-sm text-red-600">
                {i18n._(m["drilldown.error"])}
              </p>
            )}
            {data !== undefined && data.institutions.length === 0 && (
              <p className="text-sm text-slate-500">
                {i18n._(m["drilldown.empty"])}
              </p>
            )}
            {data !== undefined && data.institutions.length > 0 && (
              <ul className="space-y-3">
                {shares.map((share) => (
                  <li key={share.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-sm font-medium">{share.name}</span>
                      <span className="tabular-nums text-sm text-slate-600">
                        {formatMilliardeLei(share.amount)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <div
                        aria-hidden="true"
                        className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"
                      >
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{
                            width: `${Math.min(share.sharePercent, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="w-20 text-right text-xs tabular-nums text-slate-500">
                        {i18n._({
                          ...m["drilldown.share"],
                          values: {
                            sharePercent: formatPercent(share.sharePercent),
                          },
                        })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {data !== undefined && data.institutions.length > 0 && (
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <SourceBadge source="source.budgetYear" values={{ year }} />
              <p className="text-sm text-slate-500">
                {i18n._(m["drilldown.total"])}:{" "}
                <span className="font-semibold tabular-nums text-slate-700">
                  {formatMilliardeLei(data.total)}
                </span>
              </p>
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              >
                {i18n._(m["drilldown.close"])}
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

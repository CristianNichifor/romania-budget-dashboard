import type { ReactNode } from "react";

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

/**
 * Neutral placeholder for a section that has no data for the selection.
 * `action` is the one way out, e.g. switching to the year that has data.
 */
export function EmptyState({
  children,
  action,
}: {
  children: ReactNode;
  action?: EmptyStateAction;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
      <p>{children}</p>
      {action !== undefined && (
        <button
          type="button"
          onClick={action.onClick}
          className="inline-flex min-h-11 items-center rounded-md border border-slate-300 px-3 font-medium text-budget-blue hover:bg-slate-50"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

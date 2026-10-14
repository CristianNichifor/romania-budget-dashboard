import type { ReactNode } from "react";

/** Neutral placeholder for a section that has no data for the selection. */
export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
      {children}
    </p>
  );
}

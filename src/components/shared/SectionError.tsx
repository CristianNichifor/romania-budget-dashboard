import { useLingui } from "@lingui/react";
import type { UseQueryResult } from "@tanstack/react-query";
import { RotateCw } from "lucide-react";
import type { ReactNode } from "react";
import { m } from "../../messages";

interface SectionErrorProps {
  title?: ReactNode;
  onRetry: () => void;
}

/** Shown in place of a section whose data request failed. */
export function SectionError({ title, onRetry }: SectionErrorProps) {
  const { i18n } = useLingui();

  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
    >
      <div>
        {title !== undefined && <p className="font-semibold">{title}</p>}
        <p>{i18n._(m["section.error"])}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-md border border-red-300 bg-white px-3 py-1.5 font-medium text-red-800 hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
      >
        <RotateCw aria-hidden="true" className="h-4 w-4" />
        {i18n._(m["section.retry"])}
      </button>
    </div>
  );
}

interface QueryErrorProps {
  query: Pick<UseQueryResult, "isError" | "refetch">;
  title?: ReactNode;
}

/** The error card for a query, or nothing while it has not failed. */
export function QueryError({ query, title }: QueryErrorProps) {
  if (!query.isError) {
    return null;
  }
  return (
    <SectionError
      title={title}
      onRetry={() => {
        void query.refetch();
      }}
    />
  );
}

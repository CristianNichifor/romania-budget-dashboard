import { useLingui } from "@lingui/react";
import { cn } from "../../lib/cn";
import { useDataModeStore, type DataMode } from "../../store/useDataModeStore";
import { m } from "../../messages";

const STYLES: Record<
  Exclude<DataMode, "unknown">,
  { cls: string; messageId: (typeof m)[keyof typeof m] }
> = {
  live: {
    cls: "border-emerald-200 bg-emerald-50 text-emerald-700",
    messageId: m["dataMode.live"],
  },
  fallback: {
    cls: "border-amber-200 bg-amber-50 text-amber-700",
    messageId: m["dataMode.fallback"],
  },
  partial: {
    cls: "border-amber-200 bg-amber-50 text-amber-700",
    messageId: m["dataMode.partial"],
  },
};

/**
 * Honest data-source indicator: live API vs. bundled demo fallback.
 * Keeps a fixed-height placeholder while the first requests are in flight
 * to avoid layout shift.
 */
export function DataModeBadge() {
  const mode = useDataModeStore((state) => state.mode);
  const { i18n } = useLingui();

  if (mode === "unknown") {
    return (
      <span
        aria-hidden="true"
        className="h-6 w-28 animate-pulse rounded-full bg-slate-100"
      />
    );
  }

  const style = STYLES[mode];

  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full border px-2.5 text-xs font-medium whitespace-nowrap",
        style.cls
      )}
    >
      {i18n._(style.messageId)}
    </span>
  );
}

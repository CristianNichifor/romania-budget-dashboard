import { useLingui } from "@lingui/react";
import { cn } from "../../lib/cn";
import { m } from "../../messages";
import { useSlowLoading } from "./useSlowLoading";

interface SkeletonCardProps {
  className?: string;
}

/**
 * Pulsing placeholder shown while a chart/KPI section is loading. Silent for
 * the first two seconds; after that it tells the reader (and screen readers,
 * via a polite live region) that the server is slow rather than broken.
 */
export function SkeletonCard({ className }: SkeletonCardProps) {
  const { i18n } = useLingui();
  const slow = useSlowLoading();

  return (
    <div
      aria-hidden={slow ? undefined : "true"}
      role={slow ? "status" : undefined}
      className={cn(
        "flex animate-pulse items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-4 text-center text-sm text-slate-500",
        className
      )}
    >
      {slow ? i18n._(m["app.loadingSlow"]) : null}
    </div>
  );
}

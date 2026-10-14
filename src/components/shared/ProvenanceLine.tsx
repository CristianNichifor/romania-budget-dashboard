import { useLingui } from "@lingui/react";
import { cn } from "../../lib/cn";
import { lookupMessage, m } from "../../messages";

interface ProvenanceLineProps {
  /** i18n message id for the data source name (e.g. "provenance.budget"). */
  source: string;
  /** Reference year of the data; "—" when none is known. */
  year: number | string | null;
  className?: string;
}

/**
 * Plain provenance line under a section heading: `Date: sursă, an`
 * (ux-guidelines UXG-B7, design F2.2). It is a paragraph, so screen readers
 * meet the source before any control.
 */
export function ProvenanceLine({
  source,
  year,
  className,
}: ProvenanceLineProps) {
  const { i18n } = useLingui();

  return (
    <p
      data-testid="provenance-line"
      className={cn("text-sm text-slate-600", className)}
    >
      {i18n._({
        ...m["provenance.line"],
        values: {
          source: i18n._(lookupMessage(source)),
          year: year === null || year === "" ? "—" : String(year),
        },
      })}
    </p>
  );
}

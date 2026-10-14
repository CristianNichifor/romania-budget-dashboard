import { useLingui } from "@lingui/react";
import { isStaticMode } from "../../api/client";
import { m } from "../../messages";

/** Marks a section that renders bundled seed data instead of the BFF. */
export function DemoBadge() {
  const { i18n } = useLingui();

  if (!isStaticMode()) {
    return null;
  }
  return (
    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
      {i18n._(m["section.demo"])}
    </span>
  );
}

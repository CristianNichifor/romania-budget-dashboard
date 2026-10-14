import { useLingui } from "@lingui/react";
import type { InsCatalogEntry } from "../../api/client";
import { m } from "../../messages";

interface InsMetricSelectProps {
  options: InsCatalogEntry[];
  value: string;
  onChange: (code: string) => void;
}

export function InsMetricSelect({
  options,
  value,
  onChange,
}: InsMetricSelectProps) {
  const { i18n } = useLingui();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label
        htmlFor="ins-metric"
        className="text-sm font-medium text-slate-700"
      >
        {i18n._(m["context.metricLabel"])}
      </label>
      <select
        id="ins-metric"
        className="min-h-11 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-sm focus-visible:outline-2 focus-visible:outline-budget-blue"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((metric) => (
          <option key={metric.code} value={metric.code}>
            {metric.label}
          </option>
        ))}
      </select>
    </div>
  );
}

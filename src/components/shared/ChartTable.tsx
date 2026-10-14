import { useLingui } from "@lingui/react";
import { m } from "../../messages";

interface ChartTableProps {
  /** Accessible name of the table, usually the chart title. */
  caption: string;
  headers: string[];
  /** One row per chart point, already formatted for display. */
  rows: (string | number)[][];
}

/**
 * The on-page table alternative every chart frame carries (UXG-B9, design
 * F2.3): a closed `details` whose summary reads "Afișează ca tabel" and whose
 * table lists the same rows the chart draws.
 */
export function ChartTable({ caption, headers, rows }: ChartTableProps) {
  const { i18n } = useLingui();

  return (
    <details className="mt-2 text-sm" data-testid="chart-table">
      <summary className="cursor-pointer text-xs font-medium text-slate-600 hover:text-slate-800">
        {i18n._(m["chart.showTable"])}
      </summary>
      <div className="mt-2 max-h-72 overflow-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-xs">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-3 py-1.5 font-medium"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={
                      cellIndex === 0
                        ? "px-3 py-1 text-slate-700"
                        : "px-3 py-1 text-right tabular-nums text-slate-700"
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

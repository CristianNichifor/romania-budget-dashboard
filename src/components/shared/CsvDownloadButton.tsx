import { Download } from "lucide-react";
import { useLingui } from "@lingui/react";
import { toCsv } from "../../lib/csv";
import { m } from "../../messages";

interface CsvDownloadButtonProps {
  filename: string;
  headers: string[];
  rows: (string | number)[][];
}

function triggerCsvDownload(filename: string, csv: string): void {
  const blob = new Blob([`\uFEFF${csv}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function CsvDownloadButton({
  filename,
  headers,
  rows,
}: CsvDownloadButtonProps) {
  const { i18n } = useLingui();

  const label = i18n._(m["chart.downloadCsv"]);

  return (
    <button
      type="button"
      onClick={() => triggerCsvDownload(filename, toCsv(headers, rows))}
      aria-label={label}
      title={label}
      className="inline-flex min-h-6 items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-budget-blue"
    >
      <Download className="size-3.5" aria-hidden="true" />
      CSV
    </button>
  );
}

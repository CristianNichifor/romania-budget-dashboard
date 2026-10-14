import { useLingui } from "@lingui/react";
import { EUR_RON_ANNUAL } from "../../lib/currency";
import { formatNumber } from "../../lib/format";
import { m } from "../../messages";

/** States the bundled rate under a chart whose amounts were converted. */
export function RateNote() {
  const { i18n } = useLingui();
  return (
    <p className="mt-2 text-xs text-slate-500" data-testid="rate-note">
      {i18n._({
        ...m["currency.rateNote"],
        values: {
          year: EUR_RON_ANNUAL.year,
          rate: formatNumber(EUR_RON_ANNUAL.rate, {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
          }),
        },
      })}
    </p>
  );
}

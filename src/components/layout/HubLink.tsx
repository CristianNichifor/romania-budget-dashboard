import { useLingui } from "@lingui/react";
import { m } from "../../messages";

/** Hub root from the civic-ui naming registry, not the app's own landing. */
export const HUB_URL = "https://projects.cristian-nichifor.com/";

/** Family-bar back link: the first link in the banner on every route. */
export function HubLink() {
  const { i18n } = useLingui();

  return (
    <a
      href={HUB_URL}
      className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-budget-blue underline-offset-2 hover:underline"
    >
      <span aria-hidden="true">←</span>
      {i18n._(m["hub.back"])}
    </a>
  );
}

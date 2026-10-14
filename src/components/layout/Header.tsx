import { useLingui } from "@lingui/react";
import { Database } from "lucide-react";
import { m } from "../../messages";
import { CurrencyToggle } from "./CurrencyToggle";
import { DataModeBadge } from "./DataModeBadge";
import { HubLink } from "./HubLink";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function Header() {
  const { i18n } = useLingui();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 pt-1">
        <HubLink />
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-budget-blue text-white">
            <Database className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-lg font-bold leading-tight">
              {i18n._(m["app.title"])}
            </h1>
            <p className="text-xs text-slate-500">
              {i18n._(m["app.subtitle"])}
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <CurrencyToggle />
          <LocaleSwitcher />
          <DataModeBadge />
        </div>
      </div>
    </header>
  );
}

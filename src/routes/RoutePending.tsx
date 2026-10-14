import { useLingui } from "@lingui/react";
import { useSlowLoading } from "../components/shared/useSlowLoading";
import { m } from "../messages";

export function RoutePending() {
  const { i18n } = useLingui();
  const slow = useSlowLoading();

  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-2 py-16 text-sm text-slate-500"
    >
      <span>{i18n._(m["app.loading"])}</span>
      {slow && <span>{i18n._(m["app.loadingSlow"])}</span>}
    </div>
  );
}

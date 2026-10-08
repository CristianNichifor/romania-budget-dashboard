import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  absoluteUrl,
  counterpartPath,
  localeFromPath,
} from "../../lib/routeTable";

function setLink(selector: string, attributes: Record<string, string>): void {
  let link = document.head.querySelector<HTMLLinkElement>(selector);
  if (link === null) {
    link = document.createElement("link");
    document.head.append(link);
  }
  for (const [name, value] of Object.entries(attributes)) {
    link.setAttribute(name, value);
  }
}

/**
 * Keeps `<link rel="canonical">` and the en/ro/x-default alternates on the
 * current route's pair, on this host. `index.html` ships the root's set for
 * clients without JavaScript.
 */
export function DocumentLinks() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const locale = localeFromPath(pathname);
    const en = absoluteUrl(counterpartPath(pathname, "en"));
    const ro = absoluteUrl(counterpartPath(pathname, "ro"));

    setLink('link[rel="canonical"]', {
      rel: "canonical",
      href: locale === "ro" ? ro : en,
    });
    setLink('link[rel="alternate"][hreflang="en"]', {
      rel: "alternate",
      hreflang: "en",
      href: en,
    });
    setLink('link[rel="alternate"][hreflang="ro"]', {
      rel: "alternate",
      hreflang: "ro",
      href: ro,
    });
    setLink('link[rel="alternate"][hreflang="x-default"]', {
      rel: "alternate",
      hreflang: "x-default",
      href: en,
    });
  }, [pathname]);

  return null;
}

import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { headFor } from "../../lib/staticHead";

function setElement(
  tag: "link" | "meta",
  selector: string,
  attributes: Record<string, string>
): void {
  let element = document.head.querySelector(selector);
  if (element === null) {
    element = document.createElement(tag);
    document.head.append(element);
  }
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
}

/**
 * Keeps the title, description, canonical and en/ro/x-default alternates on
 * the current route after client-side navigation. The build writes the same
 * head into each route's static HTML (`src/lib/staticHead.ts`).
 */
export function DocumentLinks() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const head = headFor(pathname);

    document.title = head.title;
    setElement("meta", 'meta[name="description"]', {
      name: "description",
      content: head.description,
    });
    setElement("meta", 'meta[property="og:title"]', {
      property: "og:title",
      content: head.title,
    });
    setElement("meta", 'meta[property="og:description"]', {
      property: "og:description",
      content: head.description,
    });
    setElement("meta", 'meta[property="og:url"]', {
      property: "og:url",
      content: head.canonical,
    });
    setElement("link", 'link[rel="canonical"]', {
      rel: "canonical",
      href: head.canonical,
    });
    setElement("link", 'link[rel="alternate"][hreflang="en"]', {
      rel: "alternate",
      hreflang: "en",
      href: head.alternates.en,
    });
    setElement("link", 'link[rel="alternate"][hreflang="ro"]', {
      rel: "alternate",
      hreflang: "ro",
      href: head.alternates.ro,
    });
    setElement("link", 'link[rel="alternate"][hreflang="x-default"]', {
      rel: "alternate",
      hreflang: "x-default",
      href: head.alternates.xDefault,
    });
  }, [pathname]);

  return null;
}

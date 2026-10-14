import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CONTENT_PAGES, PAGES, SITE_URL } from "../src/lib/routeTable";
import {
  OG_IMAGE,
  headFor,
  robotsTxt,
  sitemapXml,
  staticPages,
} from "../src/lib/staticHead";

// Vitest runs from the repository root.
const indexHtml = readFileSync("index.html", "utf8");
const pages = staticPages(indexHtml);

function pageHtml(fileName: string): string {
  const page = pages.find((entry) => entry.fileName === fileName);
  if (page === undefined) {
    throw new Error(`no static page ${fileName}`);
  }
  return page.html;
}

function fileNameFor(path: string): string {
  return `${path.slice(1)}index.html`;
}

describe("static head per route", () => {
  it("emits one page per route and language", () => {
    expect(pages.map((page) => page.fileName).sort()).toEqual(
      PAGES.flatMap((page) => [page.en, page.ro])
        .map(fileNameFor)
        .sort()
    );
  });

  it.each(CONTENT_PAGES.flatMap((page) => [page.en, page.ro]))(
    "writes lang, canonical, alternates and meta for %s",
    (path) => {
      const head = headFor(path);
      const html = pageHtml(fileNameFor(path));
      const page = CONTENT_PAGES.find((p) => p.en === path || p.ro === path);

      expect(html).toContain(`<html lang="${head.lang}">`);
      expect(html).toContain(
        `<link rel="canonical" href="${SITE_URL}${path}" />`
      );
      expect(html).toContain(
        `<link rel="alternate" hreflang="en" href="${SITE_URL}${page?.en}" />`
      );
      expect(html).toContain(
        `<link rel="alternate" hreflang="ro" href="${SITE_URL}${page?.ro}" />`
      );
      expect(html).toContain(
        `<link rel="alternate" hreflang="x-default" href="${SITE_URL}${page?.en}" />`
      );
      expect(html).toContain(`<title>${head.title}</title>`);
      expect(html).toContain(
        `<meta name="description" content="${head.description}" />`
      );
      expect(html).toContain(
        `<meta property="og:url" content="${SITE_URL}${path}" />`
      );
      expect(html).toContain(
        `<meta property="og:image" content="${SITE_URL}${OG_IMAGE.path}" />`
      );
      expect(html).toContain(
        '<meta property="og:image:width" content="1200" />'
      );
      expect(html).toContain(
        '<meta property="og:image:height" content="630" />'
      );
      expect(html).toContain(
        '<meta name="twitter:card" content="summary_large_image" />'
      );
      expect(html.match(/rel="canonical"/g)).toHaveLength(1);
      expect(html.match(/<title>/g)).toHaveLength(1);
      expect(html).toContain('<script type="module"');
    }
  );

  it("writes the about page head in both languages", () => {
    expect(headFor("/about/").title).toBe("About — Romania's Budget");
    expect(headFor("/ro/despre/").title).toBe("Despre — Bugetul României");
    expect(pageHtml("ro/despre/index.html")).toContain('<html lang="ro">');
  });

  it("gives each language its own lang, title and description", () => {
    const en = headFor("/energy/");
    const ro = headFor("/ro/energie/");
    expect(en.lang).toBe("en");
    expect(ro.lang).toBe("ro");
    expect(ro.title).toContain("Bugetul României");
    expect(en.title).not.toBe(ro.title);
    expect(en.description).not.toBe(ro.description);
  });

  it("points the home redirects at their first tab", () => {
    expect(headFor("/").canonical).toBe(`${SITE_URL}/your-share/`);
    expect(headFor("/ro/").canonical).toBe(`${SITE_URL}/ro/felia-ta/`);
    expect(pageHtml("ro/index.html")).toContain('<html lang="ro">');
  });

  it("escapes markup in meta content", () => {
    for (const path of CONTENT_PAGES.flatMap((page) => [page.en, page.ro])) {
      const head = headFor(path);
      expect(head.title).not.toMatch(/[<>"]/);
      expect(head.description).not.toMatch(/[<>"]/);
    }
  });

  it("ships a 1200x630 PNG for og:image", () => {
    const png = readFileSync(`public${OG_IMAGE.path}`);
    expect(png.subarray(1, 4).toString("ascii")).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(OG_IMAGE.width);
    expect(png.readUInt32BE(20)).toBe(OG_IMAGE.height);
  });
});

describe("robots.txt and sitemap.xml", () => {
  it("allows crawling and names the sitemap", () => {
    const robots = robotsTxt();
    expect(robots).toMatch(/^User-agent: \*$/m);
    expect(robots).toMatch(/^Allow: \/$/m);
    expect(robots).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
  });

  it("lists every tab in both languages with alternates", () => {
    const sitemap = sitemapXml();
    expect(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(
      true
    );
    expect(sitemap).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    for (const page of CONTENT_PAGES) {
      for (const path of [page.en, page.ro]) {
        expect(sitemap).toContain(`<loc>${SITE_URL}${path}</loc>`);
      }
      expect(sitemap).toContain(
        `<xhtml:link rel="alternate" hreflang="ro" href="${SITE_URL}${page.ro}" />`
      );
      expect(sitemap).toContain(
        `<xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${page.en}" />`
      );
    }
    expect(sitemap.match(/<url>/g)).toHaveLength(CONTENT_PAGES.length * 2);
  });
});

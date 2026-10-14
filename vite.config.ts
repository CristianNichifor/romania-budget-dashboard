import babel from "@rolldown/plugin-babel";
import { lingui, linguiTransformerBabelPreset } from "@lingui/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import {
  applyHead,
  headFor,
  robotsTxt,
  sitemapXml,
  staticPages,
} from "./src/lib/staticHead";

/**
 * Writes the route's head into `index.html` (dev server per request; build
 * once per route as `dist/<path>/index.html`) and emits robots.txt and
 * sitemap.xml, so none of them are SPA fallbacks.
 */
function staticHead(): Plugin {
  return {
    name: "static-head",
    transformIndexHtml(html, context) {
      const url = context.originalUrl ?? "/";
      return applyHead(
        html,
        headFor(new URL(url, "http://localhost").pathname)
      );
    },
    generateBundle: {
      order: "post",
      handler(_options, bundle) {
        const index = bundle["index.html"];
        if (index?.type !== "asset") {
          return;
        }
        for (const page of staticPages(String(index.source))) {
          if (page.fileName === "index.html") {
            index.source = page.html;
          } else {
            this.emitFile({
              type: "asset",
              fileName: page.fileName,
              source: page.html,
            });
          }
        }
        this.emitFile({
          type: "asset",
          fileName: "robots.txt",
          source: robotsTxt(),
        });
        this.emitFile({
          type: "asset",
          fileName: "sitemap.xml",
          source: sitemapXml(),
        });
      },
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    lingui(),
    babel({ presets: [linguiTransformerBabelPreset()] }),
    tailwindcss(),
    staticHead(),
  ],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "recharts",
              test: /node_modules[\\/](recharts|d3-[^\\/]+|victory-vendor)[\\/]/,
            },
            {
              name: "react",
              test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            },
            { name: "lingui", test: /node_modules[\\/]@lingui[\\/]/ },
            { name: "tanstack", test: /node_modules[\\/]@tanstack[\\/]/ },
          ],
        },
      },
    },
  },
});

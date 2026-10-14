# UX/UI guidelines — Bugetul României

Short, enforceable rules for this dashboard. They refine the fleet guideline,
civic-ui `docs/ux-guidelines.md`; where this file is silent, the fleet
guideline applies. Product language is Romanian (default, `/ro/…`) with an
English mirror (`/…`); this document is in English like the rest of `docs/`.

## 1. Users and top tasks

| User                       | Top task                                                         |
| -------------------------- | ---------------------------------------------------------------- |
| Citizen / taxpayer         | See where the consolidated budget goes and what their share is   |
| Journalist / civic analyst | Get a sourced figure (deficit, execution, SOE subsidies) to cite |
| Student / researcher       | Compare years and download the table behind a chart (CSV)        |

**The one job of the first screen** (`/ro/`, Bilanțul național): answer "how
big is the budget, how big is the deficit, for which year, according to whom"
— year, revenue, spending and deficit as KPIs with a provenance line, before
any chart.

## 2. Page anatomy

Every tab (`src/lib/routeTable.ts`) follows the same order:

1. Family bar (civic-ui `FamilyBar`, link back to the hub) — hub link in the
   app header (F2.1); civic-ui `FamilyBar` _not yet adopted_.
2. Header: app title "Bugetul României", one-line purpose, locale switcher,
   data-mode badge (`Header`, `DataModeBadge`).
3. Tab navigation (`TabNavigation`); horizontally scrollable on mobile.
4. Page H1 + one-line purpose of the tab.
5. Provenance line: `Date: <sursă>, <an>` (e.g. `Date: MFP, execuție 2025`)
   via `SourceBadge` with the year value (U8).
6. Primary task: KPI row, then the main chart of the tab.
7. Secondary views: further charts, drill-down modal, CSV download.
8. Footer: method/about (`/ro/despre/`), privacy (no cookies, no analytics),
   sources and licences, contact.

## 3. Content rules

- Diacritics: ș ț with comma below (U+0219, U+021B), never cedilla ş ţ.
  Unaccented names from the BFF (e.g. category labels) are data bugs — log them,
  do not hand-patch in components.
- Numbers, currency, percentages: only through `src/lib/format.ts` (E1).
  Romanian: `217,8 mld. lei`, `9.427 lei`, `7,1%`. English: `217.8 bn lei`,
  `9,427 lei`, `7.1%`. No `toLocaleString` / `Intl.NumberFormat` elsewhere.
- Money is `Decimal` until the display boundary; amounts are `string` across
  the API (AGENTS.md rule 1).
- Abbreviations: `mil.` / `mld.` in Romanian, `m` / `bn` in English; the unit
  appears once (no `mld. lei lei`). `% PIB` / `% of GDP`.
- Dates: `formatDateRO` style `14 octombrie 2026` / `14 Oct 2026`; years as
  plain integers, partial years marked (D7).
- Tone: plain, neutral, no advocacy; "estimare" when a figure is computed
  (salary breakdown, tax split), never presented as an official figure.
- All UI text through Lingui (`src/messages.ts` + `.po`); no English strings in
  Romanian mode. Proper names from data stay in the data files.
- Banned in user-facing copy: `BFF`, `seed`, `fallback`, `static mode`,
  `P0`/`P2`, `mock`, `fixture`, internal route keys. Use "date demo",
  "date indisponibile", "sursa oficială".

## 4. Data visualisation

- Colours: civic-ui viz palette (colour-blind safe); never colour as the only
  carrier of meaning — legends have text, deficit vs surplus also differs by
  sign and label.
- Label bars and waterfall steps with category and value (U2); treemap tiles
  pick text colour by WCAG contrast and truncate to tile width (U6).
- No dual Y axes; use small multiples with one labelled axis each (E2).
- Every chart: title, unit on the axis, as-of year and source
  (`SourceBadge`), and a table alternative (CSV via `CsvDownloadButton`;
  an on-page table is preferred for the main chart of a tab).
- Demo or partial data carries a badge on the chart itself (`DemoBadge`,
  partial-year marker), not only in the header.
- Outliers are clipped with an explicit note, not silently (U4).

## 5. States

- Loading: skeleton with fixed height (`SkeletonCard`, no layout shift); over
  2 s show staged text ("Se încarcă datele MFP…") rather than a bare spinner.
- Empty: `EmptyState` says why (e.g. no data for that year) and offers the
  nearest year with data (D2).
- Error: `SectionError` per section with a retry button (D1); a failing
  section never hides the others.
- Demo data: header badge "Date demo — API indisponibil" plus per-section
  "date demo"; demo values never substitute silently for live data.

## 6. Mobile, accessibility, motion

- 390 px: no horizontal body scroll; tabs scroll inside their bar (D3); KPI
  tiles stack to one column; charts keep readable labels or switch to a list.
- Touch targets ≥ 24 px, 44 px preferred (tabs, year selector, CSV button,
  locale switcher, modal close).
- WCAG 2.1 AA; axe: 0 serious/critical. Skip link "Sari la conținut".
  Keyboard: every chart interaction (drill-down) reachable by keyboard; modal
  traps and returns focus.
- `prefers-reduced-motion`: no chart entry animations; `forced-colors`:
  borders and focus rings stay visible, chart series keep patterns/labels.

## 7. Status vocabulary

Use exactly: **Date live** / Live data, **Date demo** / Demo data,
**Prototip** / Prototype, **Arhivat** / Archived. The data-mode badge maps
`live` → Date live, `fallback` → Date demo, `partial` → Date parțial demo.

## 8. Conformance checklist

| Rule                                | Test                                                       |
| ----------------------------------- | ---------------------------------------------------------- |
| Numbers via one formatter (ro + en) | `tests/format.test.ts`, `e2e/locale-format.spec.ts`        |
| Error + retry per section           | `tests/SectionError.test.tsx`, `e2e/section-error.spec.ts` |
| Demo badge visible on seed data     | `e2e/smoke.spec.ts`                                        |
| Empty state outside seed year       | `tests/api-error.test.ts` ("seed year")                    |
| Partial-year marker                 | `tests/partialYear.test.ts`                                |
| Source badge names the year         | `tests/SourceBadge.test.tsx`                               |
| Bar/waterfall labels                | `e2e/smoke.spec.ts`, `tests/waterfall.test.ts`             |
| Tile label contrast                 | `tests/tileLabel.test.ts`                                  |
| Mobile 375 px, no body scroll       | `e2e/mobile.spec.ts`                                       |
| Head, lang, hreflang per route      | `tests/staticHead.test.ts`, `e2e/head.spec.ts`             |
| No dual axis                        | to add with E2 (component test)                            |
| axe 0 serious, family bar, ș ț      | to add (UXG-B1/B2/B5 below)                                |

## 9. Known deviations backlog

From the 2026-10-14 live review and a code audit. Items in files the `bui`
session is changing are recorded here, not fixed in this PR.

- UXG-B1 · No civic-ui family bar or shared footer (the header links back to
  the hub since F2.1). Adopt `SiteShell`/`FamilyBar`/`SiteFooter`.
- UXG-B2 · No axe check in e2e; add `@axe-core/playwright` on every route at
  1440 and 390 px.
- UXG-B3 · `DualAxisTrend` on Bilanțul național uses two Y axes (rule 4);
  replace with small multiples like E2.
- UXG-B4 · Sankey readability and treemap labels on small tiles (review
  notes, open).
- UXG-B5 · Unaccented category names from the BFF (U3 remainder); fix at the
  data source, add a diacritics check over rendered labels.
- UXG-B6 · Hand-rolled `KpiCard`, `SourceBadge`, `DemoBadge`, `SectionError`
  duplicate civic-ui `StatTile`, `SourceCitation`, `StatusMessage`; migrate
  once civic-ui is a dependency.
- UXG-B7 · Provenance is a pill badge, not the `Date: sursă, an` line; no
  as-of date on charts outside the budget tabs.
- UXG-B8 · Loading is a generic "Se încarcă…" with no staged progress for
  slow BFF responses (> 2 s).
- UXG-B9 · No on-page table alternative for the main charts (CSV only).

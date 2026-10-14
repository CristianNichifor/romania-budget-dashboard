# Production readiness

Status legend: `todo` · `done` · `blocked` · `needs-human`.
Each item names the test that proves it. Translations written by an agent are
marked "needs human review".

## Theme A — honest data states

### D1 · Errors reach React Query · `done`

- Given the dashboard runs against the BFF (`VITE_DATA_MODE` ≠ `static`),
  when a request fails (network, HTTP status, invalid payload, timeout),
  then `request()` rejects with an `ApiError` carrying its `kind`, the data-mode
  store records a failure, and no demo seed is substituted.
- Given static mode, when a fetcher runs, then it makes no network call and
  returns the bundled seed (or `null` where there is none).
- Given a section's query errors, then the section shows an error card with a
  retry button; pressing retry re-runs the query.
- Given a section renders bundled seed data, then it shows a "date demo" /
  "demo data" badge.
- The salary breakdown and the year list are computed, not demo data: on a
  failed request they fall back to the local calculation / year range.
- Tests: `tests/api-error.test.ts`, `tests/SectionError.test.tsx`,
  `e2e/section-error.spec.ts` (Playwright project `remote`, `page.route`
  answers 500), `e2e/smoke.spec.ts` (demo badge).

### D2 · Seed only for its own year · `done`

- Given static mode, when the summary, destinations or institutions are asked
  for a year other than the seed year (2026), then the client returns an empty
  result (`null` / `[]`) and the UI shows an empty state, not the 2026 seed.
  The static year selector offers only the seed year.
- Test: `tests/api-error.test.ts` ("seed year").

### D6 · Realistic timeout · `done`

- Given a BFF request, then it is aborted after 8000 ms (the comparison after
  30 000 ms), and the abort surfaces as an `ApiError` of kind `timeout`.
- Test: `tests/api-error.test.ts` (fake timers).

### D7 · Partial-year marker · `done`

- Given a summary response with `partial: true`, or without `partial` for the
  current calendar year, then the national-balance KPIs show a "partial year"
  marker; `partial: false` hides it.
- Tests: `tests/partialYear.test.ts`, `tests/api-contract.test.ts`.

## Theme B — mobile and document head

### D3 · Mobile tab navigation · `done`

- Given a 375 px viewport, then the tab bar scrolls horizontally inside itself,
  the active tab is scrolled into view, and the body has no horizontal scroll.
- Test: `e2e/mobile.spec.ts` on the `mobile` Playwright project
  (`devices["Pixel 7"]`).

### D4 · Static head per route · `done`

- Given `pnpm build`, then every route in `routeTable.ts` has
  `dist/<path>/index.html` with the route's `lang`, canonical, hreflang
  alternates, title and description, plus `og:image` (1200×630) and
  `twitter:card`.
- The dev server applies the same head per request, and `DocumentLinks`
  keeps title, description, canonical and alternates current after
  client-side navigation. English titles and descriptions need human review.
- Tests: `tests/staticHead.test.ts`, `e2e/head.spec.ts` (JavaScript off).

### D5 · Real robots.txt and sitemap.xml · `done`

- Given the built site, then `/robots.txt` is plain text with a `Sitemap:` line
  and `/sitemap.xml` lists every route with en/ro `xhtml:link` alternates.
- Tests: `tests/staticHead.test.ts`, `e2e/head.spec.ts`.

## Theme C — content

### D8 · About page · `done`

- Given `/about/` and `/ro/despre/`, then the page lists data sources and their
  licences and states that the site sets no cookies and runs no analytics; every
  page's footer links to it.
- Licences are the ones the BFF verified from each publisher's terms
  (Eurostat CC BY 4.0, ECB usage policy, MFP OGL-ROU-1.0, companiidestat.ro
  CC BY 4.0); BNR links to its terms without a claim; transparenta.eu and Open
  Budget state none.
- Tests: `tests/routeTable.test.ts`, `tests/staticHead.test.ts`,
  `e2e/smoke.spec.ts`. Copy (ro and en) needs human review.

### D9 · README accuracy · `done`

- README no longer advertises P18 or `pnpm bnr:update` as implemented,
  documents the dev preview, and `.nvmrc` / CONTRIBUTING name the Node version
  CI uses (22).
- AGENTS.md still names `buget.cristian-nichifor.com` and
  `api.buget.cristian-nichifor.com`; left for the maintainer (see D11).
- Test: review.

## Theme D — UX review fixes

Items from the coordinator's review of the live dashboard. Status `done`
unless noted.

- U1 · Adopted-vs-executed overrun compares deficit magnitudes. Given adopted
  −141,9 and executed 168,4 mld. lei, then the overrun is 26,5, not 310,3.
  Test: `tests/adoptedComparison.test.ts`.
- U2 · Salary waterfall bars carry category labels and values; the net KPI
  shows its amount once. Test: `e2e/smoke.spec.ts`.
- U3 · SOE counts, county tiles and "% PIB" go through i18n; the subsidy total
  is abbreviated (mld. lei) without a doubled unit; the executed % of GDP uses
  the ro decimal comma. Locale-aware number formatting on EN pages (e.g.
  "mld. lei") is `todo`, as are unaccented category names, which come from the
  BFF data.
- U4 · SOE scatter x-axis clipped to ±100% margin; outliers pinned to the edge
  as red triangles with a note. Test: `tests/soeScatter.test.ts`.
- U5 · The BFF's "other destinations" bucket is split into its five largest
  items; the sankey keeps a single rest node. Tests: `tests/expandRest.test.ts`,
  `tests/sankey.test.ts`.
- U6 · Tile labels pick dark or light text by WCAG contrast and are cut to the
  tile width. Test: `tests/tileLabel.test.ts`.
- U7 · The root `/` and `x-default` default to Romanian. Tests:
  `tests/routeTable.test.ts`, `tests/staticHead.test.ts`, `e2e/smoke.spec.ts`.
- U8 · The budget source badge names the selected year. Test:
  `tests/SourceBadge.test.tsx`.

## Theme E — fleet round 2 (2026-10-14): numbers, charts, tax bridge

### E1 · Locale-correct numbers · `done`

- Given any number the UI shows, then it goes through `src/lib/format.ts`; no
  component calls `toLocaleString`, `Intl.NumberFormat` or hard-codes `ro-RO`
  (`grep -rn 'ro-RO\|toLocaleString' src` matches only the formatter).
- Given an English path, then amounts format English (`217.8 bn lei`,
  `9,427 lei`, `7.1%`); given `/ro/…`, Romanian (`217,8 mld. lei`, `9.427 lei`,
  `7,1%`). The formatter reads the Lingui locale the router activated from the
  path; callers may pass the locale explicitly. Closes the U3 `todo`.
- Tests: `tests/format.test.ts` (both locales, explicit and via
  `activateLocale`), `e2e/locale-format.spec.ts` (`bn lei` on
  `/national-balance/`, `mld. lei` on `/ro/bilantul-national/`).

### E2 · Social context as small multiples · `done`

- Given the National balance tab, then the "Context social" section (health
  spending against the chosen INS indicator) renders two charts, one per series,
  each titled and with its own Y axis labelled with its unit; no dual axis.
  (The Society tab's spending chart already shares one % of GDP axis.)
- Tests: component test (two panels, two axis labels), e2e on the tab.

### E3 · lei/€ toggle shared across tabs · `done`

- Given `?currency=eur` in the URL, then the wage charts on Your-share (salary
  waterfall, real wage) show €; with lei (the default, no param) they show lei.
  Conversions use the bundled ECB 2025 annual average EUR/RON rate, 5.0424
  (ECB data API `EXR/A.RON.EUR.SP00.A`, checked 2026-10-14; the BNR annual file
  could not be fetched), and the chart says so.
- Given the toggle in the header, then switching keeps the path and other
  params, and tab and language links carry the param to every tab.
- Labour market has no wage chart today; the param survives a visit there.
- Romanian copy for the toggle and the rate note: **needs human review**.
- Tests: unit tests for the conversion and URL helpers; e2e toggles on
  Your-share, navigates to Labour market and back, asserts the param and unit.

### E4 · "What 1 leu of your tax buys" · `done`

- Given the user's monthly state contribution on Your-share, then a section
  splits it pro rata by the latest budget year's destination shares (existing
  data), labelled an estimate; the rows sum exactly to the contribution
  (Decimal, last row absorbs rounding). Romanian copy needs human review.
- Tests: unit test for the pure split; e2e checks the section and its label.
- Done: `src/lib/taxSplit.ts`, `LeuBridge` on Your-share; `tests/taxSplit.test.ts`,
  `e2e/leu-bridge.spec.ts`. Romanian copy (`leuBridge.*`) and the English
  translation are agent-written: **needs human review**.

### E5 · Sankey readability · `done`

- Given the money-flow sankey, then only the largest eight destinations get
  their own flow, each node labelled with its name and amount; the smaller
  destinations are grouped into "Alte destinații", whose node and a
  details block under the chart open a list of what it contains, with amounts.
  Flows too thin to carry an inline amount get none (the node label has it).
- Tests: `tests/sankey.test.ts` (ranking, grouping, balance, default of eight),
  `e2e/sankey.spec.ts` (drill-down renders on `/ro/bilantul-national/`).
  Romanian/English summary copy needs human review.

### E6 · Treemap and cartogram label legibility · `done`

- Given a treemap or cartogram tile, then its label wraps on spaces onto up
  to two lines when the tile is tall enough, is cut with an ellipsis only
  when words remain, and is dropped (tooltip keeps the name) when fewer than
  four characters would fit, so no "Pe…" stubs appear. The amount line shows
  whenever it fits under the label, on county tiles too.
- Tests: `tests/tileLabel.test.ts` (`wrapLabel`, `tileLayout`); `e2e/smoke.spec.ts`
  still renders both charts.

### E7 · Staged loading for slow responses (UXG-B8) · `done`

- Given a section or route still loading after 2 s, then the placeholder
  stops being a silent skeleton and shows "Serverul răspunde greu — mai
  așteptăm câteva secunde." in a polite live region (`role="status"`); before
  2 s the skeleton stays `aria-hidden`. Copy (ro/en) needs human review.
- Test: `tests/SkeletonCard.test.tsx` (fake timers: silent at 1.9 s, announced
  at 2 s, timer cleared on unmount).

## Theme F — UX guidelines (fleet round 2, uxg-c)

### F1 · Written UX/UI guideline · `done`

- Given `docs/ux-guidelines.md`, then it states users and top tasks, page
  anatomy, content, data-viz, state, mobile/accessibility rules, the status
  vocabulary, a conformance checklist mapped to existing tests, and a
  deviations backlog (UXG-B1…B9). It refines civic-ui `docs/ux-guidelines.md`.
- Test: review; the checklist rows point at existing tests. Backlog items
  are `todo`.

## Maintainer-only

- D10 · Gate deploy on CI — `needs-human`: a `verify` job inside
  `deploy-cloudflare.yml` that `deploy` needs (diff in the theme C PR body).
- D11 · Stale repository variables `VITE_API_BASE_URL` (dead host) and
  `CLOUDFLARE_ACCOUNT_ID` — `needs-human`.
- D12 · Analytics / uptime choice — `needs-human`.

### F2 · Target-state screen designs · `done` (docs), implementation `todo`

- Given `docs/design/README.md` and `docs/design/screens/01…05`, then the
  five screens (Felia ta, Unde se duc banii, Bilanțul național, Economie,
  Despre) exist as self-contained HTML mockups with desktop and 390 px
  layouts, civic-ui token values, real repo data or "—" placeholders, and
  loading / empty / error / demo states; the README maps each screen to its
  user task, guideline sections, before screenshot and acceptance criteria
  F2.1–F2.12.
- Test: review. Mockup screenshots are not included (no browser in the fleet
  run); the Romanian copy is agent-written: **needs human review**.
- Implementation items F2.1–F2.12 are listed in the README with the test each
  one should get; they are `todo` for implementation sessions.

### F2.1 · Family bar back link to the hub (UXG-B1, part) · `done`

- Given any route, then the first link inside the `banner` landmark is
  "← Proiecte civice" / "← Civic projects" pointing at the hub root
  `https://projects.cristian-nichifor.com/` (civic-ui naming registry), and the
  banner text includes "Bugetul României". The link is a 44 px target.
- Tests: `tests/HubLink.test.tsx` (href, label per locale, target height);
  `e2e/smoke.spec.ts` (first banner link on every tab).
- Left for UXG-B1: adopting civic-ui `SiteShell` / `FamilyBar` / `SiteFooter`
  instead of the app's own header and footer.


### F2.6 · Treemap list view and keyboard drill-down (U6) · `done`

- Given the destinations treemap, then a "Hartă" / "Tabel" toggle
  (`aria-pressed`, 44 px) swaps it for an ordered list that names every
  destination, largest first, with its amount and share of the total; each
  item is a button that opens the same drill-down as clicking a tile, so the
  breakdown is reachable by keyboard. Focus stays on the toggle when views
  swap. Ties keep the source order.
- Tests: `tests/destinationList.test.ts` (ranking with `Decimal`, ties),
  `tests/DestinationTreemap.test.tsx` (toggle, list content, drill-down).

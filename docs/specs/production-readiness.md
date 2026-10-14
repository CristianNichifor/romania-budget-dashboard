# Production readiness

Status legend: `todo` · `done` · `blocked` · `needs-human`.
Each item names the test that proves it. Translations written by an agent are
marked "needs human review".

## Theme A — honest data states

### D1 · Errors reach React Query · `todo`

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
- Tests: `tests/api-error.test.ts`, `tests/SectionError.test.tsx`,
  `e2e/section-error.spec.ts` (`page.route` answers 500).

### D2 · Seed only for its own year · `todo`

- Given static mode, when the summary, destinations or institutions are asked
  for a year other than the seed year (2026), then the client returns an empty
  result (`null` / `[]`) and the UI shows an empty state, not the 2026 seed.
- Test: `tests/api-error.test.ts` ("seed year").

### D6 · Realistic timeout · `todo`

- Given a BFF request, then it is aborted after 8000 ms (the comparison after
  30 000 ms), and the abort surfaces as an `ApiError` of kind `timeout`.
- Test: `tests/api-error.test.ts` (fake timers).

### D7 · Partial-year marker · `todo`

- Given a summary response with `partial: true`, or without `partial` for the
  current calendar year, then the national-balance KPIs show a "partial year"
  marker; `partial: false` hides it.
- Tests: `tests/partialYear.test.ts`, `tests/api-contract.test.ts`.

## Theme B — mobile and document head

### D3 · Mobile tab navigation · `todo`

- Given a 375 px viewport, then the tab bar scrolls horizontally inside itself,
  the active tab is scrolled into view, and the body has no horizontal scroll.
- Test: `e2e/mobile.spec.ts` on the `mobile` Playwright project
  (`devices["Pixel 7"]`).

### D4 · Static head per route · `todo`

- Given `pnpm build`, then every route in `routeTable.ts` has
  `dist/<path>/index.html` with the route's `lang`, canonical, hreflang
  alternates, title and description, plus `og:image` (1200×630) and
  `twitter:card`.
- Tests: `tests/staticHead.test.ts`, `e2e/head.spec.ts`.

### D5 · Real robots.txt and sitemap.xml · `todo`

- Given the built site, then `/robots.txt` is plain text with a `Sitemap:` line
  and `/sitemap.xml` lists every route with en/ro `xhtml:link` alternates.
- Tests: `tests/staticHead.test.ts`.

## Theme C — content

### D8 · About page · `todo`

- Given `/about/` and `/ro/despre/`, then the page lists data sources and their
  licences and states that the site sets no cookies and runs no analytics; every
  page's footer links to it.
- Tests: `tests/routeTable.test.ts`, `e2e/smoke.spec.ts`. Copy needs human
  review.

### D9 · README accuracy · `todo`

- README no longer advertises P18 or `pnpm bnr:update` as implemented,
  documents the dev preview, and `.nvmrc` / CONTRIBUTING name the Node version
  CI uses (22).
- Test: review.

## Maintainer-only

- D10 · Gate deploy on CI — `needs-human` (workflow change; diff in PR body).
- D11 · Stale repository variables `VITE_API_BASE_URL` (dead host) and
  `CLOUDFLARE_ACCOUNT_ID` — `needs-human`.
- D12 · Analytics / uptime choice — `needs-human`.

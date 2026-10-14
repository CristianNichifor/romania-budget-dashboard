# Design screens — target state (fleet round 2, ds-bud, 2026-10-14)

Static mockups of the five screens that matter most, for implementation
sessions to build from. Each HTML file is self-contained (inline CSS copying
the civic-ui 0.8 token values, no scripts, no external requests) and renders
the desktop layout at 1440 px and the mobile layout at 390 px through one
media query. Open them in any browser; print to check the table alternatives.

Rules they follow: `docs/ux-guidelines.md` (this repo) and the fleet guideline
civic-ui `docs/ux-guidelines.md`. Romanian copy in the mockups was written by
an agent and **needs human review**. No figures are invented: amounts come
from `src/data/budget2026.ts`, `src/data/insStats.ts`, `src/data/taxRates.ts`
and the formulas in `src/lib/salary.ts` / `src/lib/taxSplit.ts`; series that
only exist behind the API are shown as "—" placeholders.

Screenshots of the mockups (`screens/*.png`) are **not included**: the fleet
ran without browsers on 2026-10-14 (memory limit). "Before" screenshots of the
live site, taken earlier that morning at 1440 and 390 px, are in `before/`.

| #   | Screen (file)                                           | User task                                                                  | Guideline sections                                 | Before                                                                  |
| --- | ------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------- |
| 01  | Felia ta — `screens/01-felia-ta.html`                   | See how much of my labour cost reaches the state and what 1 leu of it buys | repo §1, §2, §4 (U2), §5; civic §2, §4, §5         | `before/felia-ta-1440.png`, `before/felia-ta-390.png`                   |
| 02  | Unde se duc banii — `screens/02-unde-se-duc-banii.html` | Read the destinations of spending (treemap) and the money flow (sankey)    | repo §4 (U6, UXG-B4, UXG-B9); civic §4             | part of `before/bilantul-national-1440.png` (same page today)           |
| 03  | Bilanțul național — `screens/03-bilantul-national.html` | Get year, revenue, spending, deficit as sourced figures                    | repo §1, §2, §4 (UXG-B3), §5, §7; civic §2, §4, §5 | `before/bilantul-national-1440.png`, `before/bilantul-national-390.png` |
| 04  | Economie — `screens/04-economie.html`                   | Compare macro indicators without dual axes; download the table             | repo §4 (E2), §5; civic §4, §5                     | `before/economie-1440.png`, `before/economie-390.png`                   |
| 05  | Despre — `screens/05-despre.html`                       | Find the method, the sources with licences, privacy and contact            | repo §2 (8), §3; civic §2, §3                      | `before/despre-1440.png`, `before/despre-390.png`                       |

## What changes vs today

Common to every screen (UXG-B1, UXG-B7, UXG-B8, UXG-B9):

- A family bar on top: "← Proiecte civice" link to the hub, tool name
  "Bugetul României", the status badge (Date live / Date demo), RO · EN switch.
  Today the app has its own header with no hub link.
- H1 + one-line purpose + a plain provenance line `Date: sursă, an` under it,
  before any control. Today provenance is a pill badge inside cards.
- Every chart sits in a frame with title, the question it answers, source line,
  CSV button and a "Afișează ca tabel" disclosure with the same rows. Today
  there is CSV only.
- Loading over 2 s shows staged text plus a progress bar; empty states name the
  nearest year with data; errors are per section with one "Reîncercați" button
  and never hide the other sections. Demo data shows the badge in the family
  bar and on each frame.
- 390 px: KPI tiles stack to one column, tabs scroll inside their bar, charts
  keep their labels or become an ordered list (sankey).

Per screen:

- **01 Felia ta.** Gross-salary control (number + slider + "Salariul mediu"
  reset, 44 px targets) above four KPI tiles (employer cost, net, state share,
  estimated VAT). Waterfall with category and value on every step (U2), the
  net step in a different colour and the deficit colour never alone. The leu
  bridge is a single 100-bani band with the bani written on each segment and
  a table with bani and lei per destination. "Estimare" is in the provenance
  line and in the frame question.
- **02 Unde se duc banii.** The treemap becomes the primary view with labels
  only where they fit (U6), an ordered list under it for the small tiles, a
  Hartă / Tabel toggle, and keyboard drill-down into sub-destinations. The
  sankey is secondary: value labels on the top six destinations, flows under
  3 % grouped as "Altele", list fallback on mobile (UXG-B4).
- **03 Bilanțul național.** The first screen's one job: four KPI tiles (year
  in the label) with the deficit marked as bad by text and sign. One-axis
  grouped bars for revenue and spending with the deficit written per year;
  years without data show "—", not zero. The dual-axis context chart (UXG-B3)
  becomes three small multiples (health spending, pensioners, hospital beds),
  one axis each, direct label at the end of each series.
- **04 Economie.** Six equal-width small multiples (inflation with the BNR
  target line, unemployment, EUR/RON, GDP growth bars, public debt with the
  60 % line, trade balance bars) replacing any shared-axis chart (E2). Negative
  bars go below the axis with a minus sign and are also red. One table with the
  latest value, period and source per indicator.
- **05 Despre.** In-page contents, a method section that states the formulas
  and the "estimare" rule, a sources table with "used for" and licence per
  source (the list from `src/routes/About.tsx`), privacy and code/contact.

## Implementation notes and acceptance criteria

Each criterion is written so an implementation session can turn it into a
test (unit, component or e2e). IDs continue the spec in
`docs/specs/production-readiness.md` (item F2).

- **F2.1 Family bar.** Every route renders a `banner` landmark whose first
  link points at the hub and whose text includes "Bugetul României"; the
  status badge text is one of the §7 vocabulary words. Test: e2e on each route
  at 1440 and 390; unit test on the labels map.
- **F2.2 Provenance line.** Under the H1 of every tab, the first paragraph
  starts with `Date:` and contains a four-digit year. Test: e2e per route.
- **F2.3 Table alternative.** Every chart frame contains a `details` whose
  summary is "Afișează ca tabel" and whose table has the same number of rows
  as the chart series. Test: component test per chart frame.
- **F2.4 No dual axis.** No chart renders two `YAxis` elements; the context
  chart on Bilanțul național renders three single-axis charts. Test: component
  test (UXG-B3, E2).
- **F2.5 Waterfall and leu bridge labels.** Every waterfall step and every
  bridge segment has a visible text label with its formatted value; bani on
  the bridge sum to 100 and lei to the state share rounded to bani. Test:
  `tests/waterfall.test.ts`, `tests/taxSplit.test.ts`, e2e text assertions.
- **F2.6 Treemap labels and list.** Tiles below the label threshold carry no
  text; an ordered list after the treemap names every destination with value
  and share; a Hartă / Tabel toggle swaps the views and keeps focus. Test:
  `tests/tileLabel.test.ts`, component test.
- **F2.7 Sankey readability.** The six largest destinations carry value
  labels; flows under 3 % of total are grouped into "Altele"; under 640 px the
  sankey is replaced by an ordered list. Test: `tests/sankey.test.ts`, e2e at 390.
- **F2.8 States.** Loading over 2 s renders a `status` region with staged
  text and a progress bar; empty states name the nearest year and offer a
  button to it; each section error renders `role="alert"` with one retry
  button and the sibling sections stay mounted. Test: component tests with
  mocked timers and failing queries.
- **F2.9 Missing values.** Years or indicators without data render "—", never
  0, in tiles, charts and tables. Test: unit test on the formatter path and a
  component test.
- **F2.10 Mobile.** At 390 px no horizontal body scroll, KPI tiles one per
  row, every interactive target at least 24 px (44 px for tabs, buttons,
  slider, select). Test: `e2e/mobile.spec.ts` extended with a bounding-box
  check.
- **F2.11 Diacritics and language.** Rendered Romanian text contains no
  cedilla characters (U+015F, U+0163) and no English UI strings. Test: e2e
  text scan per route.
- **F2.12 Contrast.** Text on viz colours uses the tile-label contrast rule;
  axe reports 0 serious or critical issues at 1440 and 390. Test:
  `@axe-core/playwright` per route (UXG-B2).

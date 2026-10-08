# romania-budget-dashboard

Contributor setup and checks: [CONTRIBUTING.md](CONTRIBUTING.md).

Tablou de bord cetățenesc pentru bugetul consolidat al României (central, social, sănătate), pe modelul [Open Budget 2026](https://openbudget.ro/buget/2026/), cu context INS/Eurostat (salarii, statistici, inflație, datorie).

> **Status: P36.** Frontend-ul apelează `romania-budget-dashboard-bff` (date live Eurostat/BCE/MFP) și cade pe datele locale demo când BFF-ul nu răspunde. Opt tab-uri: Feliuța ta, Bilanțul național, Companii de stat, Economie, Societate, Energie, Piața muncii, Justiție.

## Tab-uri

| Tab                                          | Vizualizări                                                                                                                               | Date                                                         |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Feliuța ta** (`/felia-ta`)                 | Waterfall salariu, indice salariu real vs. nominal, context salarial (LCI + ancore SES)                                                   | Rate fiscale 2026 (static), Eurostat                         |
| **Bilanțul național** (`/bilantul-national`) | KPI venituri/cheltuieli/deficit, adoptat vs. execuție, Sankey flux bugetar, Treemap destinații, gauge deficit % PIB                       | Open Budget 2026 (static), MFP data.gov.ro + transparenta.eu |
| **Companii de stat** (`/companii-de-stat`)   | KPI, scatter salariu × marjă, trend sectoare, hartă județe, subvenții locale, listate BVB                                                 | companiidestat.ro (API public)                               |
| **Economie** (`/economie`)                   | Inflația anuală vs. ținta BNR, șomaj, curs EUR/RON, deficit trimestrial vs. Maastricht, ocupare, cont curent, dobânda BCE, PIB pe regiuni | Eurostat, BCE, BNR                                           |
| **Societate** (`/societate`)                 | Populație, cheltuieli publice sănătate/educație (% PIB), educație, sănătate, demografie, indicatori sociali                               | Eurostat, INS                                                |
| **Energie** (`/energie`)                     | Preț electricitate gospodării, energie regenerabilă, dependență de import                                                                 | Eurostat                                                     |
| **Piața muncii** (`/piata-muncii`)           | Rata NEET (15–29), șomajul tinerilor, rata locurilor de muncă vacante                                                                     | Eurostat                                                     |
| **Justiție** (`/justitie`)                   | Omucideri intenționate, populație carcerală, efectivul de polițiști                                                                       | Eurostat                                                     |

## Tech stack

Aliniat cu `hack-for-facts-eb-client` / `transparenta-eu-ins-loader`:

- **React 19 + Vite 8 + TypeScript** (ESM, strict)
- **TanStack Router** (tab-uri) + **TanStack Query** (fetch prin `src/api/client.ts`)
- **Recharts 3** (waterfall compus, treemap, linii) + **d3-sankey**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Lingui v6** (`ro` sursă, `en` secundar) — cataloage runtime în `src/locales`
- **Zustand** (stare slider salariu), **zod** (scheme contract API)
- **decimal.js — regula „no floats”**: toate calculele monetare sunt `Decimal`; sumele trec granița API ca `string`
- Quality gates: ESLint (import-x, react-hooks, react-refresh) + Prettier + Husky + lint-staged + commitlint (Conventional Commits)

## Comenzi

```bash
pnpm install
pnpm dev          # Vite dev server
pnpm check        # typecheck + lint + test + format:check
pnpm test         # Vitest (unit, functional core)
pnpm test:coverage
pnpm build        # tsc -b && vite build
```

## Arhitectura

```
src/
├── api/client.ts        # Contract API tipizat (zod); P0 = date locale, P2 = fetch BFF
├── data/                # Seed-uri statice (rate fiscale, buget, BNR)
├── lib/                 # Nucleu funcțional PUR (salary, waterfall, realWage, sankey, format)
├── locales/             # Cataloage Lingui (ro/en)
├── store/               # Zustand
├── components/
│   ├── charts/          # SalaryWaterfall, BudgetSankey, DestinationTreemap, RealWageLine, DebtGauge
│   ├── layout/          # Header, TabNavigation
│   └── shared/          # KpiCard, SourceBadge
└── routes/              # RootLayout, CitizenSlice, NationalBalance
```

Regula din celelalte repo-uri: **nucleul funcțional nu face I/O și nu aruncă** — `src/lib` este pur și testat unitar; componentele și `src/api` sunt „shell-ul”.

## Roadmap

| Fază | Deliverable                                                                                                            | Status |
| ---- | ---------------------------------------------------------------------------------------------------------------------- | ------ |
| P0   | Waterfall salariu cu rate 2026 hardcodate                                                                              | ✓      |
| P1   | Sankey + treemap cu date buget static                                                                                  | ✓      |
| P2   | Integrare BFF: `fetch*` din `src/api/client.ts` → `romania-budget-dashboard-bff` (`VITE_API_BASE_URL`), fallback local | ✓      |
| P3   | Trenduri INS (endpoint `/api/ins/metrics`, secțiunea „Context din statisticile INS”)                                   | ✓      |
| P4   | Context BNR: seed JSON + script trimestrial (`pnpm bnr:update`) în repo-ul BFF                                         | ✓      |
| P5   | Drill-down instituțional (modal + breadcrumb)                                                                          | ✓      |
| P6   | Harta investițiilor (county heatmap — API există deja în eb-server)                                                    | ✓      |
| P7   | Indicator INS selectabil în secțiunea de context (`/api/ins/catalog`)                                                  | ✓      |
| P9   | Buget adoptat vs. execuție (MFP via data.gov.ro, CKAN + anexa XML) în Bilanțul național                                | ✓      |
| P11  | Deficitul trimestrial % PIB (Eurostat GFS) cu pragul Maastricht −3%                                                    | ✓      |
| P12  | Economie extinsă: ocupare, cont curent, dobânda BCE                                                                    | ✓      |
| P13  | Context salarial (LCI trimestrial + ancore SES la 4 ani) în Feliuța ta                                                 | ✓      |
| P14  | Tab „Societate”: populație, cheltuieli publice sănătate/educație, indicatori INS                                       | ✓      |
| P16  | Salariul mediu brut lunar (estimare SES+LCI) în Feliuța ta — `/api/wages/monthly`                                      | ✓      |
| P17  | Indicatori sociali live din Eurostat (mortalitate infantilă, speranța de viață, paturi)                                | ✓      |
| P18  | Reîmprospătare BNR automatizată (GitHub Action lunar, memento issue)                                                   | ✓      |
| P19  | Societate → educație (părăsire timpurie, studii terțiare)                                                              | ✓      |
| P20  | Societate → sănătate (medici la 100.000 locuitori)                                                                     | ✓      |
| P21  | Societate → demografie (vârsta mediană, migrație netă)                                                                 | ✓      |
| P22  | PIB pe locuitor pe regiunile de dezvoltare (NUTS2)                                                                     | ✓      |
| P23  | Tab nou „Energie” (preț electricitate, regenerabile, dependență de import)                                             | ✓      |
| P24  | E2E smoke (Playwright) în CI                                                                                           | ✓      |
| P25  | Prospețimea datelor (sourceUpdated pe răspunsuri Eurostat + afișat în UI)                                              | ✓      |
| P26  | A11y (skip link, nav label) + SEO (og tags)                                                                            | ✓      |
| P27  | Landing tablou: cardurile Societate / Energie / Feliuța ta + lista de endpoint-uri                                     | ✓      |
| P28  | Salariu real live (câștigul estimat deflatat cu HICP) în Feliuța ta                                                    | ✓      |
| P29  | Trend sănătate live (COFOG) + eliminarea contextului monetar static                                                    | ✓      |
| P30  | Investiții pe județe marcate onest ca estimare                                                                         | ✓      |
| P31  | Beneficiari de pensii (Eurostat `spr_pns_ben`); „pensia medie” eliminată                                               | ✓      |
| P32  | „Față de salariul mediu” derivat din date live (SES + curs ECB)                                                        | ✓      |
| P33  | sourceUpdated pe macro / wages / context + afișat în UI                                                                | ✓      |
| P34  | Tab nou „Piața muncii” (NEET, șomaj tineri, locuri vacante)                                                            | ✓      |
| P35  | Tab nou „Justiție” (omucideri, penitenciar, polițiști)                                                                 | ✓      |

## Note demo

- Cifrele din `src/data/budget2026.ts` provin din Open Budget 2026; sursele de venit sunt **estimări ilustrative** până la P2.
- i18n: mesajele sunt declarate cu macro-ul `msg` în `src/messages.ts`; cataloagele `.po` din `src/locales/` se generează cu `pnpm i18n:extract` și sunt compilate de plugin-ul Lingui pentru Vite. Locale sursă: `ro`; traduceri: `en`.
- Date reale: când BFF-ul rulează cu `DATA_SOURCE=hackforfacts` (API-ul public transparenta.eu), dashboard-ul afișează datele live; fallback-ul static rămâne activ dacă BFF-ul nu răspunde. Vezi caveat-urile din README-ul BFF-ului.

## Docker

```bash
docker build -t romania-budget-dashboard --build-arg VITE_API_BASE_URL=http://localhost:3000 .
docker run -p 8080:80 romania-budget-dashboard
```

`VITE_API_BASE_URL` este încorporat la build (Vite); nginx servește bundle-ul cu fallback SPA. Stack-ul complet (frontend + BFF) se pornește cu `docker compose` din repo-ul BFF — vezi `docker-compose.yml` acolo.

CI: `.github/workflows/ci.yml` rulează `pnpm check` + build pe fiecare PR și publică imaginea pe GHCR la push pe `main`/tag-uri `v*` (variabila de repo `VITE_API_BASE_URL` poate înlocui BFF-ul la build).

## Cloudflare (deploy principal, gratis)

Site static pe Workers Static Assets (`wrangler.toml`, fallback SPA), live la
**https://buget.cristian-nichifor.com**.

```bash
VITE_API_BASE_URL=https://api.buget.cristian-nichifor.com pnpm build
pnpm exec wrangler deploy
```

API-ul e Worker-ul din repo-ul BFF (CORS `*`, date live transparenta.eu). CI: `.github/workflows/deploy-cloudflare.yml` — build + deploy la push pe `main` (necesită secretele `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`; variabila `VITE_API_BASE_URL` e fallback-ul default). Cost: 0 — static unlimited, apeluri Worker în free tier.

## Git workflow

Conventional Commits; hooks-urile Husky rulează lint-staged (ESLint + Prettier) la commit și commitlint la mesaj.

# AGENTS.md

Convenții de lucru pentru `romania-budget-dashboard` (aliniate cu hack-for-facts-eb-client / transparenta-eu-ins-loader).

## Comenzi

- `pnpm dev` — dev server
- `pnpm check` — typecheck + lint + test + format:check (rulează întotdeauna înainte de commit)
- `pnpm test` — vitest run
- `pnpm build` — tsc -b && vite build
- `pnpm i18n:extract` — regenerează cataloagele `.po` după modificarea `src/locales/*/messages.ts`
- Deploy: imaginea se construiește cu `docker build --build-arg VITE_API_BASE_URL=... .`; stack-ul complet pornește cu `docker compose` din repo-ul BFF. CI publică imaginea pe GHCR la push pe `main`/tag-uri `v*` (variabila de repo `VITE_API_BASE_URL`).
- **Deploy Cloudflare (principal, gratis)**: `pnpm build` apoi `pnpm exec wrangler deploy` — site static pe Workers Static Assets (`wrangler.toml`, SPA fallback), publicat la https://budget.cristian-nichifor.com. API-ul bazează pe `VITE_API_BASE_URL` (default local: `http://localhost:3000`). CI: `deploy-cloudflare.yml` (push pe `main` + manual, rulează doar dacă secretul `CLOUDFLARE_API_TOKEN` e setat).

## Reguli de cod

1. **No floats pentru bani.** Orice calcul monetar folosește `decimal.js` (`Decimal`). Numerele JS apar doar la granița de afișare (charts) sau pentru procente ne-monetare. Sumele traversează granița API ca `string`.
2. **Nucleu funcțional pur.** `src/lib/*` sunt funcții pure, fără I/O, fără throw, testate unitar. `src/api` și componentele sunt shell-ul.
3. **i18n prin Lingui.** UI text prin `i18n._({ id: ... })` / `Trans`; id-urile mesajelor în `src/locales/ro/messages.ts` (sursă) + `en`. Numele proprii din date („Pensii”) rămân în fișierele de date.
4. **Date demo marcate.** Orice valoare statică are `DEMO NOTE` în comentariu sau `SourceBadge` în UI; sumele bugetare sunt `string`, nu `number`.
5. **Conventional Commits** + Husky (lint-staged: eslint --fix + prettier). ESLint: import-x, react-hooks, react-refresh.

## Unde stă ce

- Contract API: `src/api/client.ts` (Zod, HTTP + fallback); `VITE_DATA_MODE=static` folosește numai seed-uri demo.
- Date: `src/data/` (seed-uri). Componente vizuale: `src/components/charts/`. Tab-uri: `src/routes/`.

## Contribution workflow

- Read [CONTRIBUTING.md](CONTRIBUTING.md) for credential-free setup and exact checks.
- Target `dev`. Agents must never merge any PR (including `dev`) or deploy,
  even when their credentials could bypass GitHub rules. Maintainers review releases.
- CI exposes `verify`, requiring every correctness job to succeed. Publishing and
  deployment are separate; this document does not configure GitHub branch rules.
- Personal worktrees: `wt new <name> origin/dev`, under `<repo>/.worktrees/<name>`.
  Outside contributors without `wt` can use a separate clone and a feature branch.
- Keep Conventional Commits concise, imperative and lower case; do not bypass hooks.
- Preserve decimal strings at the HTTP boundary. Coordinate fixture changes with
  the companion repo; never refresh fixtures from production data.
- Edit source and checked-in fixtures; do not commit `dist/`, `coverage/`,
  `node_modules/`, `.env`, Playwright reports or Wrangler output.

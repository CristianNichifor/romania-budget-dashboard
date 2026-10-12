# Contributing

Use a feature branch from `origin/dev` and open a PR to `dev`. Agents must never
merge PRs or deploy, even with administrator credentials. Production `main`, image
publishing and Cloudflare releases are maintainer operations.

## Local setup (no credentials)

Use Node 24 (`.nvmrc`) and the pnpm version in `package.json` (`12.3.4`). Public npm
packages are sufficient; no private handbook, 1Password, Cloudflare login or API
token is needed. If your personal npm config requires authentication, use
`npm_config_userconfig=/dev/null pnpm install --frozen-lockfile`.

```sh
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev
```

The example sets `VITE_DATA_MODE=static`: the client makes no HTTP requests and
uses the labeled demo seeds. Modules without a demo dataset show their existing
empty state. This mode is for development, not a claim of current official data.
To exercise the companion BFF, run its documented static setup, set
`VITE_DATA_MODE=remote` and `VITE_API_BASE_URL=http://localhost:3000`, then restart
Vite. Some BFF modules use public upstream APIs; see its contributor guide.
Production builds continue to use remote mode unless explicitly configured.

Personal worktrees use `wt new <name> origin/dev` inside this repo, creating
`<repo>/.worktrees/<name>`. Contributors without `wt` can make a separate clone,
fetch `origin`, then `git switch -c <name> origin/dev`.

## Validation

```sh
pnpm check
pnpm build
pnpm exec playwright install chromium
pnpm e2e
```

`check` runs typecheck, ESLint, Vitest and Prettier (including `AGENTS.md`). CI also
builds the Docker image. The stable `verify` check requires `check & build`,
`e2e smoke` and `docker build` to succeed; failed, cancelled or skipped jobs fail
the aggregate. Publish/deploy jobs are excluded. E2E forces static mode.
Use `pnpm format` for formatting and run checks again before committing.

## API and source boundaries

`src/api/client.ts` owns HTTP requests, Zod validation and demo fallback. Tests
must call its exported fetch functions, not just parse an isolated schema.
`tests/api-contract.test.ts` consumes actual serialized BFF responses from
`tests/fixtures/api-contract.json`. The BFF generates these from static data and
checks them through both Fastify and Worker HTTP handlers. For a contract change,
regenerate there with `node --import tsx scripts/export-contract-fixtures.ts`,
format the fixture, copy the same JSON here and run both suites. Review the diff;
do not automatically accept a changed contract. Link the companion PR.

Money remains strings on the wire and Decimal in calculations. Test fractional
values and reject numeric money rather than silently losing precision. Keep demo
labels, source notes and localization intact. Edit `src/locales/*/messages.ts`
and run `pnpm i18n:extract` when changing messages; compiled catalogs and `dist/`
are generated output. Pure calculations belong in `src/lib/`; I/O belongs in the
API client and UI shell.

In issues describe the affected view/API, expected behavior, reproduction and
acceptance criteria. In PRs include the cause, commands/results, fixture changes,
UI evidence when relevant, and any unrun checks or environment limitations.
Use focused Conventional Commits and preserve Husky hooks. Check existing issues
and PRs for overlap before starting.

# Monorepo Setup Steps

Completed on 2026-11-25.

This document records the steps used to create the portfolio monorepo in this
repository.

## 1. Inspected the existing folder

- Confirmed the workspace contained an empty `README.md`.
- Found that Git was already initialized on `project-setup/monorepo-scaffold`
  and had a baseline commit (`0ac8222`), so the existing repository history was
  preserved.
- Checked the available toolchain: Node.js `22.22.3`, pnpm `11.5.1`, and Git.
- Checked the package registry for current stable versions before selecting
  dependencies.

## 2. Established workspace and runtime configuration

- Added `pnpm-workspace.yaml` for `apps/*` and `packages/*`.
- Added the root `package.json` with pnpm `11.5.1`, workspace scripts for
  `dev`, `build`, `lint`, `typecheck`, `test`, and `format`, plus Prettier,
  Turbo, Husky, and lint-staged.
- Added `turbo.json` task definitions: builds depend on upstream builds,
  generated `.next` cache files are excluded from outputs, and `dev` is
  persistent with caching disabled.
- Set `.nvmrc` to Node.js 24 LTS and the root Node engine requirement to
  `>=24`.
- Added `.gitignore`, `.editorconfig`, Prettier configuration, and the Husky
  pre-commit hook that runs lint-staged.

## 3. Created the application and internal packages

- Created `apps/portfolio` as a Next.js App Router application with TypeScript
  strict mode and no `src/` directory.
- Configured Tailwind CSS v4 through its PostCSS plugin and CSS import.
- Added a typed `next.config.ts` with `transpilePackages` for all four internal
  packages.
- Created `packages/ui`, `packages/content`, `packages/lib`, and
  `packages/config` with the requested `@repo/*` package names.
- Added a small server-rendered portfolio page that reads copy and project
  data from `@repo/content`, uses a shared button from `@repo/ui`, and uses a
  year-range helper from `@repo/lib`.
- Exported shared `base`, `nextjs`, and `react-library` TypeScript configs and
  shared flat ESLint configuration from `@repo/config`.

## 4. Added architecture documentation

- Replaced the empty root README with requirements, quick-start instructions,
  and workspace commands.
- Added `CLAUDE.md` to document the Multi-Zones ownership and deployment model,
  shared content/UI rules, Server Component and accessibility standards, and
  cross-zone link behavior.
- Added [ADR 0001](./adr/0001-multi-zones-monorepo.md), documenting why
  Multi-Zones with Turborepo was selected over a single application and Module
  Federation.

## 5. Installed dependencies and resolved compatibility issues

- Ran `pnpm install` to create `pnpm-lock.yaml` and install the workspace.
- Used Next.js `16.4.6`, React `19.3.1`, Tailwind CSS `4.3.5`, and Turbo
  `2.11.13`.
- Initially selected TypeScript 7, then changed to TypeScript `6.0.3` after
  peer checks showed `typescript-eslint` requires TypeScript below `6.1.0`.
- Corrected package TypeScript output paths so package builds emit to each
  package's `dist/` folder rather than the shared config folder.
- Kept Next-specific ESLint rules scoped to the app after linting shared
  packages revealed warnings about missing Next.js Pages directories.
- Added `*.tsbuildinfo` to `.gitignore` and removed generated JavaScript and
  declaration files that had been emitted into package source folders during
  early validation.

## 6. Validated the workspace

Ran the following commands successfully:

```sh
pnpm install
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm peers check
```

The test command ran two passing tests for the shared year-range helper. The
build generated the portfolio's static `/` route. The pre-commit hook also ran
Prettier and ESLint successfully during the scaffold commit.

The available environment used Node.js `22.22.3`, so pnpm printed an engine
warning against the configured Node.js `>=24` requirement. The requested
commands nevertheless completed successfully; use Node.js 24 LTS for normal
development.

## 7. Preserved history and committed the work

The repository already had an initial baseline commit, so no Git
reinitialization or history rewrite was performed. The scaffold and subsequent
generated-file cleanup were committed as:

- `7e5ba99` — `Create Turborepo portfolio workspace`
- `f005627` — `Ignore generated TypeScript outputs`

# Portfolio Platform

## Architecture

This is a Next.js Multi-Zones microfrontend platform managed as a pnpm workspace and Turborepo.

- `apps/portfolio` is the main zone and owns `/`, `/projects`, and `/resume`. It will hold the rewrites that route requests to other zones.
- `apps/blog` will be added later as a separate zone with `basePath: "/blog"`.
- Deploy each app as its own Vercel project.
- Shared content belongs in `@repo/content`; never hardcode site content in components.
- Shared components belong in `@repo/ui`.
- Use Server Components by default. Add `"use client"` only when browser-side interactivity requires it.
- Meet WCAG AA accessibility requirements and target Lighthouse scores of 95 or higher.
- Use `<a>` rather than `next/link` for links that cross zone boundaries.

## Commands

Run these commands from the repository root:

```sh
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```

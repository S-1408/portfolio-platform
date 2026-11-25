## Summary

<!-- What does this change and why? Link issues with "Closes #123". -->

## Type of change

- [ ] Feature
- [ ] Bug fix
- [ ] Content update (`@repo/content`)
- [ ] Refactor / chore
- [ ] CI / deployment

## Screenshots

<!-- For UI changes: before/after, light and dark theme, mobile and desktop. -->

## Checklist

- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test` pass locally
- [ ] `pnpm e2e` passes (for UI or routing changes)
- [ ] Site copy lives in `@repo/content`, not hardcoded in components
- [ ] Shared components live in `@repo/ui`; `"use client"` only where interactivity needs it
- [ ] Links that cross zones (e.g. `/blog`) use `<a>`, not `next/link`
- [ ] Keyboard and screen reader checked; contrast meets WCAG AA in both themes
- [ ] New env vars are added to `apps/portfolio/.env.example`, `turbo.json` and `docs/deployment.md`

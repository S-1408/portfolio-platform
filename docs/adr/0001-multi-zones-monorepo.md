# ADR 0001: Multi-Zones with Turborepo

- Status: Accepted
- Date: 2026-11-25

## Context

The portfolio needs independently deployable site areas, shared UI and content, and a clear path to add a blog without making the main application a single deployment unit.

## Decision

Use Next.js Multi-Zones in a pnpm workspace coordinated by Turborepo. The portfolio is the main zone, and the future blog is a separate Next.js app mounted at `/blog`. Each app deploys as a separate Vercel project. Shared code lives in workspace packages.

## Alternatives considered

### Single Next.js application

A single app is simpler initially, but it couples the blog's release and runtime to the portfolio. Multi-Zones allows the blog to be introduced and deployed independently while retaining a shared monorepo for code and tooling.

### Module Federation

Module Federation adds runtime integration, version negotiation, and operational complexity for independently composed frontends. The zones communicate through normal navigation and shared workspace packages instead, which fits the need for independently deployable Next.js apps without a runtime module-loading layer.

## Consequences

- Zone apps can be built and deployed independently while sharing versioned-in-repo packages and tooling.
- Cross-zone navigation must use ordinary anchors so the browser navigates between deployments.
- The main zone owns the routing rewrites for requests to other zones, and deployment configuration must keep those rewrites aligned with the Vercel projects.
- Workspace task dependencies and package boundaries are managed by pnpm and Turborepo.

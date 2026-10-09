# Implementation Plan: Shopify Store Connection

**Branch**: `002-shopify-store-integration` | **Date**: 2026-10-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-shopify-store-integration/spec.md`

## Summary

Build the store connection and sync-status UI as Next.js App Router routes. The owner can enter a store name and Shopify URL, run a simulated **Connect Store** flow, and review connected stores with their synced entities. The Shopify GraphQL API and webhooks are represented only as a preview of future behavior. No backend or API routes.

## Technical Context

**Language/Version**: TypeScript 5.x on Next.js 15 (App Router), React 19

**Primary Dependencies**: `next`, `react`, `react-dom`, `tailwindcss`

**Storage**: N/A — typed mock data in `frontend/lib/data/stores.ts`; optional `localStorage` for a mock connected flag

**Testing**: Manual browser review via `npm run dev`; `npm run build` must type-check

**Target Platform**: Modern desktop browsers

**Project Type**: Frontend-only Next.js web app (markup phase)

**Performance Goals**: Instant local rendering

**Constraints**: No backend, no Shopify API, no API routes, no server actions

**Scale/Scope**: 2 routes (`/settings/store`, `/settings/stores`) + a sync progress component

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| I. Client-Reviewable Prototype | PASS | Connect and sync are fully simulated; no network. |
| II. UI Consistency | PASS | Uses shared shell, `ui` components, and status badges. |
| III. Frontend-Only, Not Backend | PASS | Client components only; no API routes or server actions. |
| IV. Mock-Data Separation | PASS | Stores and sync runs in `lib/data`; accessed via `lib/store.ts`; empty/loading/error states defined. |
| V. Accessibility & Clarity | PASS | Labeled inputs, focus-visible controls, advisory text for URL issues. |

No violations.

## Project Structure

### Documentation (this feature)

```text
specs/002-shopify-store-integration/
├── spec.md
├── plan.md
├── mock-data.md
├── tasks.md
└── checklists/requirements.md
```

### Source Code (repository root)

```text
frontend/
├── app/
│   └── settings/
│       ├── store/page.tsx        # connect form + "what will be synced"
│       └── stores/page.tsx       # list + detail of connected stores
├── components/
│   ├── ui/                       # reuse Badge, Card, Button, Input
│   └── store/SyncProgress.tsx    # connecting/importing progress
└── lib/
    ├── types.ts                  # Store, SyncRun types (extend)
    ├── data/stores.ts            # stores + syncEntities mock
    └── store.ts                  # mock connect() + sync simulation
```

**Structure Decision**: Store routes live under `app/settings/`; a feature-scoped component lives in `components/store/` while shared primitives stay in `components/ui/`.

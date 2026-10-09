# Implementation Plan: Returns & Refunds

**Branch**: `005-returns-refunds` | **Date**: 2026-10-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-returns-refunds/spec.md`

## Summary

Build the returns UI as Next.js App Router routes: a returns list with reason/status filters and a return detail that shows the courier-cost deduction from the 25% advance and the net amount returned, plus per-item restock decisions. The displayed arithmetic is computed client-side from mock values. No backend, no inventory writes.

## Technical Context

**Language/Version**: TypeScript 5.x on Next.js 15 (App Router), React 19

**Primary Dependencies**: `next`, `react`, `react-dom`, `tailwindcss`

**Storage**: N/A — typed mock data in `frontend/lib/data/returns.ts`

**Testing**: Manual browser review via `npm run dev`; `npm run build` must type-check

**Target Platform**: Modern desktop browsers

**Project Type**: Frontend-only Next.js web app (markup phase)

**Performance Goals**: Instant local rendering

**Constraints**: No backend, no inventory writes, no API routes

**Scale/Scope**: 2 routes (`/returns`, `/returns/[id]`)

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| I. Client-Reviewable Prototype | PASS | Refund math and restock toggles simulated over mock data. |
| II. UI Consistency | PASS | Shared table/badge components; reason and status terms match source docs. |
| III. Frontend-Only, Not Backend | PASS | Restock toggles are client state only; no persistence. |
| IV. Mock-Data Separation | PASS | Returns in `lib/data`; refund derived via `lib/returns.ts`; shortfall/missing-cost states defined. |
| V. Accessibility & Clarity | PASS | Labels for money lines; toggles are real inputs with labels; text statuses. |

No violations.

## Project Structure

### Documentation (this feature)

```text
specs/005-returns-refunds/
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
│   └── returns/
│       ├── page.tsx              # returns table + filters
│       └── [id]/page.tsx         # advance − courier = returned + restock toggles
├── components/
│   ├── ui/                       # reuse Card, Badge
│   └── returns/
│       ├── ReturnsTable.tsx
│       └── RestockToggle.tsx     # "use client"
└── lib/
    ├── types.ts                  # Return, ReturnItem types
    ├── data/returns.ts           # returns mock
    └── returns.ts                # computeRefund(), restock status helpers
```

**Structure Decision**: Return routes live in `app/returns/`. The refund calculation reuses `computeSplit` from feature 004.

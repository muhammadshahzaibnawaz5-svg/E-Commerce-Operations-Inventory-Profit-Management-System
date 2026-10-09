# Implementation Plan: Payments & Settlements

**Branch**: `004-payments-settlements` | **Date**: 2026-10-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-payments-settlements/spec.md`

## Summary

Build the payments UI as Next.js App Router routes: a payments list with type/status filters and summary cards, and a payment detail that visualizes the 25% on-delivery / 75% next-day split as two tranches. The split is computed client-side from mock amounts. No backend, no payment gateway.

## Technical Context

**Language/Version**: TypeScript 5.x on Next.js 15 (App Router), React 19

**Primary Dependencies**: `next`, `react`, `react-dom`, `tailwindcss`

**Storage**: N/A — typed mock data in `frontend/lib/data/payments.ts`

**Testing**: Manual browser review via `npm run dev`; `npm run build` must type-check

**Target Platform**: Modern desktop browsers

**Project Type**: Frontend-only Next.js web app (markup phase)

**Performance Goals**: Instant local rendering

**Constraints**: No backend, no payment gateway, no API routes

**Scale/Scope**: 2 routes (`/payments`, `/payments/[id]`) + summary cards

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| I. Client-Reviewable Prototype | PASS | Split computation and status are simulated over mock data. |
| II. UI Consistency | PASS | Shared table, card, and badge components; type/status vocabulary consistent. |
| III. Frontend-Only, Not Backend | PASS | Pure computation in `lib/payments.ts`; no API routes. |
| IV. Mock-Data Separation | PASS | Payments in `lib/data`; split derived via helper; pending/partial/empty states defined. |
| V. Accessibility & Clarity | PASS | Amounts labeled; status conveyed by text; focus-visible filters. |

No violations.

## Project Structure

### Documentation (this feature)

```text
specs/004-payments-settlements/
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
│   └── payments/
│       ├── page.tsx              # payments table + summary cards + filters
│       └── [id]/page.tsx         # 25% / 75% tranche breakdown
├── components/
│   ├── ui/                       # reuse Card, Badge, Table primitives
│   └── payments/
│       ├── PaymentsTable.tsx     # "use client" filters
│       ├── SummaryCards.tsx
│       └── TrancheCard.tsx
└── lib/
    ├── types.ts                  # Payment, SettlementTranche types
    ├── data/payments.ts          # payments mock
    └── payments.ts               # computeSplit(), getSettlementStatus(), getSummary()
```

**Structure Decision**: Payment routes live in `app/payments/`. The 25%/75% split is a pure function in `lib/payments.ts` reused by features 005 and 008.

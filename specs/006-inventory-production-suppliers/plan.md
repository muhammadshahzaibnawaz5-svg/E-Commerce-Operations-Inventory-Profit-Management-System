# Implementation Plan: Inventory, Production & Suppliers

**Branch**: `006-inventory-production-suppliers` | **Date**: 2026-10-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-inventory-production-suppliers/spec.md`

## Summary

Build the inventory UI as Next.js App Router routes: raw materials, packaging, finished goods, a production-run screen that simulates stock consumption and output, and supplier records with purchase history. Low-stock alerts use a shared badge. Updates live in client-side state only. No backend or database.

## Technical Context

**Language/Version**: TypeScript 5.x on Next.js 15 (App Router), React 19

**Primary Dependencies**: `next`, `react`, `react-dom`, `tailwindcss`

**Storage**: N/A — typed mock data in `frontend/lib/data/`; session-only updates in React state

**Testing**: Manual browser review via `npm run dev`; `npm run build` must type-check

**Target Platform**: Modern desktop browsers

**Project Type**: Frontend-only Next.js web app (markup phase)

**Performance Goals**: Instant local rendering

**Constraints**: No backend, no real inventory writes, no API routes

**Scale/Scope**: 6 routes (`/inventory/materials`, `/inventory/packaging`, `/inventory/finished-goods`, `/inventory/production`, `/suppliers`, `/suppliers/[id]`)

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| I. Client-Reviewable Prototype | PASS | Production runs mutate client state only. |
| II. UI Consistency | PASS | Shared table, badge, and form components; "Low stock" text labels. |
| III. Frontend-Only, Not Backend | PASS | In-memory store via React context; no persistence. |
| IV. Mock-Data Separation | PASS | All inventory/supplier data in `lib/data`; empty/low-stock/insufficient states defined. |
| V. Accessibility & Clarity | PASS | Labeled inputs, focus-visible controls, text-based alerts. |

No violations.

## Project Structure

### Documentation (this feature)

```text
specs/006-inventory-production-suppliers/
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
│   ├── inventory/
│   │   ├── materials/page.tsx
│   │   ├── packaging/page.tsx
│   │   ├── finished-goods/page.tsx
│   │   └── production/page.tsx
│   └── suppliers/
│       ├── page.tsx
│       └── [id]/page.tsx
├── components/
│   ├── ui/                       # reuse Table, Badge, Input, Button
│   └── inventory/
│       ├── StockTable.tsx
│       └── ProductionForm.tsx    # "use client"
└── lib/
    ├── types.ts                  # RawMaterial, PackagingMaterial, FinishedGood, ProductionRun, StockMovement, Supplier, Purchase
    ├── data/
    │   ├── inventory.ts
    │   └── suppliers.ts
    └── inventory.ts              # isLowStock(), applyProductionRun()
```

**Structure Decision**: Inventory routes live in `app/inventory/`; supplier routes in `app/suppliers/`. Low-stock logic is a shared helper in `lib/inventory.ts`.

# Implementation Plan: Advertising & Expenses

**Branch**: `007-advertising-expenses` | **Date**: 2026-10-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-advertising-expenses/spec.md`

## Summary

Build the advertising and expenses UI as Next.js App Router routes: advertising spend by campaign/date (Meta/TikTok) with a manual cost entry form, and a general expenses ledger (category, amount, date, note) with category filtering. Totals are computed client-side from mock data. No backend, no Meta/TikTok API.

## Technical Context

**Language/Version**: TypeScript 5.x on Next.js 15 (App Router), React 19

**Primary Dependencies**: `next`, `react`, `react-dom`, `tailwindcss`

**Storage**: N/A — typed mock data in `frontend/lib/data/`

**Testing**: Manual browser review via `npm run dev`; `npm run build` must type-check

**Target Platform**: Modern desktop browsers

**Project Type**: Frontend-only Next.js web app (markup phase)

**Performance Goals**: Instant local rendering; client-side date filtering

**Constraints**: No backend, no Meta/TikTok API, no API routes

**Scale/Scope**: 3 routes (`/marketing/ads`, `/expenses`, `/expenses/new`)

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| I. Client-Reviewable Prototype | PASS | Manual entry mutates client state; totals recomputed live. |
| II. UI Consistency | PASS | Shared table, form, modal, and badge components. |
| III. Frontend-Only, Not Backend | PASS | Client forms only; no persistence beyond session. |
| IV. Mock-Data Separation | PASS | Campaigns, ad spend, expenses in `lib/data`; empty states defined. |
| V. Accessibility & Clarity | PASS | Labeled forms, focus-visible controls, validation messages as text. |

No violations.

## Project Structure

### Documentation (this feature)

```text
specs/007-advertising-expenses/
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
│   ├── marketing/
│   │   └── ads/page.tsx          # ad spend by campaign/date + add-cost modal
│   └── expenses/
│       ├── page.tsx              # expenses ledger + category filter
│       └── new/page.tsx          # add expense form
├── components/
│   ├── ui/                       # reuse Card, Badge, Input, Button, Modal
│   └── marketing/
│       ├── AdSpendTable.tsx      # "use client"
│       └── AddCostModal.tsx      # "use client"
└── lib/
    ├── types.ts                  # AdCampaign, AdSpend, Expense types
    ├── data/
    │   ├── advertising.ts
    │   └── expenses.ts
    └── expenses.ts               # filterByDateRange(), sumTotals(), validateExpense()
```

**Structure Decision**: Advertising lives under `app/marketing/`; the expense ledger under `app/expenses/`. A shared modal/validation helper is used for the add forms.

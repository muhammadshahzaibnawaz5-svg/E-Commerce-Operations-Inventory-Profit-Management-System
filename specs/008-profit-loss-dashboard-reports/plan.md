# Implementation Plan: Profit & Loss, Dashboard & Reports

**Branch**: `008-profit-loss-dashboard-reports` | **Date**: 2026-10-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/008-profit-loss-dashboard-reports/spec.md`

## Summary

Build the P&L statement (overall and per product), the dashboard (cards + simple charts), and the reports screen (date filters + export controls) as Next.js App Router routes. All figures are derived client-side from the mock data of the other features, following the formulas in Specifications §4.3. No backend; export is simulated.

## Technical Context

**Language/Version**: TypeScript 5.x on Next.js 15 (App Router), React 19

**Primary Dependencies**: `next`, `react`, `react-dom`, `tailwindcss`; charts drawn with inline SVG (no chart library)

**Storage**: N/A — figures derived from `frontend/lib/data/`

**Testing**: Manual browser review via `npm run dev`; verify formula consistency against the worked example; `npm run build` must type-check

**Target Platform**: Modern desktop browsers

**Project Type**: Frontend-only Next.js web app (markup phase)

**Performance Goals**: Instant rendering; recompute totals on filter change

**Constraints**: No backend, no charting library, no API routes

**Scale/Scope**: 3 routes (`/dashboard`, `/profit-loss`, `/reports`)

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| I. Client-Reviewable Prototype | PASS | All figures derived from mock data; export simulated. |
| II. UI Consistency | PASS | Shared cards, tables, and badges; financial terminology matches source docs. |
| III. Frontend-Only, Not Backend | PASS | Pure derivation functions; no API routes. |
| IV. Mock-Data Separation | PASS | Metrics derived from `lib/data`, not hard-coded; empty states for no-data ranges. |
| V. Accessibility & Clarity | PASS | Labels and numbers readable; loss indicated by text as well as color; chart alt text. |

No violations.

## Project Structure

### Documentation (this feature)

```text
specs/008-profit-loss-dashboard-reports/
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
│   ├── dashboard/page.tsx        # summary cards + profit/expense charts
│   ├── profit-loss/page.tsx      # P&L statement + per-product table
│   └── reports/page.tsx          # date filters + report table + export controls
├── components/
│   ├── ui/                       # reuse Card, Badge, Table primitives
│   ├── finance/
│   │   ├── MetricCard.tsx
│   │   ├── PLStatement.tsx
│   │   └── ReportFilters.tsx     # "use client"
│   └── charts/
│       ├── BarChart.tsx          # inline SVG
│       └── LineChart.tsx         # inline SVG
└── lib/
    ├── types.ts                  # ProfitLossStatement, ProductProfit, DashboardMetric, Report
    └── profit.ts                 # computeProfitLoss(), computeProductProfit(), getDashboardMetrics()
```

**Structure Decision**: Financial routes live under `app/dashboard/`, `app/profit-loss/`, and `app/reports/`. A single `computeProfitLoss()` in `lib/profit.ts` is shared by all three to guarantee consistent numbers.

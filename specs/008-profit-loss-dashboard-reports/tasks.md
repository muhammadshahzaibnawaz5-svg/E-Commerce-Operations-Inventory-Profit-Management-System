# Tasks: Profit & Loss, Dashboard & Reports

**Input**: Design documents from `/specs/008-profit-loss-dashboard-reports/`

**Prerequisites**: plan.md, spec.md, all operational features (003–007)

## Phase 1: Setup

- [ ] T001 [P] Extend `frontend/lib/types.ts` with `ProfitLossStatement`, `ProductProfit`, `DashboardMetric`, `Report` types
- [ ] T002 [P] Add metric-card, statement, and chart styling via Tailwind classes

## Phase 2: Foundational

- [ ] T003 Create `frontend/lib/profit.ts` with `computeProfitLoss(rows)` (Net Revenue, COGS, Gross, Selling, Operating, Net)
- [ ] T004 Implement `computeProductProfit()` returning per-product rows
- [ ] T005 Create `components/charts/BarChart.tsx` and `LineChart.tsx` (inline SVG)

**Checkpoint**: P&L math + chart components ready and consistent across routes.

## Phase 3: User Story 1 - Profit & Loss (Priority: P1) 🎯 MVP

**Goal**: Show net profit overall and per product.

**Independent Test**: Open `/profit-loss`; verify the statement chain and per-product table.

- [ ] T006 [P] [US1] Create `app/profit-loss/page.tsx` with the statement layout
- [ ] T007 [US1] Create `components/finance/PLStatement.tsx` rendering Net Revenue → COGS → Gross Profit → Selling Costs → Operating Expenses → Net Profit
- [ ] T008 [US1] Render the per-product profit table
- [ ] T009 [US1] Render the loss state when net profit is negative

**Checkpoint**: P&L complete.

## Phase 4: User Story 2 - Dashboard (Priority: P2)

**Goal**: At-a-glance cards and charts.

**Independent Test**: Open `/dashboard`; confirm cards + charts.

- [ ] T010 [P] [US2] Create `app/dashboard/page.tsx` with metric cards
- [ ] T011 [US2] Create `components/finance/MetricCard.tsx` and render orders, deliveries, returns, payments, expenses, and net profit
- [ ] T012 [US2] Render at least one chart (profit over time and/or expense by category)
- [ ] T013 [US2] Handle empty metrics (0 / empty chart with note)

**Checkpoint**: Dashboard complete.

## Phase 5: User Story 3 - Reports & export (Priority: P3)

**Goal**: Date-filtered reports with export controls.

**Independent Test**: Open `/reports`; apply a range; click export.

- [ ] T014 [P] [US3] Create `app/reports/page.tsx` with a report table
- [ ] T015 [US3] Create `components/finance/ReportFilters.tsx` (`"use client"`) with a date-range filter and recomputed totals
- [ ] T016 [US3] Add export format controls and the "Demo only — no file generated" notice
- [ ] T017 [US3] Add the empty state for ranges with no data

**Checkpoint**: All three stories functional.

## Phase 6: Polish

- [ ] T018 [P] Verify formula consistency (Gross = Net Revenue − COGS, etc.) across routes
- [ ] T019 Add `[NEEDS CLARIFICATION]` notes: worked-example figure (item 10), revenue timing (item 6), export formats (item 7)
- [ ] T020 Accessibility pass: number tables, chart alt text, loss indicated by text
- [ ] T021 Ensure `npm run build` passes with no type errors

## Dependencies & Execution Order

Setup → Foundational → US1 → US2 → US3. US2 and US3 reuse the US1 calculator; US3 depends on the statement being defined.

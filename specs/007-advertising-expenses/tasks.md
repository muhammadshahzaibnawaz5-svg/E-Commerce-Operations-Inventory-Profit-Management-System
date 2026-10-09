# Tasks: Advertising & Expenses

**Input**: Design documents from `/specs/007-advertising-expenses/`

**Prerequisites**: plan.md, spec.md, shared shell (001)

## Phase 1: Setup

- [ ] T001 [P] Extend `frontend/lib/types.ts` with `AdCampaign`, `AdSpend`, `AdPlatform`, `Expense`, `ExpenseType` types
- [ ] T002 [P] Create `frontend/lib/data/advertising.ts` (`adCampaigns`, `adSpend`)
- [ ] T003 [P] Create `frontend/lib/data/expenses.ts` (`expenses`, `expenseCategories`)
- [ ] T004 [P] Add modal and form styling via a shared `components/ui/Modal.tsx`

## Phase 2: Foundational

- [ ] T005 Create `frontend/lib/expenses.ts` with `filterByDateRange()`, `sumTotals()`, and `validateExpense()`

**Checkpoint**: Filtering + validation helpers ready.

## Phase 3: User Story 1 - Advertising spend (Priority: P1) 🎯 MVP

**Goal**: View ad spend by campaign/date.

**Independent Test**: Open `/marketing/ads`, apply a date range.

- [ ] T006 [P] [US1] Create `app/marketing/ads/page.tsx`
- [ ] T007 [US1] Create `components/marketing/AdSpendTable.tsx` (`"use client"`) with platform badge, campaign, date, and spend per row
- [ ] T008 [US1] Implement the date-range filter with a period total and empty state

**Checkpoint**: Advertising view functional.

## Phase 4: User Story 2 - Manual ad cost (Priority: P2)

**Goal**: Add an advertising cost manually.

**Independent Test**: Add a manual cost and confirm it appears in the table.

- [ ] T009 [US2] Create `components/marketing/AddCostModal.tsx` (`"use client"`) with platform, campaign, date, amount, and note
- [ ] T010 [US2] Validate required fields and amount > 0
- [ ] T011 [US2] Append the new cost and recompute the total; flag possible duplicates

**Checkpoint**: Manual ad cost works.

## Phase 5: User Story 3 - Expenses ledger (Priority: P3)

**Goal**: View and add general expenses.

**Independent Test**: Open `/expenses`, add an expense.

- [ ] T012 [P] [US3] Create `app/expenses/page.tsx` with the ledger table
- [ ] T013 [P] [US3] Create `app/expenses/new/page.tsx` add-expense form
- [ ] T014 [US3] Implement the category filter with category totals
- [ ] T015 [US3] Append new expenses to the list and persist in-session

**Checkpoint**: All three stories functional.

## Phase 6: Polish

- [ ] T016 [P] Reject zero/negative amounts and missing dates
- [ ] T017 Add `[NEEDS CLARIFICATION]` notes for TikTok API vs manual (item 3) and expense categories/export (item 7)
- [ ] T018 Accessibility pass on modal, filters, and forms
- [ ] T019 Ensure `npm run build` passes with no type errors

## Dependencies & Execution Order

Setup → Foundational → US1 → US2 → US3. US2 extends US1's table; US3 is independent but shares helpers.

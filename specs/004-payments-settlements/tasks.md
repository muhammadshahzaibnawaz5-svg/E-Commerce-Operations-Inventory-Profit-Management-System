# Tasks: Payments & Settlements

**Input**: Design documents from `/specs/004-payments-settlements/`

**Prerequisites**: plan.md, spec.md, orders/delivery (003)

## Phase 1: Setup

- [ ] T001 [P] Extend `frontend/lib/types.ts` with `Payment`, `PaymentKind`, `SettlementStatus`, `SettlementTranche` types
- [ ] T002 [P] Create `frontend/lib/data/payments.ts` with the `payments` mock array
- [ ] T003 [P] Add summary-card and tranche styling via Tailwind classes in the components

## Phase 2: Foundational

- [ ] T004 Create `frontend/lib/payments.ts` with `computeSplit(amount)` (25% / 75%), `getTranches(payment)`, `getSettlementStatus(payment)`, and `getSummary(payments)`

**Checkpoint**: Split + status logic available to list and detail.

## Phase 3: User Story 1 - Payments list (Priority: P1) 🎯 MVP

**Goal**: Browse and filter payments.

**Independent Test**: Open `/payments`, filter to "Pending".

- [ ] T005 [P] [US1] Create `app/payments/page.tsx` (server component) loading payments via `getSummary()`/data
- [ ] T006 [US1] Create `components/payments/PaymentsTable.tsx` (`"use client"`) rendering order, customer, type, amount, status
- [ ] T007 [US1] Implement type + status filters with result count and empty state

**Checkpoint**: Payments list functional.

## Phase 4: User Story 2 - Payment detail & split (Priority: P2)

**Goal**: Show the 25% / 75% settlement for an order.

**Independent Test**: Open `/payments/pay_1001`.

- [ ] T008 [P] [US2] Create `app/payments/[id]/page.tsx` with two tranche cards
- [ ] T009 [US2] Create `components/payments/TrancheCard.tsx` showing share, amount, due date, status
- [ ] T010 [US2] Handle awaiting-delivery (no tranches) and partial states
- [ ] T011 [US2] Add a note linking the 25% advance adjustment to returns handling (feature 005)

**Checkpoint**: Split visualization complete.

## Phase 5: User Story 3 - Summary totals (Priority: P3)

**Goal**: Received / pending / settled totals.

**Independent Test**: Confirm the three summary cards on `/payments`.

- [ ] T012 [US3] Create `components/payments/SummaryCards.tsx` for Received, Pending, and Settled
- [ ] T013 [US3] Recompute summary when filters change (or keep totals global — document choice)

**Checkpoint**: Summary visible.

## Phase 6: Polish

- [ ] T014 [P] Verify amounts are never blank (show "0")
- [ ] T015 Add `[NEEDS CLARIFICATION]` note on "next day" timing (Specifications §9 item 6)
- [ ] T016 Accessibility pass on filters and tranche cards
- [ ] T017 Ensure `npm run build` passes with no type errors

## Dependencies & Execution Order

Setup → Foundational → US1 → US2 → US3. US3 depends on US1's rendering.

## Notes

- BR-03 (25% on delivery / 75% next day) is the central rule and is implemented once in `computeSplit`.

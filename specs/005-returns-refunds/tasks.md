# Tasks: Returns & Refunds

**Input**: Design documents from `/specs/005-returns-refunds/`

**Prerequisites**: plan.md, spec.md, orders (003), payments (004)

## Phase 1: Setup

- [ ] T001 [P] Extend `frontend/lib/types.ts` with `Return`, `ReturnItem`, `ReturnReason`, `RestockStatus` types
- [ ] T002 [P] Create `frontend/lib/data/returns.ts` with the `returns` mock array
- [ ] T003 [P] Add reason/restock badge variants in `components/ui/Badge.tsx`

## Phase 2: Foundational

- [ ] T004 Create `frontend/lib/returns.ts` with `computeRefund(advance, courierCost)` and restock-status transition helpers

**Checkpoint**: Refund + restock logic available.

## Phase 3: User Story 1 - Returns list (Priority: P1) 🎯 MVP

**Goal**: Browse and filter returns.

**Independent Test**: Open `/returns`, filter to "Failed Delivery".

- [ ] T005 [P] [US1] Create `app/returns/page.tsx` (server component) loading returns
- [ ] T006 [US1] Create `components/returns/ReturnsTable.tsx` (`"use client"`) rendering order, customer, reason, courier, refund amount, restock status
- [ ] T007 [US1] Implement reason + restock-status filters with count and empty state

**Checkpoint**: Returns list functional.

## Phase 4: User Story 2 - Deduction from the 25% advance (Priority: P2)

**Goal**: Show advance − courier = returned.

**Independent Test**: Open `/returns/ret_1001`.

- [ ] T008 [P] [US2] Create `app/returns/[id]/page.tsx` with the money breakdown
- [ ] T009 [US2] Render 25% advance, deducted courier cost, and net amount returned
- [ ] T010 [US2] Handle the shortfall state (returned = 0 with explanation)
- [ ] T011 [US2] Handle missing courier cost (block refund figure with a note)
- [ ] T012 [US2] Link the detail back to the related payment (feature 004)

**Checkpoint**: Deduction visualization complete.

## Phase 5: User Story 3 - Restock decisions (Priority: P3)

**Goal**: Mark items sellable / not sellable.

**Independent Test**: Toggle restock on the return detail and confirm the list state updates.

- [ ] T013 [US3] Create `components/returns/RestockToggle.tsx` (`"use client"`) with per-item "Inspected & sellable" toggles
- [ ] T014 [US3] Update restock status to Restocked / Written off based on the toggle
- [ ] T015 [US3] Show restock status on the returns list

**Checkpoint**: All three stories functional.

## Phase 6: Polish

- [ ] T016 [P] Verify refund arithmetic for all mock rows
- [ ] T017 Add `[NEEDS CLARIFICATION]` note about refunds when no advance was collected (Specifications §9 item 6)
- [ ] T018 Accessibility pass on filters and toggles
- [ ] T019 Ensure `npm run build` passes with no type errors

## Dependencies & Execution Order

Setup → Foundational → US1 → US2 → US3. US3 updates the same records shown by US1.

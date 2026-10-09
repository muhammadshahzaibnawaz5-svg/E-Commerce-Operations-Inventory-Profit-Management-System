# Tasks: Inventory, Production & Suppliers

**Input**: Design documents from `/specs/006-inventory-production-suppliers/`

**Prerequisites**: plan.md, spec.md, store context (002)

## Phase 1: Setup

- [ ] T001 [P] Extend `frontend/lib/types.ts` with `StockItem`, `FinishedGood`, `ProductionRun`, `Supplier`, `Purchase` types
- [ ] T002 [P] Create `frontend/lib/data/inventory.ts` (`rawMaterials`, `packagingMaterials`, `finishedGoods`, `productionRuns`)
- [ ] T003 [P] Create `frontend/lib/data/suppliers.ts` (`suppliers`, `purchases`)
- [ ] T004 [P] Add a low-stock badge and stock-bar style in `components/ui/Badge.tsx` / Tailwind

## Phase 2: Foundational

- [ ] T005 Create `frontend/lib/inventory.ts` with `isLowStock(item)` and `applyProductionRun(run)`
- [ ] T006 Create an `InventoryProvider` (React context, `"use client"`) so production changes persist across inventory routes in-session

**Checkpoint**: Shared inventory rendering + low-stock logic ready.

## Phase 3: User Story 1 - Stock tracking (Priority: P1) 🎯 MVP

**Goal**: View raw, packaging, and finished stock.

**Independent Test**: Open the three inventory routes and confirm quantities + low-stock badges.

- [ ] T007 [P] [US1] Create `app/inventory/materials/page.tsx`
- [ ] T008 [P] [US1] Create `app/inventory/packaging/page.tsx`
- [ ] T009 [P] [US1] Create `app/inventory/finished-goods/page.tsx`
- [ ] T010 [US1] Create `components/inventory/StockTable.tsx` with purchased / used / remaining columns and low-stock badges
- [ ] T011 [US1] Add a Shopify-inventory reflection note on finished goods

**Checkpoint**: Stock visibility complete.

## Phase 4: User Story 2 - Production run (Priority: P2)

**Goal**: Record production and update stock.

**Independent Test**: Open `/inventory/production`, submit a run, see stock change.

- [ ] T012 [P] [US2] Create `app/inventory/production/page.tsx`
- [ ] T013 [US2] Create `components/inventory/ProductionForm.tsx` (`"use client"`) with product, quantity, and materials-consumed inputs
- [ ] T014 [US2] Add a live "impact preview" (materials − / finished +)
- [ ] T015 [US2] Validate sufficient raw material and block with an explanatory error
- [ ] T016 [US2] Apply the run to the context store and list the run history

**Checkpoint**: Production simulation complete.

## Phase 5: User Story 3 - Suppliers & purchases (Priority: P3)

**Goal**: Supplier records and purchase history.

**Independent Test**: Open `/suppliers` and `/suppliers/sup_1`.

- [ ] T017 [P] [US3] Create `app/suppliers/page.tsx`
- [ ] T018 [P] [US3] Create `app/suppliers/[id]/page.tsx` with purchase history
- [ ] T019 [US3] Add a "record purchase" form that appends to history and updates the total

**Checkpoint**: All three stories functional.

## Phase 6: Polish

- [ ] T020 [P] Verify negative/zero quantity inputs are rejected
- [ ] T021 Add `[NEEDS CLARIFICATION]` notes for supplier/COGS treatment (item 4), packaging in COGS (item 5), and warehouses (item 8)
- [ ] T022 Accessibility pass on inventory tables and the production form
- [ ] T023 Ensure `npm run build` passes with no type errors

## Dependencies & Execution Order

Setup → Foundational → US1 → US2 → US3. US2 mutates the state rendered by US1.

# Tasks: Order, Delivery & Courier Management

**Input**: Design documents from `/specs/003-order-delivery-courier/`

**Prerequisites**: plan.md, spec.md, shared shell (001), store context (002)

**Organization**: Tasks grouped by user story, targeting `frontend/app/orders/` and `frontend/app/couriers/`.

## Phase 1: Setup

- [ ] T001 [P] Extend `frontend/lib/types.ts` with `Order`, `OrderItem`, `OrderStatus`, `OrderOutcome`, `OrderStatusHistory` types
- [ ] T002 [P] Extend `frontend/lib/types.ts` with `Courier`, `Shipment`, `TrackingEvent`, `CourierCharge` types
- [ ] T003 [P] Create `frontend/lib/data/orders.ts` (`orders`, `orderStatusHistory`)
- [ ] T004 [P] Create `frontend/lib/data/couriers.ts` (`couriers`, `shipments`)
- [ ] T005 [P] Add status-badge and timeline utilities in `components/ui/` and Tailwind classes

## Phase 2: Foundational

- [ ] T006 Create `frontend/lib/orders.ts` with `getOrders()`, `getOrderById()`, `getCourierById()`, `getShipmentsForCourier()`
- [ ] T007 Add `app/orders/loading.tsx` and `app/orders/[id]/loading.tsx` skeletons

**Checkpoint**: Shared data helpers and list/detail scaffolding ready.

## Phase 3: User Story 1 - Orders list & filtering (Priority: P1) 🎯 MVP

**Goal**: Browse and filter all orders.

**Independent Test**: Open `/orders`; filter to "Delivered".

- [ ] T008 [P] [US1] Create `app/orders/page.tsx` (server component) that loads orders via `getOrders()`
- [ ] T009 [US1] Create `components/orders/OrderTable.tsx` (`"use client"`) rendering columns: order number, date, customer, status, courier, total
- [ ] T010 [US1] Implement status + courier filters and text search
- [ ] T011 [US1] Add result count and empty state

**Checkpoint**: Orders list fully functional.

## Phase 4: User Story 2 - Order detail & history (Priority: P2)

**Goal**: Inspect one order and its lifecycle.

**Independent Test**: Open `/orders/ord_1001`.

- [ ] T012 [P] [US2] Create `app/orders/[id]/page.tsx` with items, customer, payment, courier, tracking sections
- [ ] T013 [US2] Render the cost breakdown (manufacturing, packaging, courier, advertising)
- [ ] T014 [US2] Create `components/orders/StatusTimeline.tsx` and render the status history
- [ ] T015 [US2] Handle unassigned courier ("Unassigned") and missing cost ("—") states
- [ ] T016 [US2] Show outcome badges for Cancelled/Returned/Failed Delivery/Refunded

**Checkpoint**: Order detail complete.

## Phase 5: User Story 3 - Couriers & tracking (Priority: P3)

**Goal**: Review couriers, shipments, and tracking.

**Independent Test**: Open `/couriers` and `/couriers/cr_1`.

- [ ] T017 [P] [US3] Create `app/couriers/page.tsx` with the four couriers and charge summaries
- [ ] T018 [P] [US3] Create `app/couriers/[id]/page.tsx` with shipments and tracking events
- [ ] T019 [US3] Create `components/couriers/TrackingList.tsx` and separate shipping / COD / return charges
- [ ] T020 [US3] Add the "No tracking events yet" empty state

**Checkpoint**: All three stories functional.

## Phase 6: Polish

- [ ] T021 [P] Accessibility pass on tables, filters, and status badges (text + color)
- [ ] T022 Add `[NEEDS CLARIFICATION]` notes for courier names/APIs (Specifications §9 item 2)
- [ ] T023 Verify detail routes call `notFound()` for an unknown `id`
- [ ] T024 Ensure `npm run build` passes with no type errors

## Dependencies & Execution Order

Setup → Foundational → US1 → US2 → US3. US2 extends US1's rendering helpers; US3 is independently testable.

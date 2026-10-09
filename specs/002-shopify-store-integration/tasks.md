# Tasks: Shopify Store Connection

**Input**: Design documents from `/specs/002-shopify-store-integration/`

**Prerequisites**: plan.md, spec.md, and the shared shell from `001-auth-access-control`

**Organization**: Tasks grouped by user story, targeting `frontend/app/settings/`.

## Phase 1: Setup

- [ ] T001 [P] Extend `frontend/lib/types.ts` with `Store`, `EntityCounts`, `SyncRun`, `StoreConnectionStatus` types
- [ ] T002 [P] Create `frontend/lib/data/stores.ts` with `stores`, `sampleSyncRun`, `syncEntities`
- [ ] T003 [P] Add a `StatusBadge` variant for Connected/Disconnected/Error in `components/ui/Badge.tsx`

---

## Phase 2: Foundational

- [ ] T004 Create `frontend/lib/store.ts` with a mock `connectStore()` that returns a `SyncRun` over time
- [ ] T005 Build `components/store/SyncProgress.tsx` (queued / importing / complete states)

**Checkpoint**: Store routes can simulate a connection.

---

## Phase 3: User Story 1 - Connect a store (Priority: P1) 🎯 MVP

**Goal**: Owner can enter store details and complete a simulated connect.

**Independent Test**: Open `/settings/store`, connect, see connected state.

- [ ] T006 [P] [US1] Create `app/settings/store/page.tsx` (`"use client"`) with **Main store name** and **Shopify store URL** fields
- [ ] T007 [US1] Add the **Connect Store** button and required-field validation
- [ ] T008 [US1] Wire the connecting → connected simulation via `lib/store.ts`
- [ ] T009 [US1] Show connected status with store name, domain, and last-synced time
- [ ] T010 [US1] Persist the connected store to `localStorage` (`mockStore`) and restore on load

**Checkpoint**: Connect flow works end to end.

---

## Phase 4: User Story 2 - Stores list & sync status (Priority: P2)

**Goal**: Owner reviews connected stores and their synced entities.

**Independent Test**: Open `/settings/stores` and expand a store row.

- [ ] T011 [P] [US2] Create `app/settings/stores/page.tsx` with a stores table
- [ ] T012 [US2] Render name, URL, status badge, and last-sync time per row
- [ ] T013 [US2] Add a detail panel showing synced entity counts
- [ ] T014 [US2] Add the empty state ("No stores connected yet")

**Checkpoint**: Stores list and detail work with mock data.

---

## Phase 5: User Story 3 - Sync preview (Priority: P3)

**Goal**: Owner sees what data the initial sync imports.

**Independent Test**: On `/settings/store`, confirm the six-entity preview panel.

- [ ] T015 [US3] Add a "What will be synced" panel using `syncEntities`
- [ ] T016 [US3] Add a note that GraphQL initial sync and webhook event sync are future backend behavior

**Checkpoint**: All three stories functional.

---

## Phase 6: Polish

- [ ] T017 [P] Add an advisory warning when the URL does not look like a Shopify domain
- [ ] T018 Add a `[NEEDS CLARIFICATION]` note about single vs multiple stores (Specifications §9 item 8)
- [ ] T019 Accessibility pass on the connect form and stores table
- [ ] T020 Ensure `npm run build` passes with no type errors

## Dependencies & Execution Order

Setup → Foundational → US1 → US2/US3 (independent of each other). US2 depends on US1 only for the persisted store, but both render from mock data.

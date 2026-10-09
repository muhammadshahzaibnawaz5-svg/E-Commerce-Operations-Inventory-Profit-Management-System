# Feature Specification: Shopify Store Connection

**Feature Branch**: `002-shopify-store-integration`

**Created**: 2026-10-09

**Status**: Draft

**Input**: Specifications.md §3.2 (Store Connection UI), §3.3 (Shopify Integration), Requirements.md §4.1

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Connect a Shopify store (Priority: P1)

The owner opens the settings screen, enters the main store name and the Shopify store URL, and clicks **Connect Store** to link the store to the system and start the initial sync.

**Why this priority**: Every downstream feature (orders, products, inventory) is attributed to a connected store. Without this screen the rest of the prototype has no context.

**Independent Test**: Open `/settings/store`, enter a store name and URL, click **Connect Store**, and confirm the screen transitions to a connected state showing the store identity and a sync summary.

**Acceptance Scenarios**:

1. **Given** the store settings screen, **When** the owner enters a store name and a valid-looking Shopify URL and clicks **Connect Store**, **Then** a simulated connecting state is shown, followed by a "Connected" status with the store name and domain.
2. **Given** the store settings screen, **When** the owner clicks **Connect Store** with an empty name or URL, **Then** a validation message is shown and the sync is not started.
3. **Given** a connected store, **When** the screen reloads (mock persistence), **Then** the connected store is still shown with its last-synced timestamp.

---

### User Story 2 - View connected stores and sync status (Priority: P2)

The owner reviews the list of connected stores, each of which shows its connection status, last sync time, and the entities that were synced.

**Why this priority**: Confirms data is attributed to the correct store and gives confidence that the connection is healthy.

**Independent Test**: Open `/settings/stores` and confirm each mock store displays name, URL, status badge, last-sync time, and synced-entity counts.

**Acceptance Scenarios**:

1. **Given** the stores list, **When** it loads, **Then** each store shows name, Shopify URL, connection status, and last sync time.
2. **Given** a store row, **When** the owner selects it, **Then** a detail panel shows synced entities (products, customers, orders, payments, refunds, inventory).

---

### User Story 3 - Understand what data will sync (Priority: P3)

The owner sees a preview of the entities that the initial sync imports, so expectations are set before the real integration exists.

**Why this priority**: Helpful for review and client sign-off, but not required for the core connect action.

**Independent Test**: On the connect screen, confirm a "What will be synced" panel lists Products, Customers, Orders, Payments, Refunds, and Inventory.

**Acceptance Scenarios**:

1. **Given** the connect screen, **When** it loads, **Then** a read-only panel lists the six synced entity types with a one-line description each.

---

### Edge Cases

- What happens if the URL is not a Shopify-looking domain? → Show an advisory warning (not a hard block) that the URL does not look like a Shopify store.
- What happens if the user disconnects? → A confirmation dialog explains data attribution impact; on confirm, status becomes "Disconnected" (mock only).
- What happens when sync is "in progress"? → A progress indicator with the six entity types shown as queued/importing/complete.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a store settings screen with fields for **Main store name** and **Shopify store URL**.
- **FR-002**: The system MUST provide a **Connect Store** action that starts a simulated connection and initial sync.
- **FR-003**: The screen MUST show a connecting state and then a connected status including the store name and domain.
- **FR-004**: The system MUST validate that store name and URL are present before connecting.
- **FR-005**: The system MUST list connected stores with connection status and last-sync time.
- **FR-006**: Each store MUST display the entities synced from Shopify: Products, Customers, Orders, Payments, Refunds, Inventory.
- **FR-007**: Every synced record MUST be presented as belonging to a specific store (store identification), per business rule BR-07.
- **FR-008**: The initial sync preview MUST clearly mark Webhook-based event sync and GraphQL-based initial sync as future backend behavior **[NEEDS CLARIFICATION: confirm whether multiple stores or a single store will be supported — Specifications §9 item 8 and §3.2]**.

### Key Entities *(include if feature involves data)*

- **Store**: A connected Shopify store. Attributes: id, name, shopifyUrl, connectionStatus (Connected/Disconnected/Error), lastSyncedAt.
- **SyncRun**: A record of a sync attempt. Attributes: storeId, startedAt, status, entityCounts (products, customers, orders, payments, refunds, inventory).

### Out of Scope (this phase)

- The Shopify GraphQL API, webhooks, and real persistence are not implemented; all syncs are simulated.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reviewer can complete the connect flow (enter details → connect → see connected state) in under 60 seconds.
- **SC-002**: 100% of the store screens are reachable at their routes and render without errors.
- **SC-003**: Missing store name or URL always produces a validation message before any connecting state appears.
- **SC-004**: The six synced entity types are visible on the connect screen and match the source documents verbatim.

## Assumptions

- One store is sufficient for the prototype; multi-store is shown only if the open item is later confirmed.
- The Shopify URL is treated as an opaque string this phase; no OAuth or token flow is simulated in detail.
- Sync timestamps are mock values.

## Dependencies

- Depends on `001-auth-access-control` for the shared shell and signed-in owner context.

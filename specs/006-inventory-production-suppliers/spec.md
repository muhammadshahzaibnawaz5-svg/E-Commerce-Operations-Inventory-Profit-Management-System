# Feature Specification: Inventory, Production & Suppliers

**Feature Branch**: `006-inventory-production-suppliers`

**Created**: 2026-10-09

**Status**: Draft

**Input**: Specifications.md §3.9 (INV-01..06), §3.10 (Supplier Management); Requirements.md §4.6–4.7; Business Rules BR-06

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Track raw materials, packaging and finished stock (Priority: P1)

An inventory staff member opens the inventory screens to see raw materials, packaging materials, and finished-product stock, including used and remaining quantities and low-stock alerts.

**Why this priority**: Stock visibility is the foundation of production and of manufacturing cost (COGS).

**Independent Test**: Open `/inventory/materials`, `/inventory/packaging`, and `/inventory/finished-goods` and confirm each shows quantities with low-stock badges where applicable.

**Acceptance Scenarios**:

1. **Given** the raw materials screen, **When** it loads, **Then** each material shows purchased, used, and remaining quantities.
2. **Given** any inventory screen, **When** an item is below its low-stock threshold, **Then** a visible "Low stock" badge is shown.
3. **Given** the finished goods screen, **When** it loads, **Then** current stock per product is shown.

---

### User Story 2 - Record a production run (Priority: P2)

An inventory staff member records a production run that consumes raw materials and produces finished goods, and the on-screen stock updates accordingly.

**Why this priority**: Production is how raw materials become sellable stock and how COGS becomes traceable.

**Independent Test**: Open `/inventory/production`, submit a production run, and confirm raw materials decrease and finished goods increase.

**Acceptance Scenarios**:

1. **Given** the production screen, **When** the user enters a product, quantity, and the raw materials consumed, **Then** a summary of the expected stock impact is shown.
2. **Given** a submitted production run, **When** the screen refreshes state, **Then** raw-material remaining quantities decrease and finished-goods stock increases.
3. **Given** insufficient raw material, **When** the user submits, **Then** an error explains which material is short and the run is not recorded.
4. **Given** a completed production run, **When** it is listed, **Then** it shows date, product, quantity, and materials consumed.

---

### User Story 3 - Manage suppliers and purchase history (Priority: P3)

A staff member reviews supplier records and their purchase history, and records a supplier purchase as a cost.

**Why this priority**: Supplier purchases feed inventory and (per BR-06) become COGS when consumed, but the screen is secondary to stock tracking.

**Independent Test**: Open `/suppliers` and `/suppliers/sup_1` and confirm supplier details and purchase history render.

**Acceptance Scenarios**:

1. **Given** the suppliers list, **When** it loads, **Then** each supplier shows contact details and total purchased value.
2. **Given** a supplier detail, **When** it loads, **Then** the purchase history (date, item, quantity, cost) is listed.
3. **Given** a new purchase entry, **When** submitted, **Then** it appears in the purchase history and adds to the supplier's total.

---

### Edge Cases

- What happens when remaining quantity would go negative? → Submission is blocked with a clear message.
- What happens when an item has no low-stock threshold set? → No badge is shown (threshold is optional).
- What happens when a returned item is restocked (feature 005)? → Finished-goods stock reflects the increase.
- What happens with negative or zero quantities? → Input validation rejects them.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST add raw materials purchased from suppliers to inventory.
- **FR-002**: The system MUST show **used** and **remaining** raw-material quantities.
- **FR-003**: The system MUST track **packaging materials** and **finished-product stock**.
- **FR-004**: The system MUST record **production** (raw materials consumed → finished goods produced) and update stock accordingly.
- **FR-005**: The system MUST show **low-stock alerts** for items below a threshold.
- **FR-006**: Finished-goods stock SHOULD be presented as reflected back to Shopify inventory (as a status note; no real sync).
- **FR-007**: The system MUST maintain supplier records and their **purchase history**, recording purchases as costs.
- **FR-008**: Whether supplier purchases are treated as inventory (COGS when consumed, per BR-06) or as a direct expense MUST be **[NEEDS CLARIFICATION: confirm inventory-and-COGS-on-consumption vs direct expense — Specifications §9 item 4]**.
- **FR-009**: Whether **packaging** is counted within COGS MUST be **[NEEDS CLARIFICATION: confirm packaging is COGS (used from inventory) — Specifications §9 item 5]**.
- **FR-010**: Whether the business uses a single warehouse or multiple warehouses MUST be **[NEEDS CLARIFICATION: confirm warehouse model — Specifications §9 item 8]**.

### Key Entities *(include if feature involves data)*

- **RawMaterial**: Attributes: id, name, unit, purchased, used, remaining, lowStockThreshold.
- **PackagingMaterial**: Attributes: id, name, unit, purchased, used, remaining, lowStockThreshold.
- **FinishedGood**: Attributes: id, product, unit, stock, lowStockThreshold.
- **ProductionRun**: Attributes: id, product, quantity, consumedMaterials[], producedAt.
- **StockMovement**: Attributes: id, itemType, itemId, change, reason, at.
- **Supplier**: Attributes: id, name, contact, totalPurchased.
- **Purchase**: Attributes: id, supplierId, item, quantity, cost, purchasedAt.

### Out of Scope (this phase)

- Real inventory writes, Shopify inventory sync, and automated stock adjustments are not implemented.
- The COGS/expense treatment is a UI representation only (the actual calculation is defined in feature 008).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reviewer can see used, remaining, and low-stock state for any material within two clicks.
- **SC-002**: 100% of inventory and supplier screens are reachable at their routes and render without errors.
- **SC-003**: Submitting a production run that exceeds available raw material always fails with an explanatory message.
- **SC-004**: Low-stock items are identifiable by text ("Low stock"), not color alone.

## Assumptions

- A single warehouse is assumed for the prototype unless the warehouse open item says otherwise.
- Finished goods correspond one-to-one with Shopify products.
- Resale/purchased products are out of scope (assumption carried from Requirements §2.2 and Specifications §9 item 9).

## Dependencies

- Depends on `002-shopify-store-integration` for the store context.
- Feeds `008-profit-loss-dashboard-reports` (COGS from inventory consumption).

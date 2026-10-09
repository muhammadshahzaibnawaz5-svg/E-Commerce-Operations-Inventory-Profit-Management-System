# Feature Specification: Order, Delivery & Courier Management

**Feature Branch**: `003-order-delivery-courier`

**Created**: 2026-10-09

**Status**: Draft

**Input**: Specifications.md §3.5 (Courier Integration), §3.6 (Order & Delivery, ORD-01..04); Requirements.md §4.2–4.3

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Review the order list and status (Priority: P1)

An order-processing staff member opens the orders list to see every order, its customer, its current lifecycle status, and its courier, then filters by status.

**Why this priority**: Orders are the core operational object; every other operational feature references them.

**Independent Test**: Open `/orders`, confirm the table shows order number, customer, status badge, courier, and amount, and that filtering by each status narrows the rows.

**Acceptance Scenarios**:

1. **Given** the orders list, **When** it loads, **Then** each row shows order number, date, customer, status, courier, and total.
2. **Given** the status filter, **When** the user selects "Delivered", **Then** only delivered orders are shown and a result count is displayed.
3. **Given** no orders match a filter, **When** the filter applies, **Then** an empty state message is shown.

---

### User Story 2 - View an order's full detail and lifecycle history (Priority: P2)

A staff member opens a single order to see its items, customer, payment, courier, tracking, cost breakdown, and the history of status changes.

**Why this priority**: Needed to process an individual order and to audit its journey, but the list alone already delivers overview value.

**Independent Test**: Open `/orders/ord_1001` and confirm all sections render, including the status history timeline.

**Acceptance Scenarios**:

1. **Given** an order detail page, **When** it loads, **Then** it shows items, customer, payment type, courier, tracking number, and a cost breakdown.
2. **Given** the order detail page, **When** the status history is rendered, **Then** each change shows the status, timestamp, and actor.
3. **Given** an order with an added outcome (Cancelled/Returned/Failed Delivery/Refunded), **When** the page loads, **Then** the outcome is shown with a distinct badge.

---

### User Story 3 - Manage couriers and track shipments (Priority: P3)

A staff member reviews the four couriers, their charges, and the tracking events for a shipment.

**Why this priority**: Courier visibility supports delivery tracking and cost control, but depends on orders already existing.

**Independent Test**: Open `/couriers` and `/couriers/cr_1` and confirm courier charges and tracking events render.

**Acceptance Scenarios**:

1. **Given** the couriers list, **When** it loads, **Then** each courier shows name, active shipments, and current-period charges.
2. **Given** a courier detail page, **When** it loads, **Then** shipments and their tracking events (timestamped) are listed.
3. **Given** a shipment, **When** its charges are shown, **Then** shipping, COD, and return charges are separated.

---

### Edge Cases

- What happens when an order has no courier assigned yet? → Courier column shows "Unassigned".
- What happens when tracking has no events? → A "No tracking events yet" placeholder is shown.
- What happens for a Failed Delivery or Returned order? → The outcome badge is shown and the returns/courier cost link is displayed.
- What happens when a cost component is missing? → The breakdown shows "—" rather than a misleading zero.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide an orders list showing order number, date, customer, status, courier, and total.
- **FR-002**: The status MUST follow the lifecycle **New → Confirmed → Packed → Shipped → Delivered**.
- **FR-003**: The system MUST represent additional outcomes: **Cancelled, Returned, Failed Delivery, Refunded**.
- **FR-004**: The orders list MUST support filtering by status and by courier, and a text search by order number or customer.
- **FR-005**: Each order MUST have a detail view showing items, customer, payment, courier, tracking, and a cost breakdown.
- **FR-006**: The order detail MUST show order status history (status, timestamp, actor).
- **FR-007**: The system MUST list the couriers and record courier details and tracking per order.
- **FR-008**: Courier charges MUST be tracked as shipping, COD, and return charges (business expenses).
- **FR-009**: The system MUST show tracking events for a shipment with timestamps.
- **FR-010**: Each courier MUST be represented so that a new courier can be added without changing the list/detail layout (adapter-style presentation).
- **FR-011**: Courier names and API availability MUST be **[NEEDS CLARIFICATION: names of the four couriers and whether each provides an API are unconfirmed — Specifications §9 item 2]**.

### Key Entities *(include if feature involves data)*

- **Order**: A customer purchase. Attributes: id, orderNumber, placedAt, customer, status, courier, total, paymentType.
- **OrderItem**: A line on an order. Attributes: product, quantity, unitPrice.
- **OrderStatusHistory**: A status change. Attributes: orderId, status, changedAt, changedBy.
- **Courier**: A delivery company. Attributes: id, name, isActive, apiAvailable.
- **Shipment**: A courier dispatch for an order. Attributes: orderId, courierId, trackingNumber, status.
- **TrackingEvent**: A shipment milestone. Attributes: shipmentId, timestamp, description.
- **CourierCharge**: A cost line. Attributes: shipmentId, type (shipping/COD/return), amount.

### Out of Scope (this phase)

- Courier APIs, real tracking feeds, and charge settlements are not integrated; all values are mock.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reviewer can locate a specific order by number in under 15 seconds using search/filter.
- **SC-002**: 100% of order and courier screens are reachable at their routes and render without errors.
- **SC-003**: All eight status/outcome values (five lifecycle + three outcomes shown distinctly) are visually distinguishable by text, not color alone.
- **SC-004**: The order detail cost breakdown lists manufacturing, packaging, courier, and advertising lines.

## Assumptions

- Order, shipment, and tracking data are mock records covering every lifecycle status and every outcome for demonstration.
- Costs shown on the order detail are illustrative and not yet validated against the P&L rules of feature 008.
- The four couriers are referenced generically pending the open item.

## Dependencies

- Depends on `002-shopify-store-integration` for store context.
- Feeds `004-payments-settlements` and `005-returns-refunds`.

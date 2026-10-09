# Feature Specification: Returns & Refunds

**Feature Branch**: `005-returns-refunds`

**Created**: 2026-10-09

**Status**: Draft

**Input**: Specifications.md §3.8 (RET-01..04); Requirements.md §4.5, §5.3; Business Rules BR-04, BR-05

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Review returned and failed orders (Priority: P1)

An order-processing staff member opens the returns list to see all returned and failed-delivery orders with their reason, the courier, and the amount to be returned to the customer.

**Why this priority**: Returns directly affect money owed back to customers and are a distinct operational queue.

**Independent Test**: Open `/returns` and confirm the table shows order, customer, reason, courier, returned amount, and restock status, with filtering by reason/status.

**Acceptance Scenarios**:

1. **Given** the returns list, **When** it loads, **Then** each row shows order, customer, reason, courier, refund amount, and restock status.
2. **Given** the reason/status filter, **When** the user selects "Failed Delivery", **Then** only those rows are shown with a count.
3. **Given** no returns match, **When** a filter applies, **Then** an empty state is shown.

---

### User Story 2 - See the courier deduction from the 25% advance (Priority: P2)

A finance staff member opens a return's detail to see the courier cost deducted from the 25% advance and the remaining amount returned to the customer.

**Why this priority**: This is the exact rule the client specified (BR-04) and must be shown transparently.

**Independent Test**: Open `/returns/ret_1001` and confirm the breakdown: 25% advance − courier cost = amount returned.

**Acceptance Scenarios**:

1. **Given** a return detail, **When** it loads, **Then** it shows the 25% advance, the deducted courier cost, and the net amount returned to the customer.
2. **Given** a return where courier cost exceeds the advance, **When** the detail loads, **Then** the returned amount shows 0 and a note explains the shortfall.
3. **Given** a return linked to a payment, **When** the detail loads, **Then** a link back to the payment is shown.

---

### User Story 3 - Decide whether items restock (Priority: P3)

An inventory staff member marks returned items as inspected and sellable (restock) or not sellable (write-off), per BR-05.

**Why this priority**: Prevents unsellable goods from re-entering stock, but is secondary to the refund amount.

**Independent Test**: On the return detail, toggle "Inspected & sellable" and confirm the restock status updates in the list.

**Acceptance Scenarios**:

1. **Given** a return detail, **When** the user marks items "Inspected & sellable", **Then** the return shows a "Restocked" status and a note that stock will increase.
2. **Given** a return detail, **When** the user marks items "Not sellable", **Then** the return shows a "Written off" status and no restock occurs.
3. **Given** an uninspected return, **When** the detail loads, **Then** the status is "Awaiting inspection".

---

### Edge Cases

- What happens for a Failed Delivery that never reached the customer? → Same refund flow applies; reason distinguishes it.
- What happens when the courier cost is unknown? → Show "—" and block the final refund figure with a "courier cost required" note.
- What happens to the 75% when an order is returned before the next day? → The 75% is not collected; only the 25% advance is adjusted.
- What happens to multiple items where only some are sellable? → Show per-item restock toggles and sum the refund.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST track returned and failed-delivery orders separately.
- **FR-002**: The returns list MUST show order, customer, reason, courier, refund amount, and restock status.
- **FR-003**: The returns list MUST support filtering by reason and restock status.
- **FR-004**: For a returned order, the system MUST deduct the courier cost from the 25% advance and return the remaining amount to the customer (BR-04).
- **FR-005**: The return detail MUST show the 25% advance, the courier cost deduction, and the net amount returned.
- **FR-006**: Returned items MUST go back into stock only when marked inspected and sellable (BR-05); otherwise they are written off.
- **FR-007**: The restock decision MUST be per-item where an order has multiple items.
- **FR-008**: Refunds MUST be represented as reducing net revenue (link to feature 008).
- **FR-009**: The handling of a returned order that was never paid (failed prepaid) MUST be **[NEEDS CLARIFICATION: confirm refund treatment when no advance was collected — Specifications §9 item 6]**.

### Key Entities *(include if feature involves data)*

- **Return**: A returned or failed order. Attributes: id, orderId, reason, courier, advance, courierCost, amountReturned, restockStatus.
- **ReturnItem**: A line under inspection. Attributes: returnId, product, sellable (bool), restockDecision.

### Out of Scope (this phase)

- Automated restocking, inventory writes, and real refund processing are not implemented.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reviewer can see the courier deduction and net returned amount for any return in under 30 seconds.
- **SC-002**: 100% of returns screens are reachable at their routes and render without errors.
- **SC-003**: The restock decision always resolves to Restocked, Written off, or Awaiting inspection — never ambiguous.
- **SC-004**: The formula shown (advance − courier = returned) is arithmetically correct for all mock rows.

## Assumptions

- The 25% advance is taken from the related payment in feature 004.
- "Reason" values include at least: Customer Return, Failed Delivery, Refused.
- Currency and rounding follow the same rules as feature 004.

## Dependencies

- Depends on `003-order-delivery-courier` and `004-payments-settlements`.
- Feeds `008-profit-loss-dashboard-reports` (refunds reduce net revenue).

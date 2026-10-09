# Feature Specification: Payments & Settlements

**Feature Branch**: `004-payments-settlements`

**Created**: 2026-10-09

**Status**: Draft

**Input**: Specifications.md §3.7 (PAY-01..03); Requirements.md §4.4, §5.3; Business Rules BR-03

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Review payments and settlement status (Priority: P1)

A finance staff member opens the payments list to see every payment, whether it is prepaid or Cash on Delivery, and whether it is received, pending, or settled.

**Why this priority**: Cash flow visibility is the primary financial concern and the basis for the P&L.

**Independent Test**: Open `/payments`, confirm the table shows order, customer, type (Prepaid/COD), amount, and settlement status, and that filtering by status and type works.

**Acceptance Scenarios**:

1. **Given** the payments list, **When** it loads, **Then** each row shows order number, customer, payment type, amount, and settlement status.
2. **Given** the settlement-status filter, **When** the user selects "Pending", **Then** only pending settlements are shown with a result count.
3. **Given** no payments match, **When** a filter applies, **Then** an empty state is shown.

---

### User Story 2 - View the 25% / 75% split for an order (Priority: P2)

A finance staff member opens a single delivered order's payment to see that 25% is received on delivery and the remaining 75% is due the next day, with each part marked received or pending.

**Why this priority**: This is the defining business rule of the client's payment model and must be demonstrated clearly.

**Independent Test**: Open `/payments/pay_1001` and confirm the 25% and 75% tranches are shown with amounts, dates, and received/pending states.

**Acceptance Scenarios**:

1. **Given** a delivered order's payment detail, **When** it loads, **Then** the total is split into a 25% tranche (on delivery) and a 75% tranche (next day).
2. **Given** a delivered order before the next day, **When** the detail loads, **Then** the 25% tranche shows "Received" and the 75% tranche shows "Pending".
3. **Given** a delivered order after the next day, **When** the detail loads, **Then** both tranches show "Received" and the payment shows "Settled".

---

### User Story 3 - See received, pending, and settled totals (Priority: P3)

A finance staff member reviews summary cards showing total received, total pending, and total settled amounts.

**Why this priority**: A summary supports quick review but the list and detail already convey the information.

**Independent Test**: On `/payments`, confirm the three summary cards display totals derived from the mock data.

**Acceptance Scenarios**:

1. **Given** the payments list, **When** it loads, **Then** summary cards show Received, Pending, and Settled totals.

---

### Edge Cases

- What happens for a payment whose order is not yet delivered? → No tranches yet; status "Pending"; show "Awaiting delivery".
- What happens for a returned order? → The 25% advance is reduced by the courier cost (link to feature 005); show the adjusted amount.
- What happens when only the 25% is received? → Status "Partially received".
- What happens if an amount is zero? → Show "0" explicitly, not blank.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST record **prepaid** and **Cash on Delivery** payments distinctly.
- **FR-002**: Each delivered order MUST be presented as settled in two parts: **25% on delivery** and the **remaining 75% the next day**.
- **FR-003**: The system MUST show **received**, **pending**, and **settled** amounts.
- **FR-004**: The payments list MUST show order, customer, type, amount, and settlement status, with filters for type and status.
- **FR-005**: Each payment MUST have a detail view showing the 25% and 75% tranches with amounts and dates.
- **FR-006**: The system MUST show summary totals for received, pending, and settled.
- **FR-007**: The 25%/75% split rule MUST be treated as a business rule (BR-03) and displayed with a link to returns handling (feature 005).
- **FR-008**: The exact timing basis for revenue recognition and settlement MUST be **[NEEDS CLARIFICATION: confirm whether settlement is clocked from delivery or from payment, and how weekends/holidays affect "next day" — Specifications §9 item 6]**.

### Key Entities *(include if feature involves data)*

- **Payment**: A payment against an order. Attributes: id, orderId, type (Prepaid/COD), amount, status (Pending/PartiallyReceived/Received/Settled).
- **SettlementTranche**: One part of the split. Attributes: paymentId, share (25%/75%), amount, dueDate, status.

### Out of Scope (this phase)

- Real payment gateways, COD reconciliation, and automated settlement are not implemented.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reviewer can see the 25%/75% split for any delivered order within two clicks from the payments list.
- **SC-002**: 100% of payment screens are reachable at their routes and render without errors.
- **SC-003**: Received, pending, and settled amounts are always visible and never blank.
- **SC-004**: Prepaid and COD payments are distinguishable by text labels in 100% of rows.

## Assumptions

- "Next day" is treated as delivery date + 1 day for the mock data.
- Amounts are shown in a single currency; currency formatting is not finalized.
- The 25% advance and 75% remainder always sum to the order total in the mock data.

## Dependencies

- Depends on `003-order-delivery-courier` for orders and delivery status.
- Feeds `005-returns-refunds` (advance adjustment) and `008-profit-loss-dashboard-reports`.

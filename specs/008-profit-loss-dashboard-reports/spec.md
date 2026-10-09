# Feature Specification: Profit & Loss, Dashboard & Reports

**Feature Branch**: `008-profit-loss-dashboard-reports`

**Created**: 2026-10-09

**Status**: Draft

**Input**: Specifications.md §3.12 (Dashboard & Reports), §4 (Profit & Loss), §5 (Business Rules); Requirements.md §4.10–4.11, §5

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View the profit or loss (Priority: P1)

An owner opens the profit & loss screen to see net profit overall and per product, built from revenue minus total expense.

**Why this priority**: Answering "what is the actual profit or loss?" is the stated purpose of the entire system.

**Independent Test**: Open `/profit-loss` and confirm the P&L statement shows Net Revenue, COGS, Gross Profit, Selling Costs, Operating Expenses, and Net Profit, plus a per-product table.

**Acceptance Scenarios**:

1. **Given** the P&L screen, **When** it loads, **Then** it shows the calculated chain: Net Revenue → COGS → Gross Profit → Selling Costs → Operating Expenses → Net Profit.
2. **Given** the P&L screen, **When** the user views the per-product table, **Then** each product shows its revenue, costs, and profit.
3. **Given** a period with more expense than revenue, **When** the P&L renders, **Then** the result is shown clearly as a **loss** (negative), not hidden.

---

### User Story 2 - Review the dashboard (Priority: P2)

A manager opens the dashboard to see at-a-glance cards and charts for orders, deliveries, returns, payments, expenses, and profit or loss.

**Why this priority**: The dashboard gives a fast operational and financial snapshot, complementing the detailed P&L.

**Independent Test**: Open `/dashboard` and confirm summary cards and at least one chart render from mock data.

**Acceptance Scenarios**:

1. **Given** the dashboard, **When** it loads, **Then** it shows cards for orders, deliveries, returns, payments, expenses, and profit/loss.
2. **Given** the dashboard, **When** a chart is rendered, **Then** it reflects the mock data series (e.g. profit over time, expense by category).
3. **Given** the dashboard, **When** no data exists for a metric, **Then** the card shows 0 / an empty chart with a note.

---

### User Story 3 - Run reports with date filters and export (Priority: P3)

A finance staff member opens the reports screen, applies a date range, and uses an export control to export the report (format to be confirmed).

**Why this priority**: Filtering and export are explicitly required, but depend on the report data already being computed.

**Independent Test**: Open `/reports`, apply a date range, confirm the table updates, and confirm export controls are present (download simulated).

**Acceptance Scenarios**:

1. **Given** the reports screen, **When** a date range is applied, **Then** the report rows and totals update to that range.
2. **Given** the reports screen, **When** the user selects an export format, **Then** a success message is shown (file generation is simulated this phase).
3. **Given** a range with no data, **When** applied, **Then** an empty state is shown.

---

### Edge Cases

- What happens when costs exceed revenue? → Show a clearly labelled loss.
- What happens when a product has sold zero units? → Exclude it from the per-product table or show it with zero values (document the choice).
- What happens when a refund exists? → It reduces Net Revenue on the P&L.
- What happens when export is clicked in this markup phase? → A "Demo only — no file generated" notice is shown.
- What happens when only part of the period has data? → Totals reflect available data and note the coverage.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST calculate and display **Net Profit = Revenue − Total Expense** (BR-01).
- **FR-002**: Total Expense MUST include raw materials & packaging + advertising + courier charges + other operational costs (BR-02).
- **FR-003**: The system MUST show **Gross Profit = Net Revenue − COGS** and **Operating Profit = Gross Profit − Selling Costs − Operating Expenses**.
- **FR-004**: The system MUST show profit/loss **per product** as well as overall.
- **FR-005**: An expense MUST count as COGS only if drawn from inventory (BR-06); courier and advertising costs are shown as selling costs, separate from COGS.
- **FR-006**: Returned/refunded orders MUST reduce Net Revenue; courier cost on returns remains a cost.
- **FR-007**: The dashboard MUST show orders, deliveries, returns, payments, expenses, and profit or loss.
- **FR-008**: Reports MUST support **date filters**.
- **FR-009**: Reports MUST provide **export** controls (formats to be confirmed).
- **FR-010**: The P&L MUST show a **loss** explicitly when the result is negative.
- **FR-011**: The worked-example manufacturing figure MUST be **[NEEDS CLARIFICATION: the design note writes 2 × 2,200 = 4,000 (should be 4,400), yielding order profit 5,100 vs 4,700 — confirm the intended unit manufacturing cost — Specifications §4.4 / §9 item 10]**.
- **FR-012**: The revenue recognition timing MUST be **[NEEDS CLARIFICATION: recognized on delivery vs on payment settlement — Specifications §9 item 6]**.
- **FR-013**: The required **export formats** MUST be **[NEEDS CLARIFICATION: formats unconfirmed — Specifications §9 item 7]**.

### Key Entities *(include if feature involves data)*

- **ProfitLossStatement**: Derived view. Fields: netRevenue, cogs, grossProfit, sellingCosts, operatingExpenses, operatingProfit, netProfit.
- **ProductProfit**: Per-product derived row. Fields: product, units, revenue, manufacturing, packaging, courier, advertising, profit.
- **DashboardMetric**: Derived card value. Fields: key, label, value, delta.
- **Report**: A filtered view. Fields: name, dateRange, rows, totals.

### Out of Scope (this phase)

- No stored P&L values — all figures are derived from mock data (the future system derives them from tables/views).
- Export does not generate real files; it is represented by UI controls and a demo notice.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The dashboard and P&L load instantly from local files (under 1 second on a typical machine).
- **SC-002**: 100% of dashboard and report screens are reachable at their routes and render without errors.
- **SC-003**: Applying a date range updates the report totals in one interaction.
- **SC-004**: The displayed P&L chain is arithmetically consistent for all mock data (Gross = Net Revenue − COGS, etc.).
- **SC-005**: A negative result is always visually labelled as a loss.

## Assumptions

- P&L figures are derived from the mock data of features 003–007.
- Charts are drawn with plain CSS/SVG (no charting library) to honor the zero-build principle.
- Currency formatting matches features 004 and 005.

## Dependencies

- Depends on `003-order-delivery-courier`, `004-payments-settlements`, `005-returns-refunds`, `006-inventory-production-suppliers`, and `007-advertising-expenses`.

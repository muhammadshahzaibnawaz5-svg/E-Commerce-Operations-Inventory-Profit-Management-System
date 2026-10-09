# Feature Specification: Advertising & Expenses

**Feature Branch**: `007-advertising-expenses`

**Created**: 2026-10-09

**Status**: Draft

**Input**: Specifications.md §3.4 (Advertising), §3.11 (Manual Data Entry); Requirements.md §4.8–4.9, §5.2

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Review advertising spend (Priority: P1)

A marketing-aware staff member opens the advertising screen to see ad spend by campaign and date for Meta and TikTok, and to see the total spend for a period.

**Why this priority**: Ad spend is a major selling cost that feeds profit; it must be visible and filterable.

**Independent Test**: Open `/marketing/ads`, confirm spend is shown by campaign and date with a platform label, and that a date filter narrows the totals.

**Acceptance Scenarios**:

1. **Given** the advertising screen, **When** it loads, **Then** each campaign row shows platform (Meta/TikTok), campaign name, date, and spend.
2. **Given** the date filter, **When** a range is applied, **Then** the total spend and rows update to that range.
3. **Given** no spend in the range, **When** the filter applies, **Then** an empty state is shown.

---

### User Story 2 - Record a manual advertising cost (Priority: P2)

A staff member adds an advertising cost manually (for spend not available through an API) with campaign, date, amount, and an optional note.

**Why this priority**: Manual fallback is explicitly required where API data is unavailable.

**Independent Test**: On the advertising screen, add a manual cost and confirm it appears in the table and totals.

**Acceptance Scenarios**:

1. **Given** the advertising screen, **When** the user opens "Add cost", **Then** a form collects platform, campaign, date, amount, and note.
2. **Given** a submitted manual cost, **When** validated, **Then** it is added to the list and included in totals.
3. **Given** a missing required field, **When** the user submits, **Then** a validation message is shown.

---

### User Story 3 - Record and review other business expenses (Priority: P3)

A finance staff member opens the expenses screen to see all non-advertising expenses by category, amount, and date, and to add a new expense.

**Why this priority**: Other operational costs (e.g. salaries) are required for net profit, but the expense ledger is a secondary screen.

**Independent Test**: Open `/expenses`, add an expense, and confirm it appears with its category and date.

**Acceptance Scenarios**:

1. **Given** the expenses list, **When** it loads, **Then** each expense shows category, amount, date, and note.
2. **Given** the expenses list, **When** a category filter is applied, **Then** only that category is shown with a total.
3. **Given** a new expense, **When** submitted with category/amount/date, **Then** it is added to the list.

---

### Edge Cases

- What happens when an amount is zero or negative? → Input validation rejects it.
- What happens when the date is in the future? → Allowed but flagged with a note (ad spend can be prepaid).
- What happens when a manual cost duplicates an API cost? → The user can flag a row as "Possible duplicate" (visual only).
- What happens when no campaign exists yet? → The manual entry form allows a free-text campaign name.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST record ad spend by **campaign** and **date**.
- **FR-002**: Ad spend MUST be labelled by platform (**Meta** / **TikTok**) and treated as a selling expense.
- **FR-003**: The advertising screen MUST support a **date-range filter** and show a period total.
- **FR-004**: The owner MUST be able to **enter advertising costs manually**.
- **FR-005**: The system MUST record other business expenses by **category, amount, and date** with an optional note.
- **FR-006**: The expenses list MUST support filtering by category and show category totals.
- **FR-007**: Advertising and other expenses MUST be distinguishable as selling cost vs operating expense respectively.
- **FR-008**: Whether **TikTok** ad spend is API-integrated or manual-only MUST be **[NEEDS CLARIFICATION: notes mention Meta APIs only — Specifications §9 item 3]**.
- **FR-009**: The final list of **expense categories** and the required **export formats** MUST be **[NEEDS CLARIFICATION: categories and report/export formats unconfirmed — Specifications §9 item 7]**.

### Key Entities *(include if feature involves data)*

- **AdCampaign**: Attributes: id, platform (Meta/TikTok), name, source (API/Manual).
- **AdSpend**: Attributes: id, campaignId, date, amount.
- **Expense**: Attributes: id, category, amount, date, note, type (selling/operating).

### Out of Scope (this phase)

- Meta and TikTok API integrations are not implemented; all ad spend is mock or manually entered.
- Export/report generation is represented by UI controls only (feature 008).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reviewer can see total ad spend for a date range within one interaction.
- **SC-002**: 100% of advertising and expense screens are reachable at their routes and render without errors.
- **SC-003**: A manual ad cost can be added and reflected in totals in under 30 seconds.
- **SC-004**: Every expense row shows category, amount, and date; none are blank.

## Assumptions

- Default expense categories: Raw Materials, Packaging, Advertising, Salaries, Utilities, Other.
- Ad spend is stored per campaign per date; a campaign can span multiple rows.
- Meta is treated as the primary API source; TikTok is manual until confirmed.

## Dependencies

- Depends on `001-auth-access-control` for the shell and user context.
- Feeds `008-profit-loss-dashboard-reports` (selling and operating expenses).

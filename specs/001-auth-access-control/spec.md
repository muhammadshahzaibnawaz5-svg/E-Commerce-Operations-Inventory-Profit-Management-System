# Feature Specification: Authentication & Access Control

**Feature Branch**: `001-auth-access-control`

**Created**: 2026-10-09

**Status**: Draft

**Input**: Requirements.md §4.12 (User Roles); Specifications.md §3.1 (AUTH-01..03)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sign in with email and password (Priority: P1)

A staff member opens the application and signs in with their email address and password so that they reach the area of the system appropriate to their role.

**Why this priority**: Nothing else in the system is reachable without authentication; every other feature depends on a signed-in user. This is the minimum usable slice.

**Independent Test**: Open `/auth/login`, enter a valid mock email and password, and confirm the user lands on the shared application shell (sidebar + dashboard placeholder). Enter invalid credentials and confirm an inline error is shown.

**Acceptance Scenarios**:

1. **Given** the login screen, **When** the user enters a valid email and password and submits, **Then** the app navigates to the shared shell and shows the signed-in user's name and role.
2. **Given** the login screen, **When** the user enters an unknown email or wrong password, **Then** an inline error "Email or password is incorrect" is shown and no navigation occurs.
3. **Given** the login screen, **When** either field is empty, **Then** a required-field message is shown and submit is blocked.

---

### User Story 2 - Reset a forgotten password using an OTP (Priority: P2)

A staff member who has forgotten their password requests a reset, receives a one-time code (OTP), verifies it, sets a new password, and returns to sign in.

**Why this priority**: Account recovery is essential for day-to-day usability, but it is not needed to demonstrate the core system flow.

**Independent Test**: From `/auth/login`, click "Forgot password?", enter a registered mock email, request the OTP, enter the mock OTP, set a new password, and confirm redirection back to sign in with a success message.

**Acceptance Scenarios**:

1. **Given** the login screen, **When** the user selects "Forgot password?" and submits a registered email, **Then** the OTP entry screen is shown with a "code sent" confirmation.
2. **Given** the OTP screen, **When** the user enters the correct mock code and a new password, **Then** a success state is shown and the user is returned to sign in.
3. **Given** the OTP screen, **When** the user enters an incorrect or expired code, **Then** an informative error is shown and the user may request a new code.
4. **Given** the OTP screen, **When** the user requests a resend, **Then** a countdown/resend affordance is displayed.

---

### User Story 3 - View roles and permissions (Priority: P3)

An owner views the list of roles and their intended responsibilities, and the navigation shows or hides modules according to the signed-in user's role.

**Why this priority**: Role structure clarifies who can do what, but the exact role list is still an open item pending client confirmation (Specifications §9, item 1).

**Independent Test**: Open `/auth/roles` and confirm the five roles are listed with responsibilities. Sign in as different mock users and confirm the sidebar highlights or restricts modules for each role.

**Acceptance Scenarios**:

1. **Given** the roles screen, **When** it loads, **Then** the five roles (Owner/Admin, Manager, Inventory, Order Processing, Finance) are shown with their intended responsibilities.
2. **Given** a signed-in user with a restricted role, **When** the shell renders, **Then** modules outside that role's responsibility are visually disabled or hidden with an explanatory note.

---

### Edge Cases

- What happens when the user submits the email/password form with only whitespace? → Treated as empty; required-field validation.
- What happens when the OTP request is made for an unregistered email? → A neutral "If this email exists, a code was sent" message (no account enumeration).
- What happens if a script fails to load? → The forms remain readable and submittable as static HTML (progressive enhancement).
- What happens when the user navigates directly to a module URL without signing in? → In this markup phase, a static "Please sign in" notice is shown (enforcement is out of scope).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a sign-up screen collecting email and password.
- **FR-002**: The system MUST provide a sign-in screen accepting email and password, with the password masked.
- **FR-003**: The system MUST provide a "forgot password" flow that requests a reset for a given email and shows an OTP entry step.
- **FR-004**: The OTP step MUST accept a one-time code and show success or failure feedback.
- **FR-005**: After a successful OTP verification, the user MUST be able to set a new password and be returned to sign in.
- **FR-006**: The system MUST display the signed-in user's name and role in the shared header.
- **FR-007**: The system MUST present the list of roles with their intended responsibilities: Owner/Admin, Manager, Inventory, Order Processing, Finance.
- **FR-008**: The shell MUST reflect role-based access by hiding or disabling modules the signed-in role is not responsible for.
- **FR-009**: Passwords MUST be entered via masked fields; OTPs MUST be time-limited in the intended (future) system.
- **FR-010**: The final role list and per-role permissions MUST authenticate against **[NEEDS CLARIFICATION: role list and permissions not yet confirmed with the client — Specifications §9 item 1]**.

### Key Entities *(include if feature involves data)*

- **User**: A staff account. Attributes: id, full name, email, role, status (active/disabled).
- **Role**: A named responsibility set. Attributes: name, description. Initial set: Owner/Admin, Manager, Inventory, Order Processing, Finance.
- **OtpToken**: A one-time code for password reset. Attributes: email, code, issued-at, expiry, used flag (mock only this phase).

### Out of Scope (this phase)

- Real credential storage, hashing, and session enforcement (backend) are not built.
- Email/SMS delivery of the actual OTP is not implemented; the code is shown in mock data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A reviewer can complete the sign-in journey (open → enter credentials → reach shell) in under 30 seconds without instructions.
- **SC-002**: 100% of the authentication screens (sign-up, sign-in, forgot password, OTP, reset) are reachable at their routes and render without errors.
- **SC-003**: Invalid credentials and invalid OTP inputs each display a clear inline error in 100% of tested cases.
- **SC-004**: The five roles and their responsibilities are visible on screen and match the source documents verbatim.

## Assumptions

- Reviewers have a modern desktop browser; mobile layout is not required this phase.
- Mock users exist for each role so role-based navigation can be demonstrated.
- The "25% on delivery / 75% next day" and other financial rules are unrelated to this feature.
- The exact production permission matrix will be defined after the open item in Specifications §9 is confirmed.

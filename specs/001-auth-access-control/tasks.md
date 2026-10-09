# Tasks: Authentication & Access Control

**Input**: Design documents from `/specs/001-auth-access-control/`

**Prerequisites**: plan.md (required), spec.md (required)

**Organization**: Tasks are grouped by user story. Paths target the Next.js app under `frontend/`.

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Initialize the Next.js app in `frontend/` (`package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`)
- [ ] T002 [P] Create `frontend/lib/types.ts` with `User`, `Role`, `RoleName`, `OtpSession` types
- [ ] T003 [P] Create `frontend/lib/data/users.ts` and `frontend/lib/data/roles.ts` mock modules
- [ ] T004 Create `frontend/app/globals.css` with Tailwind directives and base color tokens
- [ ] T005 Create `frontend/app/layout.tsx` (root layout) and `frontend/app/page.tsx` (redirect to `/auth/login`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ CRITICAL**: The shared shell and UI kit must exist before any auth route can be built.

- [ ] T006 Build `components/shell/AppShell.tsx`, `Sidebar.tsx`, and `Header.tsx` (shared layout)
- [ ] T007 [P] Build `components/ui/Button.tsx`, `Input.tsx`, `Card.tsx`, `Alert.tsx`, `Badge.tsx`
- [ ] T008 Add role-based navigation gating in `Sidebar.tsx` using `roleModuleAccess`
- [ ] T009 Create `frontend/lib/auth.ts` with mock `signIn()`, `requestOtp()`, `verifyOtp()` helpers

**Checkpoint**: Shared shell, UI kit, and auth helpers ready.

---

## Phase 3: User Story 1 - Sign in (Priority: P1) 🎯 MVP

**Goal**: A user can sign in with email + password and reach the shell.

**Independent Test**: Open `/auth/login`, sign in with `owner@example.com` / `demo1234`, confirm redirect to the shell.

- [ ] T010 [P] [US1] Create `app/auth/login/page.tsx` with a `"use client"` form (labeled email + password)
- [ ] T011 [P] [US1] Create `app/auth/signup/page.tsx` with email + password + confirm fields
- [ ] T012 [US1] Implement sign-in validation and mock authentication via `lib/auth.ts`
- [ ] T013 [US1] Add inline error states ("Email or password is incorrect", required-field messages)
- [ ] T014 [US1] Add simulated loading state on submit (disable button, show "Signing in…")

**Checkpoint**: Sign-in works end to end with mock credentials.

---

## Phase 4: User Story 2 - Forgot password OTP flow (Priority: P2)

**Goal**: A user can request, verify, and use an OTP to reset a password.

**Independent Test**: From `/auth/login`, complete reset flow using OTP `123456` and return to sign in.

- [ ] T015 [P] [US2] Create `app/auth/forgot-password/page.tsx` (email step + OTP step)
- [ ] T016 [P] [US2] Create `app/auth/reset-password/page.tsx` (new password + confirm)
- [ ] T017 [US2] Implement OTP request, code-sent confirmation, and resend countdown
- [ ] T018 [US2] Implement OTP verification (accept `123456`, reject others) with error/expired states
- [ ] T019 [US2] Implement password reset confirmation and redirect to sign in

**Checkpoint**: Full recovery flow works with the mock OTP.

---

## Phase 5: User Story 3 - Roles & role-based navigation (Priority: P3)

**Goal**: Roles are visible and navigation reflects the signed-in role.

**Independent Test**: Open `/auth/roles`; sign in as `finance@example.com` and confirm only Finance modules are enabled.

- [ ] T020 [US3] Create `app/auth/roles/page.tsx` listing the five roles and responsibilities from `lib/data/roles.ts`
- [ ] T021 [US3] Render the signed-in user's name and role in `Header.tsx`
- [ ] T022 [US3] Visually disable modules outside the signed-in role with an explanatory tooltip/note

**Checkpoint**: All three stories independently functional.

---

## Phase 6: Polish & Cross-Cutting

- [ ] T023 [P] Verify every route renders by running `npm run dev` and visiting each path
- [ ] T024 Add a `[NEEDS CLARIFICATION]` note on `/auth/roles`: final role list pending client confirmation
- [ ] T025 Keyboard-focus and contrast pass across all auth routes
- [ ] T026 Ensure `npm run build` passes with no type errors

---

## Dependencies & Execution Order

- Setup (Phase 1) → Foundational (Phase 2) → User Stories (3–5) → Polish (6).
- US1 is required before US2 (reset returns to sign-in) and before US3 (role gating needs a signed-in user).
- US2 and US3 are independent of each other.

## Notes

- `[P]` tasks touch different files and can run in parallel.
- Screens requiring interactivity use `"use client"`; presentational components stay server components.
- No automated tests this phase; verification is by visiting routes in the browser.

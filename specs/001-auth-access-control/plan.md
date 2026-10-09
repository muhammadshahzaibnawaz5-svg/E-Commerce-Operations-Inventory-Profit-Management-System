# Implementation Plan: Authentication & Access Control

**Branch**: `001-auth-access-control` | **Date**: 2026-10-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-auth-access-control/spec.md`

## Summary

Build the authentication and access-control UI as Next.js App Router routes: sign-up, sign-in, the forgot-password OTP flow, and a roles reference screen, plus the shared application shell that shows the signed-in user and gates navigation by role. All behavior is simulated client-side with typed mock data. No backend or API routes.

## Technical Context

**Language/Version**: TypeScript 5.x on Next.js 15 (App Router), React 19

**Primary Dependencies**: `next`, `react`, `react-dom`, `tailwindcss`

**Storage**: N/A — typed mock data in `frontend/lib/data/*.ts`

**Testing**: Manual browser review via `npm run dev`; `npm run build` must type-check

**Target Platform**: Modern desktop browsers

**Project Type**: Frontend-only Next.js web app (markup phase)

**Performance Goals**: Pages render instantly from local components; no network dependency

**Constraints**: No backend, no database, no API routes, no server actions this phase

**Scale/Scope**: 5 routes (sign-up, sign-in, forgot-password, reset-password, roles) + shared shell

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|---|---|---|
| I. Client-Reviewable Prototype | PASS | Runs with `npm run dev`; OTP and credentials are mocked. |
| II. UI Consistency | PASS | Uses the shared shell and `components/ui`; role/status names match source docs. |
| III. Frontend-Only, Not Backend | PASS | No API routes or server actions; `"use client"` only on interactive forms. |
| IV. Mock-Data Separation | PASS | Users, roles, OTP in `lib/data`; access via `lib/auth.ts`; empty/error states defined. |
| V. Accessibility & Clarity | PASS | Semantic forms with labels; keyboard-reachable controls; errors are text, not color-only. |

No violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-auth-access-control/
├── spec.md
├── plan.md              # This file
├── mock-data.md         # Route + component inventory + mock shapes
├── tasks.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
frontend/
├── app/
│   ├── layout.tsx               # root layout (mounts AppShell)
│   ├── page.tsx                 # entry -> redirect to /auth/login
│   ├── globals.css              # Tailwind directives + base tokens
│   └── auth/
│       ├── login/page.tsx
│       ├── signup/page.tsx
│       ├── forgot-password/page.tsx
│       ├── reset-password/page.tsx
│       └── roles/page.tsx
├── components/
│   ├── shell/                   # AppShell, Sidebar, Header
│   └── ui/                      # Button, Input, Card, Alert, Badge
└── lib/
    ├── types.ts                 # User, Role, OtpSession types
    ├── data/
    │   ├── users.ts
    │   └── roles.ts
    └── auth.ts                  # mock sign-in / OTP helpers
```

**Structure Decision**: A frontend-only Next.js app rooted at `frontend/`. All features share `app/`, `components/`, and `lib/`; feature routes live in their own `app/<feature>/` folder.

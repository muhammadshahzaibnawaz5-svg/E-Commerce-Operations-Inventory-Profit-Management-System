# Shopify-Integrated Software Constitution

This constitution governs the **frontend markup phase** of the E-Commerce Operations, Inventory & Profit Management System. The current deliverable is a clickable UI prototype built with Next.js that the client can review in a browser. Backend, database, and third-party integrations are intentionally deferred.

## Core Principles

### I. Client-Reviewable Prototype

The deliverable of this phase is a runnable prototype, not a working product.

- The app MUST start with a single `npm run dev` (and build with `npm run build`) with no external services, credentials, or environment setup required.
- All content MUST be driven by mocked data. No API routes, server actions, network calls, or persisted storage are required.
- Interactions MUST be simulated locally (navigation, toggles, filters, modals) so a reviewer can click through the intended flow.

**Rationale:** The client evaluates layout, wording, and flow before any engineering cost is committed. If the prototype needs backend setup to view, it has failed its purpose.

### II. UI Consistency

One coherent interface; every screen MUST feel like part of the same product.

- A shared shell (header, sidebar navigation, page-title area) is reused across routes via the root layout and shared layout components.
- Labels, status names, and terminology MUST match the source documents exactly (for example: New → Confirmed → Packed → Shipped → Delivered; Cancelled, Returned, Failed Delivery, Refunded).
- Reusable visual components (tables, cards, badges, forms, buttons) MUST be built once in `components/ui/`, not re-invented per route.

**Rationale:** Inconsistent screens make the client question the underlying system. Consistency signals reliability and reduces review churn.

### III. Frontend-Only, Not Backend

The prototype is a frontend-only Next.js application; the backend is explicitly out of scope this phase.

- Use **Next.js App Router** with **TypeScript** and **Tailwind CSS** for styling. No other frameworks unless justified.
- Do NOT add API routes (`app/api`), server actions, middleware performing auth, a database, or any ORM this phase.
- App Router components are **server components by default**; add `"use client"` only where interactivity (state, events, browser APIs) is required.
- No secrets, tokens, or real credentials may appear anywhere in the codebase; use obviously fake sample data.

**Rationale:** Keeping the phase frontend-only lets the client review the UI without committing to backend architecture, while Next.js keeps the eventual path to a real backend open.

### IV. Mock-Data Separation

Mock data MUST be separated from presentation so it can be replaced later without rewriting screens.

- Mock records MUST live in typed modules under `frontend/lib/data/*.ts`, never hard-coded row-by-row inside JSX.
- Screens MUST access data through small typed functions (e.g. `getOrders()`), so swapping in a real data source later is a substitution rather than a rewrite.
- Mock shapes SHOULD mirror the entities described in the source Specifications (§6 logical data model) so the eventual real data model is recognizable.
- Shared domain types MUST live in `frontend/lib/types.ts`. Every data-driven screen MUST define its empty, loading, and error states, not just the happy path.

**Rationale:** Clean separation keeps the prototype honest about real data shapes and makes the later transition to a live backend a substitution rather than a rewrite.

### V. Accessibility & Clarity

The prototype MUST be usable and legible for non-technical reviewers.

- Use semantic HTML in JSX (`nav`, `main`, `table`, `form`, `label`, `button`) with accessible names.
- Ensure keyboard focus is visible and interactive controls are reachable by keyboard.
- Maintain sufficient color contrast and do not rely on color alone to convey status (pair with text or icons).
- Prefer plain, business-friendly wording over jargon.

**Rationale:** The audience for review is business stakeholders, and accessibility is a baseline quality expectation, not a later enhancement.

## Scope Discipline

- This phase covers **UI markup only**. Authentication enforcement, PostgreSQL, and the Shopify / Meta / courier integrations are OUT OF SCOPE and MUST be referenced only as future work.
- Open questions from the source documents MUST be carried forward as `[NEEDS CLARIFICATION]` markers rather than silently guessed.
- Any dependency added to `package.json` MUST serve the UI prototype; utility libraries that are not required should not be introduced.

## Development Workflow & Quality Gates

- Work proceeds spec → plan → tasks per feature under `specs/`.
- A feature's `tasks.md` is the checklist of markup to produce; each task names an exact file path under `frontend/`.
- A screen is considered done when it renders at its route, follows the shared shell and components, includes its empty/loading/error states, and matches the terminology of this constitution.
- Reviewers verify screens in the browser; no automated test suite is required this phase. `npm run build` MUST succeed without type errors.

## Governance

- This constitution supersedes ad-hoc styling and naming choices where they conflict.
- Amendments require updating this file with a rationale and a version bump.
- The `## Constitution Check` section of every `plan.md` MUST be evaluated against Principles I–V; violations must be explicitly justified or removed.

**Version**: 2.0.0 | **Ratified**: 2026-10-09 | **Last Amended**: 2026-10-09

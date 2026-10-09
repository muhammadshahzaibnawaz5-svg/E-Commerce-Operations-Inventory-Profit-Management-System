# Spec Kit Conversion Plan

**Project:** E-Commerce Operations, Inventory & Profit Management System (Shopify-Integrated Software)
**Sources:** `Requirements.md`, `Specifications.md`
**Approach:** Generate the Spec Kit structure directly (no `specify` CLI install).
**Phase:** Frontend markup only — no backend, no database, no API integration yet. Goal is a clickable UI prototype for client review.
**Markup stack:** Next.js (App Router) + TypeScript + Tailwind CSS. No backend, database, or API routes this phase.
**Data handling:** `mock-data.md` per feature (route + component inventory and typed mock shapes) replaces `data-model.md`; no `contracts/` this phase.

---

## 1. Goal

Convert `Requirements.md` and `Specifications.md` into a Spec Kit project whose **8 feature specs describe a Next.js frontend markup (clickable UI prototype)** deliverable. The original documents are left untouched.

---

## 2. Shared scaffold `.specify/`

```text
.specify/
├── memory/
│   └── constitution.md        # principles tailored to this phase
├── templates/
│   ├── spec-template.md       # copied verbatim from spec-kit
│   ├── plan-template.md       # copied verbatim from spec-kit
│   ├── tasks-template.md      # copied verbatim from spec-kit
│   └── checklist-template.md  # copied verbatim from spec-kit
├── feature.json               # { "feature_directory": "specs/001-auth-access-control" }
└── init-options.json          # { "feature_numbering": "sequential" }
```

### Constitution principles (this phase)
- **Client-Reviewable Prototype** — runs with `npm run dev`; no backend, database, or API integration; all data is mock.
- **UI Consistency** — shared layout, navigation, components, and status vocabulary across screens.
- **Frontend-Only, Not Backend** — Next.js App Router with TypeScript and Tailwind only; no API routes, server actions, or database this phase.
- **Mock-Data Separation** — typed local mock data modules under `lib/data/`, accessed through small typed functions so real data can replace them later.
- **Accessibility** — semantic markup, keyboard navigation, adequate contrast and labels.
- **Scope Discipline** — markup only this phase; backend concerns are documented as out of scope.

---

## 3. Feature specs `specs/`

Eight features derived from the two source documents:

| Dir | Feature | Source sections | Depends on |
|---|---|---|---|
| `001-auth-access-control` | Sign up/in, OTP password reset, roles & permissions | Spec §3.1 (AUTH-01..03), Req §4.12 | — |
| `002-shopify-store-integration` | Store connect UI, sync status, store tagging | Spec §3.2, §3.3 | 001 |
| `003-order-delivery-courier` | Order lifecycle, 4 couriers, tracking, courier charges | Spec §3.5, §3.6; Req §4.2–4.3 | 002 |
| `004-payments-settlements` | Prepaid vs COD, 25%/75% split, received/pending/settled | Spec §3.7; Req §4.4, §5.3 | 003 |
| `005-returns-refunds` | Returns/failed delivery, courier deduction, restock | Spec §3.8; Req §4.5 | 003, 004 |
| `006-inventory-production-suppliers` | Raw/packaging/finished stock, production, low-stock, suppliers | Spec §3.9, §3.10; Req §4.6–4.7 | 002 |
| `007-advertising-expenses` | Meta/TikTok ad spend + manual expenses | Spec §3.4, §3.11; Req §4.8–4.9 | 001 |
| `008-profit-loss-dashboard-reports` | P&L formulas, dashboard, reports + export | Spec §3.12, §4; Req §4.10–4.11 | 003–007 |

### Per-feature artifacts
Each feature directory contains:

- `spec.md` — prioritized user stories (P1/P2...), functional requirements (`FR-001...`) mapped from source IDs, key entities, measurable success criteria (`SC-001...`), assumptions.
- `plan.md` — Summary, Technical Context (Next.js App Router / TypeScript / Tailwind CSS; React components; no API routes; mock data in `lib/data/`; manual browser-review testing), Constitution Check, project structure.
- `mock-data.md` — route + component inventory, UI states (empty/loading/error), and typed mock shapes.
- `tasks.md` — dependency-ordered tasks grouped by user story with `[P]` / `[US#]` labels targeting `frontend/app/<route>/*` and `frontend/components/*`.
- `checklists/requirements.md` — spec-quality gate.

**No `contracts/` this phase** (no APIs).

### Preserved from source
- Specifications §9 open items become `[NEEDS CLARIFICATION]` markers in the relevant feature specs and checklist items.
- The §5.3 25%/75% payment rule and the §4.4 worked-example math discrepancy are flagged in `004` and `008`.

---

## 4. Target output tree

```text
.specify/
├── memory/constitution.md
├── templates/{spec,plan,tasks,checklist}-template.md
├── feature.json
└── init-options.json

specs/
├── 001-auth-access-control/
├── 002-shopify-store-integration/
├── 003-order-delivery-courier/
├── 004-payments-settlements/
├── 005-returns-refunds/
├── 006-inventory-production-suppliers/
├── 007-advertising-expenses/
└── 008-profit-loss-dashboard-reports/
    (each: spec.md, plan.md, mock-data.md, tasks.md, checklists/requirements.md)

frontend/                         # Next.js app (built later from tasks.md)
├── app/                          # App Router routes
├── components/                   # shared shell + ui + charts
└── lib/                          # mock data + typed helpers
```

---

## 5. Notes

- `Requirements.md` and `Specifications.md` remain unchanged.
- Backend, database, API routes, and Shopify/Meta/courier integrations are captured only as future scope in "Out of Scope (this phase)" lines.
- Actual Next.js markup files are produced from each `tasks.md` later (or on request); this conversion step creates the Spec Kit artifacts only.

---

**Status:** Approved — building.
**Created:** 2026-10-09
**Updated:** 2026-10-09 — markup stack changed from plain HTML/CSS/JS to Next.js (App Router + TypeScript + Tailwind).

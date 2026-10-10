# Markup Implementation Plan

**Project:** E-Commerce Operations, Inventory & Profit Management System (Shopify-Integrated Software)
**Phase:** Frontend markup only — clickable UI prototype for client review.
**Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS. No backend, database, or API routes.
**Status:** Approved — building.

---

## 1. Decisions

| Decision | Choice |
|---|---|
| Scaffold | `create-next-app` into `frontend/` (App Router, TS, Tailwind, npm) |
| Rendering | Server components by default; `"use client"` only for interactive leaves |
| Style | Data-Dense Dashboard (ui-ux-pro-max): blue `#1E40AF` primary, amber `#D97706` accent, muted slate `#F8FAFC` background, WCAG AA |
| Theme | Light only (token-ready for future dark) |
| Typography | Fira Sans (body/UI) + Fira Code (tabular money/digits) via `next/font/google` |
| Charts | Inline SVG (`BarChart`, `LineChart`) — no chart library |
| Icons | Lucide (SVG), no emojis |
| Currency | PKR / `Rs.` via one constant in `lib/format.ts` |
| Commits | Not made by tooling; user pushes on their own (working tree only) |
| Terminology | Verbatim from Requirements/Specifications (statuses, rule names) |

## 2. Route Inventory (27 routes)

| Feature | Routes |
|---|---|
| 001 auth | `/`, `/auth/login`, `/auth/signup`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/roles` |
| 002 store | `/settings/store`, `/settings/stores` |
| 003 orders & couriers | `/orders`, `/orders/[id]`, `/couriers`, `/couriers/[id]` |
| 004 payments | `/payments`, `/payments/[id]` |
| 005 returns | `/returns`, `/returns/[id]` |
| 006 inventory & suppliers | `/inventory/materials`, `/inventory/packaging`, `/inventory/finished-goods`, `/inventory/production`, `/suppliers`, `/suppliers/[id]` |
| 007 ads & expenses | `/marketing/ads`, `/expenses`, `/expenses/new` |
| 008 dashboard/P&L/reports | `/dashboard`, `/profit-loss`, `/reports` |

## 3. Structure

```text
frontend/
├── app/
│   ├── layout.tsx               # root layout: fonts + providers
│   ├── page.tsx                 # redirect → /auth/login
│   ├── (shipboard)/
│   │   ├── layout.tsx           # AppShell (sidebar + header)
│   │   ├── dashboard/
│   │   ├── orders/, orders/[id]/ , couriers/, couriers/[id]/
│   │   ├── payments/, payments/[id]/
│   │   ├── returns/, returns/[id]/
│   │   ├── inventory/{materials,packaging,finished-goods,production}/
│   │   ├── suppliers/, suppliers/[id]/
│   │   ├── marketing/ads/
│   │   ├── expenses/, expenses/new/
│   │   ├── profit-loss/, reports/
│   │   └── settings/store/, settings/stores/
│   └── auth/{login,signup,forgot-password,reset-password,roles}/
├── components/
│   ├── ui/                      # Button, Input, Card, Badge, Alert, Table, Modal, Tabs, EmptyState, Skeleton, ProgressBar, StatCard, Select…
│   ├── shell/                   # AppShell, Sidebar, Header
│   ├── charts/                  # BarChart, LineChart (inline SVG)
│   └── <feature>/               # per-feature client components
└── lib/
    ├── types.ts                 # all entity types from mock-data.md
    ├── format.ts                # PKR money, date, number helpers
    ├── session.ts               # mock current-user provider + role nav map
    ├── data/                    # users, roles, stores, orders, couriers, payments, returns, inventory, suppliers, advertising, expenses
    └── <feature>.ts             # typed helpers (auth, store, orders, payments, returns, inventory, expenses, profit)
```

## 4. Execution Order

1. **Phase 0 — Foundation**: scaffold, design tokens, `lib/types.ts`, `lib/format.ts`, `lib/data/*`, UI kit, shell + session provider, route groups.
2. **Phases 1–8 — Features 001→008**: implement each route with all required UI states (populated, empty, filtered, low-stock, shortfall, missing-cost, loss, export-demo, validation, success…).
3. **Phase 9 — QA & delivery**: full state coverage audit, terminology audit vs source docs, `[NEEDS CLARIFICATION]` notes surfaced, `npm run build` green (zero type errors), `npm run dev` spot-check, client review guide.

## 5. Gates

- `npm run build` MUST pass without type errors.
- Terminology MUST match source documents exactly.
- No emojis as icons; focus visible; contrast 4.5:1; status never color-only.
- Mock data ONLY in `lib/data/*`; pages never hard-code rows.

**Created:** 2026-10-10
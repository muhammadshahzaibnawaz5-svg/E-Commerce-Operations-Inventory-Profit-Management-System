# Implementation Plan: Order, Delivery & Courier Management

**Branch**: `003-order-delivery-courier` | **Date**: 2026-10-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-order-delivery-courier/spec.md`

## Summary

Build the operational core UI as Next.js App Router routes: an orders list with filtering, an order detail route with lifecycle history and cost breakdown, and courier list/detail routes with shipment tracking and separated courier charges. All data is mocked and accessed through typed helpers. No backend or API routes.

## Technical Context

**Language/Version**: TypeScript 5.x on Next.js 15 (App Router), React 19

**Primary Dependencies**: `next`, `react`, `react-dom`, `tailwindcss`

**Storage**: N/A — typed mock data in `frontend/lib/data/`; dynamic route param (`[id]`) selects records

**Testing**: Manual browser review via `npm run dev`; `npm run build` must type-check

**Target Platform**: Modern desktop browsers

**Project Type**: Frontend-only Next.js web app (markup phase)

**Performance Goals**: Instant local rendering; client-side filtering of a few hundred mock rows

**Constraints**: No backend, no API, no API routes

**Scale/Scope**: 4 routes (`/orders`, `/orders/[id]`, `/couriers`, `/couriers/[id]`)

## Constitution Check

| Principle | Status | Notes |
|---|---|---|
| I. Client-Reviewable Prototype | PASS | Filters, search, and tracking are client-side simulations over mock data. |
| II. UI Consistency | PASS | Status badges and lifecycle labels match source docs; shared table/card components reused. |
| III. Frontend-Only, Not Backend | PASS | List/detail pages are server components; only the filter panel is `"use client"`. |
| IV. Mock-Data Separation | PASS | Orders, couriers, shipments in `lib/data`; accessed via `lib/orders.ts`; empty/error states defined. |
| V. Accessibility & Clarity | PASS | Semantic tables, labeled filters, focus-visible rows, text status labels. |

No violations.

## Project Structure

### Documentation (this feature)

```text
specs/003-order-delivery-courier/
├── spec.md
├── plan.md
├── mock-data.md
├── tasks.md
└── checklists/requirements.md
```

### Source Code (repository root)

```text
frontend/
├── app/
│   ├── orders/
│   │   ├── page.tsx              # orders table + filters/search
│   │   └── [id]/page.tsx         # items, customer, payment, courier, cost breakdown, history
│   └── couriers/
│       ├── page.tsx              # four couriers + charges summary
│       └── [id]/page.tsx         # shipments + tracking events + charge breakdown
├── components/
│   ├── ui/                       # reuse Badge, Card, Table primitives
│   ├── orders/OrderTable.tsx     # client filter/search table
│   ├── orders/StatusTimeline.tsx
│   └── couriers/TrackingList.tsx
└── lib/
    ├── types.ts                  # Order, OrderItem, OrderStatusHistory, Courier, Shipment, TrackingEvent, CourierCharge
    ├── data/
    │   ├── orders.ts
    │   └── couriers.ts
    └── orders.ts                 # getOrders(), getOrderById(), getCourierById()
```

**Structure Decision**: Order routes in `app/orders/`, courier routes in `app/couriers/`. Detail views use the dynamic `[id]` segment; data is fetched through typed helpers in `lib/`.

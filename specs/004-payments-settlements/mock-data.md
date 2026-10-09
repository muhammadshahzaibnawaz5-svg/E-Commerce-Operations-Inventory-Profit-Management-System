# Mock Data & Screen Inventory: Payments & Settlements

**Feature**: `004-payments-settlements`

## Routes & Components

| Route | Page file | Purpose | Key states |
|---|---|---|---|
| `/payments` | `app/payments/page.tsx` | Browse + filter payments | populated, filtered, empty |
| `/payments/[id]` | `app/payments/[id]/page.tsx` | 25% / 75% split | awaiting-delivery, partial (25% only), settled |

Shared: `components/payments/PaymentsTable.tsx`, `SummaryCards.tsx`, `TrancheCard.tsx`.

## UI States

- **populated** — table + summary cards rendered.
- **empty** — "No payments match your filters".
- **awaiting-delivery** — order not delivered; no tranches yet.
- **partial** — 25% received, 75% pending ("Partially received").
- **settled** — both tranches received.

## Mock Data Shapes (`frontend/lib/types.ts` + `frontend/lib/data/payments.ts`)

### Payment
```ts
export type PaymentKind = "Prepaid" | "COD";
export type SettlementStatus = "Pending" | "PartiallyReceived" | "Received" | "Settled";

export interface Payment {
  id: string;
  orderId: string;
  orderNumber: string;
  customer: string;
  type: PaymentKind;
  amount: number;
  status: SettlementStatus;
  deliveredAt: string | null;
}

export interface SettlementTranche {
  share: "25%" | "75%";
  label: string;
  amount: number;
  dueDate: string;
  status: "Received" | "Pending";
}
```

### data/payments.ts
```ts
export const payments: Payment[] = [
  { id: "pay_1001", orderId: "ord_1001", orderNumber: "ORD-1001", customer: "Maria Gomez", type: "COD",     amount: 5000,  status: "Settled",           deliveredAt: "2026-10-09T10:15:00Z" },
  { id: "pay_1002", orderId: "ord_1002", orderNumber: "ORD-1002", customer: "John Carter", type: "Prepaid", amount: 10000, status: "PartiallyReceived", deliveredAt: "2026-10-09T12:40:00Z" },
  { id: "pay_1003", orderId: "ord_1004", orderNumber: "ORD-1004", customer: "Priya Sharma", type: "COD",    amount: 3000,  status: "Pending",           deliveredAt: null },
];
```

### Derived helpers (`frontend/lib/payments.ts`)
```ts
export function computeSplit(amount: number): { advance: number; remainder: number } {
  return { advance: amount * 0.25, remainder: amount * 0.75 };
}

export const sampleTranches: SettlementTranche[] = [
  { share: "25%", label: "On delivery", amount: 1250, dueDate: "2026-10-09", status: "Received" },
  { share: "75%", label: "Next day",    amount: 3750, dueDate: "2026-10-10", status: "Pending"  },
];
```

### Summary (derived)
```ts
export interface PaymentSummary { received: number; pending: number; settled: number; }
export const sampleSummary: PaymentSummary = { received: 22500, pending: 6750, settled: 15000 };
```

## Notes

- The 25%/75% split is computed in `lib/payments.ts`, not stored, so it stays consistent across features.
- "Next day" in mock data = delivery date + 1 day.
- Returned-order adjustments are handled by feature 005 and referenced here.

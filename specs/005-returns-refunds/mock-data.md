# Mock Data & Screen Inventory: Returns & Refunds

**Feature**: `005-returns-refunds`

## Routes & Components

| Route | Page file | Purpose | Key states |
|---|---|---|---|
| `/returns` | `app/returns/page.tsx` | Browse + filter returns | populated, filtered, empty |
| `/returns/[id]` | `app/returns/[id]/page.tsx` | Deduction + restock | populated, shortfall, missing-courier-cost, awaiting-inspection |

Shared: `components/returns/ReturnsTable.tsx`, `RestockToggle.tsx`.

## UI States

- **populated** — table/cards rendered.
- **filtered** — subset with count.
- **empty** — "No returns match your filters".
- **shortfall** — courier cost ≥ advance; returned amount = 0 with explanation.
- **missing-courier-cost** — courier cost unknown; refund figure blocked.
- **awaiting-inspection** — restock decision not yet made.

## Mock Data Shapes (`frontend/lib/types.ts` + `frontend/lib/data/returns.ts`)

### Return
```ts
export type ReturnReason = "Customer Return" | "Failed Delivery" | "Refused";
export type RestockStatus = "Awaiting inspection" | "Restocked" | "Written off";

export interface ReturnItem { product: string; sellable: boolean | null; }

export interface Return {
  id: string;
  orderId: string;
  orderNumber: string;
  customer: string;
  reason: ReturnReason;
  courier: string;
  advance: number;
  courierCost: number | null;
  amountReturned: number;
  restockStatus: RestockStatus;
  items: ReturnItem[];
}
```

### data/returns.ts
```ts
export const returns: Return[] = [
  {
    id: "ret_1001", orderId: "ord_1003", orderNumber: "ORD-1003", customer: "Aisha Noor",
    reason: "Customer Return", courier: "Courier C",
    advance: 625, courierCost: 250, amountReturned: 375,
    restockStatus: "Awaiting inspection",
    items: [{ product: "Gift Box - Small", sellable: null }],
  },
  {
    id: "ret_1002", orderId: "ord_1005", orderNumber: "ORD-1005", customer: "Dan Lee",
    reason: "Failed Delivery", courier: "Courier A",
    advance: 1250, courierCost: 1300, amountReturned: 0,
    restockStatus: "Written off",
    items: [{ product: "Gift Box - Large", sellable: false }],
  },
];
```

**Reason values**: `Customer Return`, `Failed Delivery`, `Refused`
**Restock status values**: `Awaiting inspection`, `Restocked`, `Written off`

## Notes

- `advance` is 25% of the order total (consistent with feature 004).
- `amountReturned = max(advance − courierCost, 0)` computed in `lib/returns.ts`.
- The restock toggle updates `restockStatus` in client state when the same mock object is mutated in-session.

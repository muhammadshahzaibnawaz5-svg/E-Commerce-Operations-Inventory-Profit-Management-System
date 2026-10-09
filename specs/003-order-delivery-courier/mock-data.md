# Mock Data & Screen Inventory: Order, Delivery & Courier Management

**Feature**: `003-order-delivery-courier`

## Routes & Components

| Route | Page file | Purpose | Key states |
|---|---|---|---|
| `/orders` | `app/orders/page.tsx` | Browse + filter orders | populated, filtered, empty |
| `/orders/[id]` | `app/orders/[id]/page.tsx` | Full order + history | populated, unassigned-courier, outcome |
| `/couriers` | `app/couriers/page.tsx` | Four couriers + charges | populated |
| `/couriers/[id]` | `app/couriers/[id]/page.tsx` | Shipments + tracking | populated, no-events |

Shared: `components/orders/OrderTable.tsx`, `StatusTimeline.tsx`, `components/couriers/TrackingList.tsx`.

## UI States

- **populated** — rows/cards rendered.
- **filtered** — subset of rows with a result count.
- **empty** — "No orders match your filters".
- **loading** — `loading.tsx` skeleton while the detail route resolves.
- **outcome** — order shows a Cancelled/Returned/Failed Delivery/Refunded badge.

## Mock Data Shapes (`frontend/lib/types.ts`)

### Order
```ts
export type OrderStatus = "New" | "Confirmed" | "Packed" | "Shipped" | "Delivered";
export type OrderOutcome = "Cancelled" | "Returned" | "Failed Delivery" | "Refunded";
export type PaymentType = "Prepaid" | "COD";

export interface OrderItem { product: string; qty: number; unitPrice: number; }
export interface OrderCosts { manufacturing: number; packaging: number; courier: number; advertising: number; }

export interface Order {
  id: string;
  orderNumber: string;
  placedAt: string;
  customer: string;
  status: OrderStatus | OrderOutcome;
  courier: string | null;
  paymentType: PaymentType;
  total: number;
  items: OrderItem[];
  costs: Partial<OrderCosts>;
}
```

### data/orders.ts
```ts
export const orders: Order[] = [
  { id: "ord_1001", orderNumber: "ORD-1001", placedAt: "2026-10-08", customer: "Maria Gomez", status: "Delivered", courier: "Courier A", paymentType: "COD", total: 5000,
    items: [{ product: "Gift Box - Large", qty: 1, unitPrice: 5000 }], costs: { manufacturing: 2200, packaging: 100, courier: 300, advertising: 200 } },
  { id: "ord_1002", orderNumber: "ORD-1002", placedAt: "2026-10-08", customer: "John Carter", status: "Shipped", courier: "Courier B", paymentType: "Prepaid", total: 10000,
    items: [{ product: "Gift Box - Large", qty: 2, unitPrice: 5000 }], costs: { manufacturing: 4400, packaging: 200, courier: 300, advertising: 400 } },
  { id: "ord_1003", orderNumber: "ORD-1003", placedAt: "2026-10-07", customer: "Aisha Noor", status: "Returned", courier: "Courier C", paymentType: "COD", total: 2500,
    items: [{ product: "Gift Box - Small", qty: 1, unitPrice: 2500 }], costs: { manufacturing: 1100, packaging: 80, courier: 250, advertising: 150 } },
];
```

**Lifecycle values**: `New`, `Confirmed`, `Packed`, `Shipped`, `Delivered`
**Outcome values**: `Cancelled`, `Returned`, `Failed Delivery`, `Refunded`

### OrderStatusHistory
```ts
export interface OrderStatusHistory {
  orderId: string; status: string; changedAt: string; changedBy: string;
}
```
```ts
export const orderStatusHistory: OrderStatusHistory[] = [
  { orderId: "ord_1001", status: "New",       changedAt: "2026-10-08T09:00:00Z", changedBy: "System" },
  { orderId: "ord_1001", status: "Confirmed", changedAt: "2026-10-08T09:20:00Z", changedBy: "Omar Farooq" },
  { orderId: "ord_1001", status: "Packed",    changedAt: "2026-10-08T11:00:00Z", changedBy: "Omar Farooq" },
  { orderId: "ord_1001", status: "Shipped",   changedAt: "2026-10-08T14:00:00Z", changedBy: "Courier A" },
  { orderId: "ord_1001", status: "Delivered", changedAt: "2026-10-09T10:15:00Z", changedBy: "Courier A" },
];
```

### Courier / Shipment
```ts
export interface Courier { id: string; name: string; isActive: boolean; apiAvailable: boolean; }
export interface CourierCharge { shipping: number; cod: number; return: number; }
export interface TrackingEvent { at: string; description: string; }
export interface Shipment {
  id: string; orderId: string; courierId: string; trackingNumber: string;
  status: string; charges: CourierCharge; events: TrackingEvent[];
}
```
```ts
export const couriers: Courier[] = [
  { id: "cr_1", name: "Courier A", isActive: true, apiAvailable: false },
  { id: "cr_2", name: "Courier B", isActive: true, apiAvailable: false },
  { id: "cr_3", name: "Courier C", isActive: true, apiAvailable: false },
  { id: "cr_4", name: "Courier D", isActive: true, apiAvailable: false },
];

export const shipments: Shipment[] = [
  { id: "sh_1", orderId: "ord_1001", courierId: "cr_1", trackingNumber: "TRK-9F2K1", status: "Delivered",
    charges: { shipping: 200, cod: 60, return: 0 },
    events: [
      { at: "2026-10-08T14:00:00Z", description: "Picked up" },
      { at: "2026-10-09T10:15:00Z", description: "Delivered to customer" },
    ] },
];
```

## Notes

- Courier names are generic placeholders pending Specifications §9 item 2.
- Cost figures reuse the worked example from Specifications §4.4 for realism.
- Detail routes resolve records by `id` via `lib/orders.ts`.

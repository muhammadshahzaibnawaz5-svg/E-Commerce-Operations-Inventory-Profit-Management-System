# Mock Data & Screen Inventory: Shopify Store Connection

**Feature**: `002-shopify-store-integration`

## Routes & Components

| Route | Page file | Purpose | Key states |
|---|---|---|---|
| `/settings/store` | `app/settings/store/page.tsx` | Enter name/URL and connect | default, validation-error, connecting, connected |
| `/settings/stores` | `app/settings/stores/page.tsx` | Review connected stores | empty, populated, detail-open |

Shared: `components/store/SyncProgress.tsx`; reuses `components/ui/*`.

## UI States

- **default** — form empty (connect) or list rendered (stores).
- **validation-error** — missing/blank store name or URL.
- **connecting** — simulated funnel: "Connecting… → Authenticating… → Importing…".
- **connected** — status badge "Connected" + store identity + last sync.
- **empty** — no stores connected yet, with a prompt to connect one.
- **detail-open** — a store row expanded to show synced entity counts.

## Mock Data Shapes (`frontend/lib/types.ts` + `frontend/lib/data/stores.ts`)

### Store
```ts
export type StoreConnectionStatus = "Connected" | "Disconnected" | "Error";

export interface EntityCounts {
  products: number; customers: number; orders: number;
  payments: number; refunds: number; inventory: number;
}

export interface Store {
  id: string;
  name: string;
  shopifyUrl: string;
  connectionStatus: StoreConnectionStatus;
  lastSyncedAt: string | null;
  entityCounts: EntityCounts;
}
```

### data/stores.ts
```ts
export const stores: Store[] = [
  {
    id: "st_001",
    name: "Aroma Home Goods",
    shopifyUrl: "aroma-home-goods.myshopify.com",
    connectionStatus: "Connected",
    lastSyncedAt: "2026-10-09T09:45:00Z",
    entityCounts: { products: 128, customers: 940, orders: 2130, payments: 2087, refunds: 43, inventory: 128 },
  },
];
```

### SyncRun (in progress)
```ts
export type SyncEntityState = "queued" | "importing" | "complete";

export interface SyncRun {
  storeId: string;
  startedAt: string;
  status: "connecting" | "importing" | "complete";
  entities: { name: string; state: SyncEntityState }[];
}
```
```ts
export const sampleSyncRun: SyncRun = {
  storeId: "st_001",
  startedAt: "2026-10-09T09:44:10Z",
  status: "importing",
  entities: [
    { name: "Products",  state: "complete" },
    { name: "Customers", state: "complete" },
    { name: "Orders",    state: "importing" },
    { name: "Payments",  state: "queued" },
    { name: "Refunds",   state: "queued" },
    { name: "Inventory", state: "queued" },
  ],
};
```

### SyncEntities (preview list)
```ts
export const syncEntities = [
  { name: "Products",  note: "Catalogue and product details" },
  { name: "Customers", note: "Customer records" },
  { name: "Orders",    note: "Including order status" },
  { name: "Payments",  note: "Prepaid and Cash on Delivery" },
  { name: "Refunds",   note: "Linked to the original order" },
  { name: "Inventory", note: "Stock levels" },
];
```

## Notes

- Sync is simulated with `setTimeout`; no requests leave the browser.
- The connected store may be persisted to `localStorage` under key `mockStore` for a realistic reload.
- Multi-store support is provisional pending Specifications §9 item 8.

# Mock Data & Screen Inventory: Inventory, Production & Suppliers

**Feature**: `006-inventory-production-suppliers`

## Routes & Components

| Route | Page file | Purpose | Key states |
|---|---|---|---|
| `/inventory/materials` | `app/inventory/materials/page.tsx` | Purchased/used/remaining | populated, low-stock, empty |
| `/inventory/packaging` | `app/inventory/packaging/page.tsx` | Packaging stock | populated, low-stock |
| `/inventory/finished-goods` | `app/inventory/finished-goods/page.tsx` | Product stock | populated, low-stock |
| `/inventory/production` | `app/inventory/production/page.tsx` | Record consumption/output | default, impact-preview, insufficient, success |
| `/suppliers` | `app/suppliers/page.tsx` | Supplier records | populated, empty |
| `/suppliers/[id]` | `app/suppliers/[id]/page.tsx` | Purchase history | populated, empty |

Shared: `components/inventory/StockTable.tsx`, `ProductionForm.tsx`.

## UI States

- **low-stock** — remaining ≤ threshold; amber "Low stock" text badge.
- **insufficient** — production blocked; message names the short material.
- **success** — "Production run recorded"; stock values update in-session.
- **empty** — no records / no purchases.

## Mock Data Shapes (`frontend/lib/types.ts` + `frontend/lib/data/`)

### Stock items
```ts
export interface StockItem {
  id: string; name: string; unit: string;
  purchased: number; used: number; remaining: number;
  lowStockThreshold: number;
}
export interface FinishedGood {
  id: string; product: string; unit: string; stock: number; lowStockThreshold: number;
}
```

### data/inventory.ts
```ts
export const rawMaterials: StockItem[] = [
  { id: "rm_1", name: "Base Oil", unit: "L", purchased: 500, used: 320, remaining: 180, lowStockThreshold: 100 },
  { id: "rm_2", name: "Fragrance", unit: "L", purchased: 40, used: 33, remaining: 7, lowStockThreshold: 10 },
];

export const packagingMaterials: StockItem[] = [
  { id: "pm_1", name: "Gift Box - Large", unit: "pcs", purchased: 300, used: 210, remaining: 90, lowStockThreshold: 50 },
];

export const finishedGoods: FinishedGood[] = [
  { id: "fg_1", product: "Gift Box - Large", unit: "pcs", stock: 90, lowStockThreshold: 30 },
];
```

### ProductionRun
```ts
export interface ProductionRun {
  id: string; product: string; quantity: number; producedAt: string;
  consumed: { name: string; qty: number }[];
}
```
```ts
export const productionRuns: ProductionRun[] = [
  { id: "pr_1", product: "Gift Box - Large", quantity: 50, producedAt: "2026-10-07",
    consumed: [{ name: "Base Oil", qty: 25 }, { name: "Gift Box - Large", qty: 50 }] },
];
```

### Supplier / Purchase
```ts
export interface Supplier { id: string; name: string; contact: string; totalPurchased: number; }
export interface Purchase { id: string; supplierId: string; item: string; quantity: number; unit: string; cost: number; purchasedAt: string; }
```
```ts
export const suppliers: Supplier[] = [
  { id: "sup_1", name: "RawChem Supplies", contact: "sales@rawchem.example", totalPurchased: 42000 },
];
export const purchases: Purchase[] = [
  { id: "pur_1", supplierId: "sup_1", item: "Base Oil", quantity: 500, unit: "L", cost: 42000, purchasedAt: "2026-10-05" },
];
```

## Notes

- Production mutates in-memory client state only; a page reload resets it.
- Low-stock check: `remaining <= lowStockThreshold`.
- Warehouse is assumed single in mock data pending Specifications §9 item 8.

import type { Store, SyncRun } from "@/lib/types";

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

export const sampleSyncRun: SyncRun = {
  storeId: "st_001",
  startedAt: "2026-10-09T09:44:10Z",
  status: "importing",
  entities: [
    { name: "Products", state: "complete" },
    { name: "Customers", state: "complete" },
    { name: "Orders", state: "importing" },
    { name: "Payments", state: "queued" },
    { name: "Refunds", state: "queued" },
    { name: "Inventory", state: "queued" },
  ],
};

export const syncEntities = [
  { name: "Products", note: "Catalogue and product details" },
  { name: "Customers", note: "Customer records" },
  { name: "Orders", note: "Including order status" },
  { name: "Payments", note: "Prepaid and Cash on Delivery" },
  { name: "Refunds", note: "Linked to the original order" },
  { name: "Inventory", note: "Stock levels" },
];
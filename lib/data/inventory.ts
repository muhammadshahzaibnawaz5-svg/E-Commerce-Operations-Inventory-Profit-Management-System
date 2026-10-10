import type { FinishedGood, ProductionRun, StockItem } from "@/lib/types";

export const rawMaterials: StockItem[] = [
  { id: "rm_1", name: "Base Oil", unit: "L", purchased: 500, used: 320, remaining: 180, lowStockThreshold: 100 },
  { id: "rm_2", name: "Fragrance", unit: "L", purchased: 40, used: 33, remaining: 7, lowStockThreshold: 10 },
];

export const packagingMaterials: StockItem[] = [
  { id: "pm_1", name: "Gift Box - Large", unit: "pcs", purchased: 300, used: 210, remaining: 90, lowStockThreshold: 50 },
  { id: "pm_2", name: "Gift Box - Small", unit: "pcs", purchased: 200, used: 120, remaining: 80, lowStockThreshold: 40 },
];

export const finishedGoods: FinishedGood[] = [
  { id: "fg_1", product: "Gift Box - Large", unit: "pcs", stock: 90, lowStockThreshold: 30 },
  { id: "fg_2", product: "Gift Box - Small", unit: "pcs", stock: 24, lowStockThreshold: 30 },
];

export const productionRuns: ProductionRun[] = [
  {
    id: "pr_1",
    product: "Gift Box - Large",
    quantity: 50,
    producedAt: "2026-10-07",
    consumed: [{ name: "Base Oil", qty: 25 }, { name: "Gift Box - Large", qty: 50 }],
  },
];
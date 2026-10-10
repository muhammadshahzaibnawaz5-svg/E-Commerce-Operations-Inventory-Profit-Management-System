import { finishedGoods, packagingMaterials, productionRuns, rawMaterials } from "@/lib/data/inventory";
import type { FinishedGood, ProductionRun, StockItem } from "@/lib/types";

export function getRawMaterials(): StockItem[] {
  return rawMaterials;
}

export function getPackagingMaterials(): StockItem[] {
  return packagingMaterials;
}

export function getFinishedGoods(): FinishedGood[] {
  return finishedGoods;
}

export function getProductionRuns(): ProductionRun[] {
  return productionRuns;
}

export function isLowStock(item: StockItem): boolean {
  return item.remaining <= item.lowStockThreshold;
}

export function isFinishedGoodLow(item: FinishedGood): boolean {
  return item.stock <= item.lowStockThreshold;
}

export type MaterialSource = { name: string; unit: string; available: number } | undefined;

export function findMaterial(name: string): MaterialSource {
  const raw = rawMaterials.find((m) => m.name === name);
  if (raw) return { name: raw.name, unit: raw.unit, available: raw.remaining };
  const pkg = packagingMaterials.find((m) => m.name === name);
  if (pkg) return { name: pkg.name, unit: pkg.unit, available: pkg.remaining };
  return undefined;
}

export const PRODUCTION_PRODUCTS = ["Gift Box - Large", "Gift Box - Small"];

export function validateProductionRun(
  consumed: { name: string; qty: number }[],
  product: string,
  quantity: number,
  materials: StockItem[] = [...rawMaterials, ...packagingMaterials],
): { error?: string } {
  if (!PRODUCTION_PRODUCTS.includes(product)) return { error: "Product is required" };
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { error: "Quantity must be greater than 0" };
  }
  for (const c of consumed) {
    if (!Number.isFinite(c.qty) || c.qty < 0) return { error: `Quantity for ${c.name} is invalid` };
    const material = materials.find((m) => m.name === c.name);
    if (!material) return { error: `Material ${c.name} not found` };
    if (c.qty > material.remaining) {
      return { error: `Not enough ${c.name} (${material.remaining.toLocaleString()} ${material.unit} available)` };
    }
  }
  return {};
}
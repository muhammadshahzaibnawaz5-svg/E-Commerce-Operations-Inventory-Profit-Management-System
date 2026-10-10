import { purchases, suppliers } from "@/lib/data/suppliers";
import type { Purchase, Supplier } from "@/lib/types";

export function getSuppliers(): Supplier[] {
  return suppliers;
}

export function getSupplierById(id: string): Supplier | undefined {
  return suppliers.find((s) => s.id === id);
}

export function getPurchasesForSupplier(supplierId: string): Purchase[] {
  return purchases.filter((p) => p.supplierId === supplierId);
}

export function validatePurchase(item: string, quantity: number, cost: number): { error?: string } {
  if (!item.trim()) return { error: "Item name is required" };
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { error: "Quantity must be greater than 0" };
  }
  if (!Number.isFinite(cost) || cost < 0) {
    return { error: "Cost must be 0 or more" };
  }
  return {};
}
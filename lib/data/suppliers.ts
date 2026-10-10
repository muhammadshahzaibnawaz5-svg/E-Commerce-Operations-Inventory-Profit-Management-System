import type { Purchase, Supplier } from "@/lib/types";

export const suppliers: Supplier[] = [
  { id: "sup_1", name: "RawChem Supplies", contact: "sales@rawchem.example", totalPurchased: 42000 },
  { id: "sup_2", name: "BoxMakers Pvt Ltd", contact: "orders@boxmakers.example", totalPurchased: 14500 },
];

export const purchases: Purchase[] = [
  { id: "pur_1", supplierId: "sup_1", item: "Base Oil", quantity: 500, unit: "L", cost: 42000, purchasedAt: "2026-10-05" },
  { id: "pur_2", supplierId: "sup_2", item: "Gift Box - Large", quantity: 300, unit: "pcs", cost: 14500, purchasedAt: "2026-10-04" },
];
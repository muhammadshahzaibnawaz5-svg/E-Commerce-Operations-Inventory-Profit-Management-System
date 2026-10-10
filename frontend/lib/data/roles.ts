import type { Role, RoleName } from "@/lib/types";

export const roles: Role[] = [
  { name: "Owner / Admin", description: "Full access; assigns roles; manages store connection." },
  { name: "Manager", description: "Operational oversight across modules." },
  { name: "Inventory", description: "Raw materials, packaging, production, finished stock." },
  { name: "Order Processing", description: "Order lifecycle, packing, shipping, returns handling." },
  { name: "Finance", description: "Payments, expenses, settlements, profit & loss." },
];

export const roleModuleAccess: Record<RoleName, string[]> = {
  "Owner / Admin": ["dashboard", "orders", "payments", "returns", "inventory", "suppliers", "marketing", "expenses", "settings"],
  "Manager": ["dashboard", "orders", "payments", "returns", "inventory", "suppliers", "marketing", "expenses"],
  "Inventory": ["inventory", "suppliers"],
  "Order Processing": ["orders", "returns"],
  "Finance": ["dashboard", "payments", "expenses"],
};
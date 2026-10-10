import type { ReactNode } from "react";
import { InventoryProvider } from "@/lib/inventory-store";

export default function InventoryLayout({ children }: { children: ReactNode }) {
  return <InventoryProvider>{children}</InventoryProvider>;
}

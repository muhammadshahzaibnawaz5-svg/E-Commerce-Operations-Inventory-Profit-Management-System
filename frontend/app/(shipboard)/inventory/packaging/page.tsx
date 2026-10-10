"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { StockItemTable } from "@/components/inventory/StockItemTable";
import { useInventory } from "@/lib/inventory-store";

export default function PackagingPage() {
  const { packagingMaterials } = useInventory();
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Packaging materials"
        description="Gift boxes and other packaging consumed when an order is packed."
      />
      <StockItemTable items={packagingMaterials} />
    </div>
  );
}

"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { StockItemTable } from "@/components/inventory/StockItemTable";
import { useInventory } from "@/lib/inventory-store";

export default function MaterialsPage() {
  const { rawMaterials } = useInventory();
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Raw materials"
        description="Materials purchased from suppliers, consumed in production, and remaining on hand."
      />
      <div className="mb-6">
        <Alert variant="info" title="Warehouse model">
          [NEEDS CLARIFICATION] Whether the business uses a single warehouse or multiple warehouses —
          Specifications §9, item 8. A single warehouse is assumed for the prototype.
        </Alert>
      </div>
      <StockItemTable items={rawMaterials} />
    </div>
  );
}

"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { FinishedGoodsTable } from "@/components/inventory/FinishedGoodsTable";
import { useInventory } from "@/lib/inventory-store";

export default function FinishedGoodsPage() {
  const { finishedGoods } = useInventory();
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Finished goods"
        description="Sellable stock per product, kept in sync with Shopify inventory as a status note."
      />
      <FinishedGoodsTable goods={finishedGoods} />
    </div>
  );
}

import { PageHeader } from "@/components/ui/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { ProductionPanel } from "@/components/inventory/ProductionPanel";

export default function ProductionPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Production"
        description="Record runs that convert raw and packaging materials into finished goods."
      />
      <div className="mb-6 flex flex-col gap-3">
        <Alert variant="info" title="How supplier purchases become COGS">
          [NEEDS CLARIFICATION] Whether supplier purchases are inventory (COGS when consumed, per
          BR-06) or a direct expense — Specifications §9, item 4. The P&amp;L shows the current
          assumption.
        </Alert>
        <Alert variant="info" title="Packaging within COGS">
          [NEEDS CLARIFICATION] Whether packaging is counted within COGS (used from inventory) —
          Specifications §9, item 5.
        </Alert>
      </div>
      <ProductionPanel />
    </div>
  );
}
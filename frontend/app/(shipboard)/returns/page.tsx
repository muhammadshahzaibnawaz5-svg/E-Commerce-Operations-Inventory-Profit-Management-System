import { PageHeader } from "@/components/ui/PageHeader";
import { ReturnsList } from "@/components/returns/ReturnsList";

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Returns & refunds"
        description="Returned and failed-delivery orders, the courier deduction, and restock decisions."
      />
      <ReturnsList />
    </div>
  );
}
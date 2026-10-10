import { PageHeader } from "@/components/ui/PageHeader";
import { ReturnDetail } from "@/components/returns/ReturnDetail";

export default async function ReturnDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Return detail" description="The courier deduction and the restock decision." />
      <ReturnDetail returnId={id} />
    </div>
  );
}
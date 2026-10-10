import { PageHeader } from "@/components/ui/PageHeader";
import { SupplierDetail } from "@/components/suppliers/SupplierDetail";

export default async function SupplierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Supplier detail" description="Contact details and purchase history." />
      <SupplierDetail supplierId={id} />
    </div>
  );
}
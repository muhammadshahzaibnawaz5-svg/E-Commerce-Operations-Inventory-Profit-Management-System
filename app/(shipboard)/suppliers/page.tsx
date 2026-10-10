import { PageHeader } from "@/components/ui/PageHeader";
import { SuppliersList } from "@/components/suppliers/SuppliersList";

export default function SuppliersPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Suppliers"
        description="Suppliers and their purchase history, feeding inventory and costs."
      />
      <SuppliersList />
    </div>
  );
}
import { PageHeader } from "@/components/ui/PageHeader";
import { CouriersList } from "@/components/couriers/CouriersList";

export default function CouriersPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Couriers"
        description="Delivery partners, their charges, and tracked shipments."
      />
      <CouriersList />
    </div>
  );
}
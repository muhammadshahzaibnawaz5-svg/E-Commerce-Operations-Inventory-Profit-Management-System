import { PageHeader } from "@/components/ui/PageHeader";
import { OrdersList } from "@/components/orders/OrdersList";

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Orders"
        description="Every order, its lifecycle status, and the courier handling delivery."
      />
      <OrdersList />
    </div>
  );
}
import { PageHeader } from "@/components/ui/PageHeader";
import { OrderDetail } from "@/components/orders/OrderDetail";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Order detail" description="Items, lifecycle, courier, costs and status history." />
      <OrderDetail orderId={id} />
    </div>
  );
}
import { PageHeader } from "@/components/ui/PageHeader";
import { CourierDetail } from "@/components/couriers/CourierDetail";

export default async function CourierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Courier detail" description="Shipments, charges and tracking events." />
      <CourierDetail courierId={id} />
    </div>
  );
}
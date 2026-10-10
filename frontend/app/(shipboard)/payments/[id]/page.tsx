import { PageHeader } from "@/components/ui/PageHeader";
import { PaymentDetail } from "@/components/payments/PaymentDetail";

export default async function PaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Payment detail" description="The 25% / 75% settlement for the order." />
      <PaymentDetail paymentId={id} />
    </div>
  );
}
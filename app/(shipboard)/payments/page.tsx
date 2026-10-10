import { PageHeader } from "@/components/ui/PageHeader";
import { PaymentsList } from "@/components/payments/PaymentsList";

export default function PaymentsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Payments & settlements"
        description="Prepaid and Cash on Delivery payments, split into the 25% / 75% settlement model."
      />
      <PaymentsList />
    </div>
  );
}
"use client";

import Link from "next/link";
import { getPaymentById, getTranches } from "@/lib/payments";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Alert } from "@/components/ui/Alert";
import { Money } from "@/components/ui/Table";
import { formatDate, formatMoney } from "@/lib/format";
import { IconChevronRight } from "@/components/ui/icons";

const STATUS_LABELS: Record<string, string> = {
  Pending: "Pending",
  PartiallyReceived: "Partially received",
  Received: "Received",
  Settled: "Settled",
};

const STATUS_VARIANT: Record<string, "neutral" | "warning" | "primary" | "success"> = {
  Pending: "neutral",
  PartiallyReceived: "warning",
  Received: "primary",
  Settled: "success",
};

export function PaymentDetail({ paymentId }: { paymentId: string }) {
  const payment = getPaymentById(paymentId);

  if (!payment) {
    return (
      <EmptyState
        title="Payment not found"
        description={`No payment matches ${paymentId}. Check the link and try again.`}
        action={
          <Link href="/payments" className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
            Back to payments
          </Link>
        }
      />
    );
  }

  const tranches = getTranches(payment);
  const delivered = payment.deliveredAt !== null;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-3">
                {payment.orderNumber}
                <Badge variant={payment.type === "COD" ? "warning" : "primary"}>{payment.type}</Badge>
              </CardTitle>
              <CardDescription>
                {payment.customer} ·{" "}
                <Badge variant={STATUS_VARIANT[payment.status]}>{STATUS_LABELS[payment.status]}</Badge>
              </CardDescription>
            </div>
            <Money value={payment.amount} className="text-2xl" />
          </div>
        </CardHeader>
      </Card>

      {delivered ? (
        <Card>
          <CardHeader>
            <CardTitle>The 25% / 75% split</CardTitle>
            <CardDescription>
              Business rule BR-03 — 25% received on delivery, the remaining 75% the next day.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">
              Delivered {formatDate(payment.deliveredAt ?? "")}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {tranches.map((t) => (
                <div
                  key={t.share}
                  className={`rounded-lg border p-4 ${
                    t.status === "Received" ? "border-success/30 bg-success/5" : "border-border bg-muted/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">{t.share}</span>
                    <Badge variant={t.status === "Received" ? "success" : "neutral"}>{t.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{t.label}</p>
                  <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-foreground">
                    {formatMoney(t.amount)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Due {formatDate(t.dueDate)}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Total of both tranches:{" "}
              <span className="font-mono font-semibold tabular-nums text-foreground">
                {formatMoney(payment.amount)}
              </span>
            </p>
          </CardContent>
        </Card>
      ) : (
        <Alert variant="info" title="Awaiting delivery">
          This order has not been delivered yet, so no settlement tranches apply.
        </Alert>
      )}

      <Alert variant="info" title="How returns affect the 25%">
        When an order is returned, the 25% advance is reduced by the courier return cost. See the{" "}
        <Link href="/returns" className="font-medium text-primary underline">
          Returns
        </Link>{" "}
        page.
      </Alert>

      <Alert variant="warning" title="[NEEDS CLARIFICATION]">
        Confirm whether settlement is clocked from delivery or from payment, and how weekends and
        holidays affect &ldquo;next day&rdquo; (Specifications §9, item 6).
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Related order</CardTitle>
        </CardHeader>
        <CardContent>
          <Link
            href={`/orders/${payment.orderId}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
          >
            View {payment.orderNumber} <IconChevronRight width={14} height={14} />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
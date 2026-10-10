"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getPayments, getPaymentsSummary } from "@/lib/payments";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Money } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/controls";
import { formatMoney } from "@/lib/format";
import { IconCheck, IconClock, IconWallet } from "@/components/ui/icons";
import type { Payment, SettlementStatus } from "@/lib/types";

const ALL = "all";
const SETTLEMENT_LABELS: Record<SettlementStatus, string> = {
  Pending: "Pending",
  PartiallyReceived: "Partially received",
  Received: "Received",
  Settled: "Settled",
};

const settlementVariant: Record<SettlementStatus, "neutral" | "warning" | "primary" | "success"> = {
  Pending: "neutral",
  PartiallyReceived: "warning",
  Received: "primary",
  Settled: "success",
};

export function PaymentsList() {
  const payments = getPayments();
  const summary = getPaymentsSummary();
  const [type, setType] = useState(ALL);
  const [status, setStatus] = useState(ALL);

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      if (type !== ALL && p.type !== type) return false;
      if (status !== ALL && p.status !== status) return false;
      return true;
    });
  }, [payments, type, status]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Received"
          value={formatMoney(summary.received)}
          icon={<IconCheck width={18} height={18} />}
          tone="positive"
          delta="25% advance + settled remainder"
        />
        <StatCard
          label="Pending"
          value={formatMoney(summary.pending)}
          icon={<IconClock width={18} height={18} />}
          tone="negative"
          delta="Awaiting settlement"
        />
        <StatCard
          label="Settled"
          value={formatMoney(summary.settled)}
          icon={<IconWallet width={18} height={18} />}
          delta="Fully received (COD)"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Summary totals are global across all payments and do not change with the filters below.
      </p>

      <div className="flex flex-wrap items-end gap-4">
        <div className="w-full max-w-52">
          <Field label="Payment type" htmlFor="payments-type">
            <Select id="payments-type" value={type} onChange={(e) => setType(e.target.value)}>
              <option value={ALL}>All types</option>
              <option value="Prepaid">Prepaid</option>
              <option value="COD">Cash on Delivery</option>
            </Select>
          </Field>
        </div>
        <div className="w-full max-w-60">
          <Field label="Settlement status" htmlFor="payments-status">
            <Select id="payments-status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value={ALL}>All statuses</option>
              {Object.entries(SETTLEMENT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </Field>
        </div>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "payment" : "payments"} match the filters
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="No payments match"
          description="Try a different payment type or settlement status."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Order</TableHeadCell>
                <TableHeadCell>Customer</TableHeadCell>
                <TableHeadCell>Type</TableHeadCell>
                <TableHeadCell>Settlement status</TableHeadCell>
                <TableHeadCell className="text-right">Amount</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((p) => (
                <PaymentRow key={p.id} payment={p} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function PaymentRow({ payment }: { payment: Payment }) {
  return (
    <TableRow>
      <TableCell>
        <Link href={`/payments/${payment.id}`} className="font-semibold text-primary hover:text-primary-hover">
          {payment.orderNumber}
        </Link>
      </TableCell>
      <TableCell className="text-foreground">{payment.customer}</TableCell>
      <TableCell>
        <Badge variant={payment.type === "COD" ? "warning" : "primary"}>{payment.type}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant={settlementVariant[payment.status]}>{SETTLEMENT_LABELS[payment.status]}</Badge>
      </TableCell>
      <TableCell className="text-right">
        <Money value={payment.amount} />
      </TableCell>
    </TableRow>
  );
}
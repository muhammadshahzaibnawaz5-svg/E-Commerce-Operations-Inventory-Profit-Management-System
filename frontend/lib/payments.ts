import { payments } from "@/lib/data/payments";
import type { Payment, PaymentSummary, SettlementTranche } from "@/lib/types";

export function getPayments(): Payment[] {
  return payments;
}

export function getPaymentById(id: string): Payment | undefined {
  return payments.find((p) => p.id === id);
}

export function computeSplit(amount: number): { advance: number; remainder: number } {
  return { advance: amount * 0.25, remainder: amount * 0.75 };
}

export function getTranches(payment: Payment): SettlementTranche[] {
  if (payment.deliveredAt === null) return [];
  const { advance, remainder } = computeSplit(payment.amount);
  const delivered = new Date(payment.deliveredAt);
  const deliveredDay = delivered.toISOString().slice(0, 10);
  const nextDay = new Date(delivered.getTime() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const advanceReceived = payment.status !== "Pending";
  const remainderReceived = payment.status === "Settled" || payment.status === "Received";

  return [
    { share: "25%", label: "On delivery", amount: advance, dueDate: deliveredDay, status: advanceReceived ? "Received" : "Pending" },
    { share: "75%", label: "Next day", amount: remainder, dueDate: nextDay, status: remainderReceived ? "Received" : "Pending" },
  ];
}

export function getPaymentsSummary(): PaymentSummary {
  const received = payments.reduce(
    (sum, p) => sum + (p.status === "Settled" || p.status === "Received" ? p.amount : p.status === "PartiallyReceived" ? p.amount * 0.25 : 0),
    0,
  );
  const pending = payments.reduce(
    (sum, p) => sum + (p.status === "Pending" ? p.amount : p.status === "PartiallyReceived" ? p.amount * 0.75 : 0),
    0,
  );
  const settled = payments
    .filter((p) => p.status === "Settled" || p.status === "Received")
    .reduce((sum, p) => sum + p.amount, 0);
  return { received, pending, settled };
}
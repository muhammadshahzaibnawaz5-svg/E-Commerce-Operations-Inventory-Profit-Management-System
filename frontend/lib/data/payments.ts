import type { Payment } from "@/lib/types";

export const payments: Payment[] = [
  { id: "pay_1001", orderId: "ord_1001", orderNumber: "ORD-1001", customer: "Maria Gomez", type: "COD", amount: 5000, status: "Settled", deliveredAt: "2026-10-09T10:15:00Z" },
  { id: "pay_1002", orderId: "ord_1002", orderNumber: "ORD-1002", customer: "John Carter", type: "Prepaid", amount: 10000, status: "PartiallyReceived", deliveredAt: "2026-10-09T12:40:00Z" },
  { id: "pay_1003", orderId: "ord_1004", orderNumber: "ORD-1004", customer: "Priya Sharma", type: "COD", amount: 3000, status: "Pending", deliveredAt: null },
];
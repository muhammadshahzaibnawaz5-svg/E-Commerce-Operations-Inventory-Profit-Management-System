import type { Order, OrderStatusHistory } from "@/lib/types";

export const orders: Order[] = [
  {
    id: "ord_1001",
    orderNumber: "ORD-1001",
    placedAt: "2026-10-08",
    customer: "Maria Gomez",
    status: "Delivered",
    courier: "Courier A",
    paymentType: "COD",
    total: 5000,
    items: [{ product: "Gift Box - Large", qty: 1, unitPrice: 5000 }],
    costs: { manufacturing: 2200, packaging: 100, courier: 300, advertising: 200 },
  },
  {
    id: "ord_1002",
    orderNumber: "ORD-1002",
    placedAt: "2026-10-08",
    customer: "John Carter",
    status: "Shipped",
    courier: "Courier B",
    paymentType: "Prepaid",
    total: 10000,
    items: [{ product: "Gift Box - Large", qty: 2, unitPrice: 5000 }],
    costs: { manufacturing: 4400, packaging: 200, courier: 300, advertising: 400 },
  },
  {
    id: "ord_1003",
    orderNumber: "ORD-1003",
    placedAt: "2026-10-07",
    customer: "Aisha Noor",
    status: "Returned",
    courier: "Courier C",
    paymentType: "COD",
    total: 2500,
    items: [{ product: "Gift Box - Small", qty: 1, unitPrice: 2500 }],
    costs: { manufacturing: 1100, packaging: 80, courier: 250, advertising: 150 },
  },
];

export const orderStatusHistory: OrderStatusHistory[] = [
  { orderId: "ord_1001", status: "New", changedAt: "2026-10-08T09:00:00Z", changedBy: "System" },
  { orderId: "ord_1001", status: "Confirmed", changedAt: "2026-10-08T09:20:00Z", changedBy: "Omar Farooq" },
  { orderId: "ord_1001", status: "Packed", changedAt: "2026-10-08T11:00:00Z", changedBy: "Omar Farooq" },
  { orderId: "ord_1001", status: "Shipped", changedAt: "2026-10-08T14:00:00Z", changedBy: "Courier A" },
  { orderId: "ord_1001", status: "Delivered", changedAt: "2026-10-09T10:15:00Z", changedBy: "Courier A" },
];
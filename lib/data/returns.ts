import type { ReturnRecord } from "@/lib/types";

export const returns: ReturnRecord[] = [
  {
    id: "ret_1001",
    orderId: "ord_1003",
    orderNumber: "ORD-1003",
    customer: "Aisha Noor",
    reason: "Customer Return",
    courier: "Courier C",
    advance: 625,
    courierCost: 250,
    amountReturned: 375,
    restockStatus: "Awaiting inspection",
    items: [{ product: "Gift Box - Small", sellable: null }],
  },
  {
    id: "ret_1002",
    orderId: "ord_1005",
    orderNumber: "ORD-1005",
    customer: "Dan Lee",
    reason: "Failed Delivery",
    courier: "Courier A",
    advance: 1250,
    courierCost: 1300,
    amountReturned: 0,
    restockStatus: "Written off",
    items: [{ product: "Gift Box - Large", sellable: false }],
  },
];
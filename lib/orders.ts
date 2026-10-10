import { couriers, shipments } from "@/lib/data/couriers";
import { orders, orderStatusHistory } from "@/lib/data/orders";
import type { Courier, Order, Shipment } from "@/lib/types";

export function getOrders(): Order[] {
  return orders;
}

export function getOrderById(id: string): Order | undefined {
  return orders.find((o) => o.id === id);
}

export function getHistoryForOrder(orderId: string) {
  return orderStatusHistory.filter((h) => h.orderId === orderId);
}

export function getCouriers(): Courier[] {
  return couriers;
}

export function getCourierById(id: string): Courier | undefined {
  return couriers.find((c) => c.id === id);
}

export function getShipmentsForCourier(courierId: string): Shipment[] {
  return shipments.filter((s) => s.courierId === courierId);
}

export function getShipmentForOrder(orderId: string): Shipment | undefined {
  return shipments.find((s) => s.orderId === orderId);
}

export const ORDER_STATUSES = ["New", "Confirmed", "Packed", "Shipped", "Delivered"];
export const ORDER_OUTCOMES = ["Cancelled", "Returned", "Failed Delivery", "Refunded"];
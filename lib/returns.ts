import { returns } from "@/lib/data/returns";
import { computeSplit } from "@/lib/payments";
import type { ReturnRecord, RestockStatus } from "@/lib/types";

export function getReturns(): ReturnRecord[] {
  return returns;
}

export function getReturnById(id: string): ReturnRecord | undefined {
  return returns.find((r) => r.id === id);
}

export function computeRefund(advance: number, courierCost: number | null): number {
  if (courierCost === null) return 0;
  return Math.max(advance - courierCost, 0);
}

export function deriveReturnedAmount(record: ReturnRecord): ReturnRecord {
  return { ...record, amountReturned: computeRefund(record.advance, record.courierCost) };
}

export function advanceFromOrderTotal(total: number): number {
  return computeSplit(total).advance;
}

export const RETURN_REASONS = ["Customer Return", "Failed Delivery", "Refused"] as const;
export const RESTOCK_STATUSES: RestockStatus[] = [
  "Awaiting inspection",
  "Restocked",
  "Written off",
];
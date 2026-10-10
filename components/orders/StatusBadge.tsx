import type { OrderStatus, OrderOutcome } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

type StatusValue = OrderStatus | OrderOutcome;

const badgeVariant: Record<StatusValue, "info" | "primary" | "accent" | "warning" | "success" | "destructive" | "neutral"> = {
  New: "info",
  Confirmed: "primary",
  Packed: "accent",
  Shipped: "warning",
  Delivered: "success",
  Cancelled: "destructive",
  Returned: "destructive",
  "Failed Delivery": "destructive",
  Refunded: "neutral",
};

const isOutcome: Record<StatusValue, boolean> = {
  New: false,
  Confirmed: false,
  Packed: false,
  Shipped: false,
  Delivered: false,
  Cancelled: true,
  Returned: true,
  "Failed Delivery": true,
  Refunded: true,
};

export function StatusBadge({ status }: { status: StatusValue }) {
  return (
    <Badge variant={badgeVariant[status]} title={isOutcome[status] ? "Outcome" : "Status"}>
      {status}
    </Badge>
  );
}
"use client";

import Link from "next/link";
import { getCourierById, getOrders, getShipmentsForCourier } from "@/lib/orders";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDateTime, formatMoney } from "@/lib/format";
import { IconChevronRight, IconTruck } from "@/components/ui/icons";

export function CourierDetail({ courierId }: { courierId: string }) {
  const courier = getCourierById(courierId);

  if (!courier) {
    return (
      <EmptyState
        title="Courier not found"
        description={`No courier matches ${courierId}. Check the link and try again.`}
        action={
          <Link href="/couriers" className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
            Back to couriers
          </Link>
        }
      />
    );
  }

  const shipments = getShipmentsForCourier(courierId);
  const orderNumber = (orderId: string) => getOrders().find((o) => o.id === orderId)?.orderNumber ?? orderId;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <IconTruck width={20} height={20} />
              </span>
              <div>
                <CardTitle>{courier.name}</CardTitle>
                <CardDescription>
                  {courier.isActive ? "Active" : "Inactive"} ·{" "}
                  {courier.apiAvailable ? "API available" : "No API yet (app/login pending)"}
                </CardDescription>
              </div>
            </div>
            <Badge variant={courier.apiAvailable ? "primary" : "warning"}>
              {courier.apiAvailable ? "API ready" : "App pending"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {shipments.length === 0 ? (
        <EmptyState
          icon={<IconTruck width={22} height={22} />}
          title="No shipments"
          description="This courier has no shipments in the current period."
        />
      ) : (
        shipments.map((shipment) => (
          <Card key={shipment.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    {orderNumber(shipment.orderId)}
                    <span className="text-sm font-normal text-muted-foreground">
                      Tracking {shipment.trackingNumber}
                    </span>
                  </CardTitle>
                  <CardDescription>Status: {shipment.status}</CardDescription>
                </div>
                <Badge variant="neutral">Shipment</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                <ChargeChip label="Shipping" value={shipment.charges.shipping} />
                <ChargeChip label="COD fee" value={shipment.charges.cod} />
                <ChargeChip label="Return" value={shipment.charges.return} />
              </div>

              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Tracking events
                </p>
                {shipment.events.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No tracking events yet</p>
                ) : (
                  <ol className="relative space-y-3 border-l border-border pl-4">
                    {shipment.events.map((e, i) => (
                      <li key={i} className="relative">
                        <span className="absolute -left-[19px] top-0.5 h-2 w-2 rounded-full border border-primary bg-card" />
                        <p className="text-sm font-medium text-foreground">{e.description}</p>
                        <p className="text-xs text-muted-foreground">{formatDateTime(e.at)}</p>
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              <Link
                href={`/orders/${shipment.orderId}`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
              >
                View order <IconChevronRight width={14} height={14} />
              </Link>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

function ChargeChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-foreground">{formatMoney(value)}</p>
    </div>
  );
}
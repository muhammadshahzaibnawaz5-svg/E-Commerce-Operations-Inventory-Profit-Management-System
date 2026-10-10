"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { getOrderById, getHistoryForOrder, getShipmentForOrder, ORDER_STATUSES, ORDER_OUTCOMES } from "@/lib/orders";
import { useSession } from "@/lib/session";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Money } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/controls";
import { formatDate, formatDateTime, formatMoney } from "@/lib/format";
import { IconHistory, IconTruck } from "@/components/ui/icons";
import type { OrderStatus, OrderOutcome } from "@/lib/types";

export function OrderDetail({ orderId }: { orderId: string }) {
  const { user } = useSession();
  const initial = getOrderById(orderId);
  const [order, setOrder] = useState(initial);
  const [statusOpen, setStatusOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState<string>(initial?.status ?? ORDER_STATUSES[0]);

  if (!order) {
    return (
      <EmptyState
        title="Order not found"
        description={`No order matches ${orderId}. Check the link and try again.`}
        action={
          <ButtonLinkToOrders />
        }
      />
    );
  }

  const history = getHistoryForOrder(order.id);
  const shipment = getShipmentForOrder(order.id);
  const lineTotal = (qty: number, unitPrice: number) => qty * unitPrice;
  const costLines: { label: string; value: number | null }[] = [
    { label: "Manufacturing", value: order.costs.manufacturing ?? null },
    { label: "Packaging", value: order.costs.packaging ?? null },
    { label: "Courier", value: order.costs.courier ?? null },
    { label: "Advertising", value: order.costs.advertising ?? null },
  ];

  function recordStatusChange(e: FormEvent) {
    e.preventDefault();
    if (!user || !order || nextStatus === order.status) {
      setStatusOpen(false);
      return;
    }
    setOrder({
      ...order,
      status: nextStatus as OrderStatus | OrderOutcome,
    });
    setStatusOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-3">
                {order.orderNumber}
                <StatusBadge status={order.status} />
              </CardTitle>
              <CardDescription>
                Placed {formatDate(order.placedAt)} · {order.customer}
              </CardDescription>
            </div>
            <Button onClick={() => setStatusOpen(true)}>Record status change</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Courier</p>
              <p className="mt-1 text-sm font-medium text-foreground">{order.courier ?? "Unassigned"}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payment</p>
              <span className="mt-1 inline-block"><Badge variant={order.paymentType === "COD" ? "warning" : "primary"}>{order.paymentType}</Badge></span>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total</p>
              <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-foreground">{formatMoney(order.total)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {shipment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconTruck width={18} height={18} className="text-primary" />
              Shipment
            </CardTitle>
            <CardDescription>
              Tracking {shipment.trackingNumber} · {shipment.status}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              <Charge label="Shipping" value={shipment.charges.shipping} />
              <Charge label="COD fee" value={shipment.charges.cod} />
              <Charge label="Return" value={shipment.charges.return} />
            </div>
            {shipment.events.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tracking events yet</p>
            ) : (
              <Timeline events={shipment.events} />
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Product</TableHeadCell>
                  <TableHeadCell className="text-right">Qty</TableHeadCell>
                  <TableHeadCell className="text-right">Unit price</TableHeadCell>
                  <TableHeadCell className="text-right">Line total</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-foreground">{item.product}</TableCell>
                    <TableCell className="text-right tabular-nums">{item.qty}</TableCell>
                    <TableCell className="text-right"><Money value={item.unitPrice} /></TableCell>
                    <TableCell className="text-right"><Money value={lineTotal(item.qty, item.unitPrice)} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Cost breakdown</CardTitle>
              <CardDescription>Missing components are shown as — (not zero).</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="divide-y divide-border">
                {costLines.map((line) => (
                  <div key={line.label} className="flex items-center justify-between py-2 text-sm">
                    <dt className="text-muted-foreground">{line.label}</dt>
                    <dd className="font-mono tabular-nums text-foreground">
                      {line.value === null ? "—" : formatMoney(line.value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconHistory width={18} height={18} className="text-primary" />
            Status history
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">No status changes recorded yet.</p>
          ) : (
            <Timeline
              events={history.map((h) => ({
                at: h.changedAt,
                description: `${h.status} — ${h.changedBy}`,
              }))}
            />
          )}
        </CardContent>
      </Card>

      <Modal
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        title={`Change status — ${order.orderNumber}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setStatusOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="status-form">
              Save change
            </Button>
          </>
        }
      >
        <form id="status-form" onSubmit={recordStatusChange} className="flex flex-col gap-4">
          <Field
            label="New status"
            htmlFor="next-status"
            hint="Outcomes stop the lifecycle. This change is in-memory for this review session."
          >
            <Select id="next-status" value={nextStatus} onChange={(e) => setNextStatus(e.target.value)}>
              <optgroup label="Lifecycle">
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </optgroup>
              <optgroup label="Outcomes">
                {ORDER_OUTCOMES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </optgroup>
            </Select>
          </Field>
        </form>
      </Modal>
    </div>
  );
}

function ButtonLinkToOrders() {
  return (
    <Link href="/orders" className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
      Back to orders
    </Link>
  );
}

function Charge({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-foreground">{formatMoney(value)}</p>
    </div>
  );
}

function Timeline({ events }: { events: { at: string; description: string }[] }) {
  return (
    <ol className="relative space-y-4 border-l border-border pl-4">
      {events.map((e, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-primary bg-card" />
          <p className="text-sm font-medium text-foreground">{e.description}</p>
          <p className="text-xs text-muted-foreground">{formatDateTime(e.at)}</p>
        </li>
      ))}
    </ol>
  );
}
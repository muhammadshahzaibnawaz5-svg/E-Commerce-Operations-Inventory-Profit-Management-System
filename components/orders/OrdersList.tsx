"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getOrders, ORDER_STATUSES, ORDER_OUTCOMES } from "@/lib/orders";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Money } from "@/components/ui/Table";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/controls";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
import { formatDate, formatMoney } from "@/lib/format";
import { IconCreditCard, IconShoppingCart, IconTruck, IconUndo2 } from "@/components/ui/icons";

const ALL = "all";

export function OrdersList() {
  const orders = getOrders();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(ALL);
  const [courierFilter, setCourierFilter] = useState(ALL);

  const courierNames = useMemo(
    () => Array.from(new Set(orders.map((o) => o.courier).filter((c): c is string => Boolean(c)))),
    [orders],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (status !== ALL && o.status !== status) return false;
      if (courierFilter !== ALL && o.courier !== courierFilter) return false;
      if (!q) return true;
      return (
        o.orderNumber.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q)
      );
    });
  }, [orders, search, status, courierFilter]);

  const totals = useMemo(() => {
    const delivered = orders.filter((o) => o.status === "Delivered").reduce((s, o) => s + o.total, 0);
    const active = orders.filter((o) => ORDER_STATUSES.includes(o.status as (typeof ORDER_STATUSES)[number]));

    return {
      count: orders.length,
      activeCount: active.length,
      deliveredValue: formatMoney(delivered),
      outcomes: orders.filter((o) => ORDER_OUTCOMES.includes(o.status as (typeof ORDER_OUTCOMES)[number])).length,
    };
  }, [orders]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total orders" value={String(totals.count)} icon={<IconShoppingCart width={18} height={18} />} delta="From Connected Store" />
        <StatCard label="Active lifecycle" value={String(totals.activeCount)} icon={<IconTruck width={18} height={18} />} delta="In the pipeline" />
        <StatCard label="Delivered value" value={totals.deliveredValue} icon={<IconCreditCard width={18} height={18} />} delta="After fulfilment" />
        <StatCard label="Outcome orders" value={String(totals.outcomes)} icon={<IconUndo2 width={18} height={18} />} delta="Cancelled / Returned / Failed / Refunded" />
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="w-full max-w-xs">
          <Field label="Search" htmlFor="orders-search">
            <Input
              id="orders-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Order number or customer"
            />
          </Field>
        </div>
        <div className="w-full max-w-56">
          <Field label="Status" htmlFor="orders-status">
            <Select id="orders-status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value={ALL}>All statuses</option>
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
        </div>
        <div className="w-full max-w-56">
          <Field label="Courier" htmlFor="orders-courier">
            <Select id="orders-courier" value={courierFilter} onChange={(e) => setCourierFilter(e.target.value)}>
              <option value={ALL}>All couriers</option>
              {courierNames.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </Field>
        </div>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "order" : "orders"} match{" "}
        {status !== ALL || courierFilter !== ALL || search ? "the filters" : "your store"}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="No orders match"
          description="Try clearing the search or selecting a different status or courier."
          action={
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatus(ALL);
                setCourierFilter(ALL);
              }}
              className="cursor-pointer text-sm font-medium text-primary hover:text-primary-hover"
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Order</TableHeadCell>
                <TableHeadCell>Date</TableHeadCell>
                <TableHeadCell>Customer</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Courier</TableHeadCell>
                <TableHeadCell>Payment</TableHeadCell>
                <TableHeadCell className="text-right">Total</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>
                    <Link
                      href={`/orders/${o.id}`}
                      className="font-semibold text-primary hover:text-primary-hover"
                    >
                      {o.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(o.placedAt)}</TableCell>
                  <TableCell className="text-foreground">{o.customer}</TableCell>
                  <TableCell><StatusBadge status={o.status} /></TableCell>
                  <TableCell>
                    {o.courier ? (
                      <Badge variant="neutral">{o.courier}</Badge>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={o.paymentType === "COD" ? "warning" : "primary"}>{o.paymentType}</Badge>
                  </TableCell>
                  <TableCell className="text-right"><Money value={o.total} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
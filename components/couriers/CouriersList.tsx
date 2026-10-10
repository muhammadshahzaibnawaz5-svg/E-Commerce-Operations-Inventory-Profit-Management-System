"use client";

import Link from "next/link";
import { getCouriers, getShipmentsForCourier } from "@/lib/orders";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Money } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { formatMoney } from "@/lib/format";
import { IconTruck } from "@/components/ui/icons";

export function CouriersList() {
  const couriers = getCouriers();

  const shipmentsAll = couriers.flatMap((c) => getShipmentsForCourier(c.id));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Couriers" value={String(couriers.length)} icon={<IconTruck width={18} height={18} />} delta="Participating carriers" />
        <StatCard
          label="Active shipments"
          value={String(shipmentsAll.length)}
          icon={<IconTruck width={18} height={18} />}
          delta="Across all couriers"
        />
        <StatCard
          label="Gross charges (period)"
          value={formatMoney(shipmentsAll.reduce((s, sh) => s + sh.charges.shipping + sh.charges.cod + sh.charges.return, 0))}
          icon={<IconTruck width={18} height={18} />}
          delta="Shipping + COD + return"
        />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">
          [NEEDS CLARIFICATION] Courier names and API availability are unconfirmed
          (Specifications §9, item 2). Couriers render generically so a new courier can be added
          without changing the layout.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Courier</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>API</TableHeadCell>
              <TableHeadCell className="text-right">Active shipments</TableHeadCell>
              <TableHeadCell className="text-right">Charges (period)</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {couriers.map((c) => {
              const shipments = getShipmentsForCourier(c.id);
              const charges = shipments.reduce(
                (s, sh) => s + sh.charges.shipping + sh.charges.cod + sh.charges.return,
                0,
              );
              return (
                <TableRow key={c.id}>
                  <TableCell>
                    <Link href={`/couriers/${c.id}`} className="font-semibold text-primary hover:text-primary-hover">
                      {c.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.isActive ? "success" : "neutral"}>
                      {c.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.apiAvailable ? "primary" : "warning"}>
                      {c.apiAvailable ? "API ready" : "App pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-foreground">{shipments.length}</TableCell>
                  <TableCell className="text-right"><Money value={charges} /></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
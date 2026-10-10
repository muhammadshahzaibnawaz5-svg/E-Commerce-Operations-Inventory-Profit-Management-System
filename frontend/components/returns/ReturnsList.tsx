"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getReturns, RETURN_REASONS, RESTOCK_STATUSES } from "@/lib/returns";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Money } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/controls";
import { formatMoney } from "@/lib/format";
import { IconPackage, IconUndo2, IconWallet, IconX } from "@/components/ui/icons";
import type { RestockStatus } from "@/lib/types";

const ALL = "all";

const restockVariant: Record<RestockStatus, "neutral" | "success" | "destructive"> = {
  "Awaiting inspection": "neutral",
  Restocked: "success",
  "Written off": "destructive",
};

export function ReturnsList() {
  const returns = getReturns();
  const [reason, setReason] = useState(ALL);
  const [restock, setRestock] = useState(ALL);

  const filtered = useMemo(() => {
    return returns.filter((r) => {
      if (reason !== ALL && r.reason !== reason) return false;
      if (restock !== ALL && r.restockStatus !== restock) return false;
      return true;
    });
  }, [returns, reason, restock]);

  const totalReturned = returns.reduce((s, r) => s + r.amountReturned, 0);
  const totalAdvance = returns.reduce((s, r) => s + r.advance, 0);
  const awaiting = returns.filter((r) => r.restockStatus === "Awaiting inspection").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Returned orders" value={String(returns.length)} icon={<IconUndo2 width={18} height={18} />} delta="Returned + failed delivery" />
        <StatCard label="25% advances collected" value={formatMoney(totalAdvance)} icon={<IconWallet width={18} height={18} />} delta="To be reduced for returns" />
        <StatCard label="Amount returned to customers" value={formatMoney(totalReturned)} icon={<IconX width={18} height={18} />} tone="negative" delta="Advance − courier cost" />
        <StatCard label="Awaiting inspection" value={String(awaiting)} icon={<IconPackage width={18} height={18} />} delta="Restock decision pending" />
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="w-full max-w-60">
          <Field label="Reason" htmlFor="returns-reason">
            <Select id="returns-reason" value={reason} onChange={(e) => setReason(e.target.value)}>
              <option value={ALL}>All reasons</option>
              {RETURN_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="w-full max-w-60">
          <Field label="Restock status" htmlFor="returns-restock">
            <Select id="returns-restock" value={restock} onChange={(e) => setRestock(e.target.value)}>
              <option value={ALL}>All statuses</option>
              {RESTOCK_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </Field>
        </div>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "return" : "returns"} match the filters
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="No returns match"
          description="Try a different reason or restock status."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Order</TableHeadCell>
                <TableHeadCell>Customer</TableHeadCell>
                <TableHeadCell>Reason</TableHeadCell>
                <TableHeadCell>Courier</TableHeadCell>
                <TableHeadCell>Restock status</TableHeadCell>
                <TableHeadCell className="text-right">Amount returned</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <Link href={`/returns/${r.id}`} className="font-semibold text-primary hover:text-primary-hover">
                      {r.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell className="text-foreground">{r.customer}</TableCell>
                  <TableCell className="text-muted-foreground">{r.reason}</TableCell>
                  <TableCell><Badge variant="neutral">{r.courier}</Badge></TableCell>
                  <TableCell><Badge variant={restockVariant[r.restockStatus]}>{r.restockStatus}</Badge></TableCell>
                  <TableCell className="text-right"><Money value={r.amountReturned} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
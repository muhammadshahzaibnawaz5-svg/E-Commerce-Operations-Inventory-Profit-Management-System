"use client";

import { useState } from "react";
import Link from "next/link";
import { getReturnById, computeRefund } from "@/lib/returns";
import { getPayments } from "@/lib/payments";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/format";
import { IconChevronRight } from "@/components/ui/icons";
import type { ReturnRecord, RestockStatus } from "@/lib/types";

const restockVariant: Record<RestockStatus, "neutral" | "success" | "destructive"> = {
  "Awaiting inspection": "neutral",
  Restocked: "success",
  "Written off": "destructive",
};

export function ReturnDetail({ returnId }: { returnId: string }) {
  const initial = getReturnById(returnId);
  const [record, setRecord] = useState<ReturnRecord | undefined>(initial);

  if (!record) {
    return (
      <EmptyState
        title="Return not found"
        description={`No return matches ${returnId}. Check the link and try again.`}
        action={
          <Link href="/returns" className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
            Back to returns
          </Link>
        }
      />
    );
  }

  const payment = getPayments().find((p) => p.orderId === record.orderId);
  const net = computeRefund(record.advance, record.courierCost);
  const overShort = record.courierCost !== null && record.courierCost > record.advance;
  const unknownCost = record.courierCost === null;

  function reviewItem(index: number, sellable: boolean) {
    setRecord((prev) => {
      if (!prev) return prev;
      const items = prev.items.map((it, i) => (i === index ? { ...it, sellable } : it));
      const decided = items.filter((it) => it.sellable !== null);
      const restockStatus: RestockStatus =
        decided.length === items.length
          ? items.some((it) => it.sellable === true)
            ? "Restocked"
            : "Written off"
          : "Awaiting inspection";
      return { ...prev, items, restockStatus };
    });
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-3">
                {record.orderNumber}
                <Badge variant="neutral">{record.reason}</Badge>
              </CardTitle>
              <CardDescription>
                {record.customer} · {record.courier}
              </CardDescription>
            </div>
            <Badge variant={restockVariant[record.restockStatus]}>{record.restockStatus}</Badge>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>The 25% advance − courier cost = amount returned</CardTitle>
          <CardDescription>
            Business rule BR-04 — the courier cost is deducted from the 25% advance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-border rounded-lg border border-border">
            <MoneyLine label="25% advance collected" value={record.advance} />
            <MoneyLine
              label="Courier cost deducted"
              value={record.courierCost ?? null}
              negative
            />
            <div className="flex items-center justify-between bg-muted/40 px-4 py-3 text-sm">
              <dt className="font-semibold text-foreground">Amount returned to customer</dt>
              <dd className="font-mono text-base font-semibold tabular-nums text-foreground">
                {unknownCost ? "—" : formatMoney(net)}
              </dd>
            </div>
          </dl>

          {unknownCost && (
            <Alert variant="warning" title="Courier cost required">
              The final refund figure is blocked until the courier records the return cost.
            </Alert>
          )}

          {overShort && (
            <Alert variant="warning" title="Cost exceeds the advance">
              The courier cost ({formatMoney(record.courierCost!)}) is greater than the 25% advance
              ({formatMoney(record.advance)}), so nothing is returned to the customer.
            </Alert>
          )}

          {payment && (
            <p className="mt-4 text-sm">
              <Link href={`/payments/${payment.id}`} className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary-hover">
                View the linked payment ({payment.orderNumber}) <IconChevronRight width={14} height={14} />
              </Link>
            </p>
          )}

          <Link
            href={`/orders/${record.orderId}`}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover"
          >
            View the original order <IconChevronRight width={14} height={14} />
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Restock decision</CardTitle>
          <CardDescription>
            Business rule BR-05 — items return to stock only when inspected and sellable.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {record.items.map((item, i) => (
            <div key={i} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4">
              <p className="text-sm font-medium text-foreground">{item.product}</p>
              <div className="flex items-center gap-2">
                <Button
                  variant={item.sellable === true ? "primary" : "outline"}
                  size="sm"
                  onClick={() => reviewItem(i, true)}
                >
                  Inspected &amp; sellable
                </Button>
                <Button
                  variant={item.sellable === false ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => reviewItem(i, false)}
                >
                  Not sellable
                </Button>
              </div>
            </div>
          ))}

          {record.restockStatus === "Restocked" && (
            <Alert variant="success" title="Restocked">
              Stock will increase once the inspection is finalised.
            </Alert>
          )}
          {record.restockStatus === "Written off" && (
            <Alert variant="info" title="Written off">
              No restock occurs for written-off items.
            </Alert>
          )}
        </CardContent>
      </Card>

      <Alert variant="info" title="Refunds reduce net revenue">
        Refunded amounts are represented as reducing net revenue on the Profit &amp; Loss (feature 008).
      </Alert>

      <Alert variant="warning" title="[NEEDS CLARIFICATION]">
        Confirm refund treatment for a returned order that was never paid (e.g. failed prepaid) —
        Specifications §9, item 6.
      </Alert>
    </div>
  );
}

function MoneyLine({ label, value, negative }: { label: string; value: number | null; negative?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={`font-mono tabular-nums ${
          value === null ? "text-muted-foreground" : negative ? "text-destructive" : "text-foreground"
        }`}
      >
        {value === null ? "—" : value === 0 ? "Rs. 0" : formatMoney(value)}
      </dd>
    </div>
  );
}
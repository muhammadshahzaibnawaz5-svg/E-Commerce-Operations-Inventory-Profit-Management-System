"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { buildProfitLossForRange, buildReportRows } from "@/lib/profit";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/controls";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Money } from "@/components/ui/Table";
import { formatDate, formatMoney } from "@/lib/format";
import { IconFileText, IconTrendingUp } from "@/components/ui/icons";

export function ReportsView() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [exported, setExported] = useState<string | null>(null);

  const rows = useMemo(() => buildReportRows(from, to), [from, to]);
  const statement = useMemo(() => buildProfitLossForRange(from, to), [from, to]);
  const profitable = statement.netProfit >= 0;
  const total = rows.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-40">
          <Field label="From" htmlFor="report-from">
            <Input id="report-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </Field>
        </div>
        <div className="w-40">
          <Field label="To" htmlFor="report-to">
            <Input id="report-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </Field>
        </div>
        <Button variant="outline" onClick={() => { setFrom(""); setTo(""); }} disabled={!from && !to}>
          Clear range
        </Button>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setExported("Profit & loss (PDF)")}>
            Export P&amp;L
          </Button>
          <Button variant="outline" size="sm" onClick={() => setExported("Orders (CSV)")}>
            Export orders
          </Button>
        </div>
      </div>

      {exported && (
        <Alert variant="success" title={`${exported} — export simulated`}>
          Demo only — no file was generated in the markup prototype.
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconTrendingUp width={18} height={18} className="text-primary" />
              Profit &amp; loss summary
            </CardTitle>
            <CardDescription>Period {statement.period}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <dl className="divide-y divide-border text-sm">
              <Line label="Net revenue" value={formatMoney(statement.netRevenue)} />
              <Line label="Gross profit" value={formatMoney(statement.grossProfit)} />
              <Line label="Selling costs" value={formatMoney(statement.sellingCosts.total)} />
              <Line label="Operating expenses" value={formatMoney(statement.operatingExpenses)} />
              <Line
                label={profitable ? "Net profit" : "Net loss"}
                value={formatMoney(Math.abs(statement.netProfit))}
                emphasis
              />
            </dl>
            <Link href="/profit-loss">
              <Button variant="outline" size="sm">Open full statement</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconFileText width={18} height={18} className="text-primary" />
              Exports
            </CardTitle>
            <CardDescription>Represented as UI controls only.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              {rows.length} {rows.length === 1 ? "order" : "orders"} in range · total{" "}
              <span className="font-mono tabular-nums text-foreground">{formatMoney(total)}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Export generation is not implemented in the markup prototype; formats are pending
              confirmation.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders in range</CardTitle>
          <CardDescription>
            Rows and totals update as the date range changes. Only part of the period may have data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <EmptyState
              title="No data in this range"
              description="Adjust or clear the date range to see report rows and totals."
              action={
                <Button variant="outline" onClick={() => { setFrom(""); setTo(""); }}>
                  Clear range
                </Button>
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
                    <TableHeadCell>Channel</TableHeadCell>
                    <TableHeadCell className="text-right">Total</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium text-foreground">
                        <Link href={`/orders/${order.id}`} className="hover:underline">
                          {order.orderNumber}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(order.placedAt)}</TableCell>
                      <TableCell className="text-foreground">{order.customer}</TableCell>
                      <TableCell><Badge variant="neutral">{order.status}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{order.paymentType}</TableCell>
                      <TableCell className="text-right"><Money value={order.total} /></TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-semibold hover:bg-transparent">
                    <TableCell colSpan={5} className="text-right text-foreground">Range total</TableCell>
                    <TableCell className="text-right"><Money value={total} /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Alert variant="warning" title="[NEEDS CLARIFICATION]">
        The worked-example manufacturing figure (§4.4 / §9 item 10), revenue recognition timing
        (§9 item 6), and the final report/export formats (§9 item 7) are pending client confirmation.
      </Alert>
    </div>
  );
}

function Line({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <dt className={emphasis ? "font-semibold text-foreground" : "text-muted-foreground"}>{label}</dt>
      <dd className={`font-mono tabular-nums ${emphasis ? "font-semibold text-foreground" : "text-foreground"}`}>
        {value}
      </dd>
    </div>
  );
}

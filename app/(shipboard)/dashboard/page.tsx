import Link from "next/link";
import type { ReactNode } from "react";
import { buildDashboardData } from "@/lib/profit";
import { getOrders } from "@/lib/orders";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Money } from "@/components/ui/Table";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";
import { formatDate, formatMoney, formatNumber } from "@/lib/format";
import { IconCheck, IconCreditCard, IconShoppingCart, IconTrendingUp, IconUndo2, IconWallet } from "@/components/ui/icons";

const metricMeta: Record<string, { label: string; icon: ReactNode; tone?: "default" | "positive" | "negative" }> = {
  orders: { label: "Orders", icon: <IconShoppingCart width={18} height={18} /> },
  deliveries: { label: "Deliveries", icon: <IconCheck width={18} height={18} />, tone: "positive" },
  returns: { label: "Returns", icon: <IconUndo2 width={18} height={18} />, tone: "negative" },
  payments: { label: "Payments", icon: <IconCreditCard width={18} height={18} /> },
  expenses: { label: "Total expenses", icon: <IconWallet width={18} height={18} />, tone: "negative" },
  netProfit: { label: "Net profit", icon: <IconTrendingUp width={18} height={18} />, tone: "positive" },
};

export default async function DashboardPage() {
  const { metrics, productSeries, trendSeries } = buildDashboardData();
  const recent = getOrders().slice(0, 5);

  const values = Object.fromEntries(
    metrics.map((m) => [m.key, m.key === "netProfit" ? formatMoney(m.value) : String(formatNumber(m.value))]),
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Start here for a snapshot of operations, cash flow and profit."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {metrics.map((m) => (
          <StatCard
            key={m.key}
            label={metricMeta[m.key]?.label ?? m.label}
            value={values[m.key]}
            icon={metricMeta[m.key]?.icon}
            tone={metricMeta[m.key]?.tone ?? (m.value < 0 ? "negative" : "default")}
            delta={formatDelta(m)}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by product</CardTitle>
            <CardDescription>Fulfilled orders, attributed per product.</CardDescription>
          </CardHeader>
          <CardContent>
            {productSeries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No fulfilled revenue yet.</p>
            ) : (
              <BarChart data={productSeries} format={formatMoney} ariaLabel="Revenue by product" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Daily order value</CardTitle>
            <CardDescription>Order totals per day from the mock store.</CardDescription>
          </CardHeader>
          <CardContent>
            {trendSeries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              <LineChart data={trendSeries} format={formatMoney} ariaLabel="Daily order value" />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent orders</CardTitle>
          <CardDescription>The five most recent orders across your store.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Order</TableHeadCell>
                <TableHeadCell>Date</TableHeadCell>
                <TableHeadCell>Customer</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell className="text-right">Total</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recent.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>
                    <Link href={`/orders/${o.id}`} className="font-semibold text-primary hover:text-primary-hover">
                      {o.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(o.placedAt)}</TableCell>
                  <TableCell className="text-foreground">{o.customer}</TableCell>
                  <TableCell><StatusBadge status={o.status} /></TableCell>
                  <TableCell className="text-right"><Money value={o.total} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function formatDelta(m: { key: string; delta: string }) {
  if (m.key === "orders") return "Overall store volume";
  if (m.key === "netProfit") return m.delta ? "Loss this period" : "Positive this period";
  return m.delta;
}
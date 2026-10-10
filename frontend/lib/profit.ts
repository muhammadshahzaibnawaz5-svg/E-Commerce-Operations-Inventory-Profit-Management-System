import type {
  DashboardMetric,
  ProductProfit,
  ProfitLossStatement,
} from "@/lib/types";
import { getOrders } from "@/lib/orders";
import { getReturns } from "@/lib/returns";
import { getPayments } from "@/lib/payments";
import { getAdSpend, getExpenses, sumAdSpend, sumExpenses } from "@/lib/expenses";

export function computeProfitLoss(input: {
  netRevenue: number;
  manufacturing: number;
  packaging: number;
  courier: number;
  advertising: number;
  operatingExpenses: number;
}): Omit<ProfitLossStatement, "period"> {
  const cogs = {
    manufacturing: input.manufacturing,
    packaging: input.packaging,
    total: input.manufacturing + input.packaging,
  };
  const grossProfit = input.netRevenue - cogs.total;
  const sellingCosts = {
    courier: input.courier,
    advertising: input.advertising,
    total: input.courier + input.advertising,
  };
  const operatingProfit = grossProfit - sellingCosts.total - input.operatingExpenses;
  return {
    netRevenue: input.netRevenue,
    cogs,
    grossProfit,
    sellingCosts,
    operatingExpenses: input.operatingExpenses,
    operatingProfit,
    netProfit: operatingProfit,
  };
}

export function computeProductProfit(rows: ProductProfit[]): ProductProfit[] {
  return rows.map((row) => ({
    ...row,
    profit:
      row.revenue - row.manufacturing - row.packaging - row.courier - row.advertising,
  }));
}

export function computeDashboardMetrics(input: {
  orders: number;
  deliveries: number;
  returns: number;
  payments: number;
  expenses: number;
  netProfit: number;
}): DashboardMetric[] {
  return [
    { key: "orders", label: "Orders", value: input.orders, delta: "+1 today" },
    { key: "deliveries", label: "Deliveries", value: input.deliveries, delta: "" },
    { key: "returns", label: "Returns", value: input.returns, delta: "" },
    { key: "payments", label: "Payments", value: input.payments, delta: "" },
    { key: "expenses", label: "Expenses", value: input.expenses, delta: "" },
    { key: "netProfit", label: "Net Profit", value: input.netProfit, delta: input.netProfit < 0 ? "loss" : "" },
  ];
}

export const sampleProductProfitRows: ProductProfit[] = [
  { product: "Gift Box - Large", units: 3, revenue: 15000, manufacturing: 6600, packaging: 300, courier: 600, advertising: 700, profit: 6800 },
  { product: "Gift Box - Small", units: 1, revenue: 2500, manufacturing: 1100, packaging: 80, courier: 250, advertising: 150, profit: 920 },
];

const FULFILLED_STATUSES = ["Delivered", "Shipped"];

export function buildProfitLossStatement(): ProfitLossStatement {
  const accounts = getOrders();
  const fulfilled = accounts.filter((o) => FULFILLED_STATUSES.includes(o.status));
  const refunds = getReturns().reduce((s, r) => s + r.amountReturned, 0);
  const netRevenue = fulfilled.reduce((s, o) => s + o.total, 0) - refunds;
  const manufacturing = accounts.reduce((s, o) => s + (o.costs.manufacturing ?? 0), 0);
  const packaging = accounts.reduce((s, o) => s + (o.costs.packaging ?? 0), 0);
  const courier = accounts.reduce((s, o) => s + (o.costs.courier ?? 0), 0);
  const advertising = sumAdSpend(getAdSpend());
  const operatingExpenses = sumExpenses(getExpenses().filter((e) => e.type === "operating"));

  return {
    period: "2026-10",
    ...computeProfitLoss({
      netRevenue,
      manufacturing,
      packaging,
      courier,
      advertising,
      operatingExpenses,
    }),
  };
}

export function buildReportRows(from: string, to: string) {
  return getOrders()
    .filter((o) => (!from || o.placedAt >= from) && (!to || o.placedAt <= to))
    .sort((a, b) => b.placedAt.localeCompare(a.placedAt));
}

export function buildProfitLossForRange(from: string, to: string): ProfitLossStatement {
  const accounts = getOrders();
  const inRange = accounts.filter(
    (o) => (!from || o.placedAt >= from) && (!to || o.placedAt <= to),
  );
  const fulfilled = inRange.filter((o) => FULFILLED_STATUSES.includes(o.status));
  const inRangeIds = new Set(inRange.map((o) => o.id));
  const refunds = getReturns()
    .filter((r) => inRangeIds.has(r.orderId))
    .reduce((s, r) => s + r.amountReturned, 0);
  const netRevenue = fulfilled.reduce((s, o) => s + o.total, 0) - refunds;
  const manufacturing = inRange.reduce((s, o) => s + (o.costs.manufacturing ?? 0), 0);
  const packaging = inRange.reduce((s, o) => s + (o.costs.packaging ?? 0), 0);
  const courier = inRange.reduce((s, o) => s + (o.costs.courier ?? 0), 0);
  const advertising = sumAdSpend(
    getAdSpend().filter((r) => (!from || r.date >= from) && (!to || r.date <= to)),
  );
  const operatingExpenses = sumExpenses(
    getExpenses().filter(
      (e) => e.type === "operating" && (!from || e.date >= from) && (!to || e.date <= to),
    ),
  );

  return {
    period: from || to ? `${from || "start"} → ${to || "today"}` : "All time",
    ...computeProfitLoss({
      netRevenue,
      manufacturing,
      packaging,
      courier,
      advertising,
      operatingExpenses,
    }),
  };
}

export function buildProductProfitRows(): ProductProfit[] {
  const accounts = getOrders().filter((o) => FULFILLED_STATUSES.includes(o.status));
  const map = new Map<string, ProductProfit>();

  for (const order of accounts) {
    for (const item of order.items) {
      const lineTotal = item.qty * item.unitPrice;
      const share = order.total > 0 ? lineTotal / order.total : 0;
      const row =
        map.get(item.product) ??
        ({
          product: item.product,
          units: 0,
          revenue: 0,
          manufacturing: 0,
          packaging: 0,
          courier: 0,
          advertising: 0,
          profit: 0,
        } as ProductProfit);
      row.units += item.qty;
      row.revenue += lineTotal;
      row.manufacturing += (order.costs.manufacturing ?? 0) * share;
      row.packaging += (order.costs.packaging ?? 0) * share;
      row.courier += (order.costs.courier ?? 0) * share;
      row.advertising += (order.costs.advertising ?? 0) * share;
      map.set(item.product, row);
    }
  }

  return computeProductProfit([...map.values()]);
}

export function buildDashboardData() {
  const orders = getOrders();
  const statement = buildProfitLossStatement();
  const products = buildProductProfitRows();

  const trend = new Map<string, number>();
  for (const o of orders) {
    trend.set(o.placedAt, (trend.get(o.placedAt) ?? 0) + o.total);
  }

  return {
    metrics: computeDashboardMetrics({
      orders: orders.length,
      deliveries: orders.filter((o) => o.status === "Delivered").length,
      returns: getReturns().length,
      payments: getPayments().length,
      expenses: getExpenses().length,
      netProfit: statement.netProfit,
    }),
    statement,
    productSeries: products.map((p) => ({ label: p.product, value: p.revenue })),
    trendSeries: [...trend.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([label, value]) => ({ label: label.slice(5), value })),
  };
}
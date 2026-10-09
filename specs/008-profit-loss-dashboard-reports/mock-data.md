# Mock Data & Screen Inventory: Profit & Loss, Dashboard & Reports

**Feature**: `008-profit-loss-dashboard-reports`

## Routes & Components

| Route | Page file | Purpose | Key states |
|---|---|---|---|
| `/dashboard` | `app/dashboard/page.tsx` | Snapshot cards + charts | populated, empty-metric |
| `/profit-loss` | `app/profit-loss/page.tsx` | Statement + per-product | profit, loss, empty |
| `/reports` | `app/reports/page.tsx` | Filtered reports + export | populated, filtered, empty, export-demo |

Shared: `components/finance/MetricCard.tsx`, `PLStatement.tsx`, `ReportFilters.tsx`; `components/charts/BarChart.tsx`, `LineChart.tsx`.

## UI States

- **profit / loss** — result sign drives the label ("Net Profit" vs "Net Loss").
- **filtered** — date range applied; totals recomputed.
- **empty-metric / empty** — 0 values or "No data for this period".
- **export-demo** — "Demo only — no file generated".

## Derived P&L Shapes (`frontend/lib/types.ts` + `frontend/lib/profit.ts`)

### ProfitLossStatement (derived)
```ts
export interface ProfitLossStatement {
  period: string;
  netRevenue: number;
  cogs: { manufacturing: number; packaging: number; total: number };
  grossProfit: number;
  sellingCosts: { courier: number; advertising: number; total: number };
  operatingExpenses: number;
  operatingProfit: number;
  netProfit: number;
}
```
```ts
export const sampleStatement: ProfitLossStatement = {
  period: "2026-10-01..2026-10-09",
  netRevenue: 17500,
  cogs: { manufacturing: 7700, packaging: 380, total: 8080 },
  grossProfit: 9420,
  sellingCosts: { courier: 850, advertising: 850, total: 1700 },
  operatingExpenses: 28200,
  operatingProfit: -20480,
  netProfit: -20480,
};
```

### ProductProfit (derived)
```ts
export interface ProductProfit {
  product: string; units: number; revenue: number;
  manufacturing: number; packaging: number; courier: number; advertising: number; profit: number;
}
```
```ts
export const sampleProductProfit: ProductProfit[] = [
  { product: "Gift Box - Large", units: 3, revenue: 15000, manufacturing: 6600, packaging: 300, courier: 600, advertising: 700, profit: 6800 },
  { product: "Gift Box - Small", units: 1, revenue: 2500,  manufacturing: 1100, packaging: 80,  courier: 250, advertising: 150, profit: 920 },
];
```

### DashboardMetric (derived)
```ts
export interface DashboardMetric { key: string; label: string; value: number; delta: string; }
```
```ts
export const sampleMetrics: DashboardMetric[] = [
  { key: "orders",     label: "Orders",     value: 4,      delta: "+1 today" },
  { key: "deliveries", label: "Deliveries", value: 3,      delta: "" },
  { key: "returns",    label: "Returns",    value: 1,      delta: "" },
  { key: "payments",   label: "Payments",   value: 15000,  delta: "" },
  { key: "expenses",   label: "Expenses",   value: 28200,  delta: "" },
  { key: "netProfit",  label: "Net Profit", value: -20480, delta: "loss" },
];
```

## Formula Reference (from Specifications §4.3)

```
Gross Profit     = Net Revenue − COGS
Operating Profit = Gross Profit − Selling Costs − Operating Expenses
Order Profit     = Revenue − Manufacturing − Packaging − Courier − Advertising
Net Profit       = Order Profit − Other Expenses
```

## Notes

- The per-product figures reuse the worked example; note the §4.4 discrepancy (manufacturing 4,400 → order profit 4,700 vs the handwritten 4,000 → 5,100).
- The `operatingExpenses` mock value (salaries etc.) intentionally exceeds gross profit to demonstrate a **loss** state.
- Charts are inline SVG components in `components/charts/`; no charting library.

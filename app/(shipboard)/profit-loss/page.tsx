import { buildProfitLossStatement, buildProductProfitRows } from "@/lib/profit";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { formatMoney, formatNumber } from "@/lib/format";

export default function ProfitLossPage() {
  const s = buildProfitLossStatement();
  const products = buildProductProfitRows();

  const rows: { label: string; value: number; emphasis?: boolean; negative?: boolean }[] = [
    { label: "Net revenue", value: s.netRevenue, emphasis: true },
    { label: "Cost of goods sold (manufacturing)", value: -s.cogs.manufacturing },
    { label: "Cost of goods sold (packaging)", value: -s.cogs.packaging },
    { label: "Gross profit", value: s.grossProfit, emphasis: true },
    { label: "Selling cost — courier", value: -s.sellingCosts.courier },
    { label: "Selling cost — advertising", value: -s.sellingCosts.advertising },
    { label: "Operating expenses", value: -s.operatingExpenses },
    { label: "Net profit", value: s.netProfit, emphasis: true },
  ];

  const profitable = s.netProfit >= 0;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Profit & loss"
        description={`Derived statement for the period ${s.period}. All figures are computed from mock data.`}
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Badge variant={profitable ? "success" : "destructive"}>
          {profitable ? "Profit" : "Loss"} this period
        </Badge>
        <span className="text-sm text-muted-foreground">
          Net {profitable ? "profit" : "loss"}:{" "}
          <span className={`font-mono font-semibold tabular-nums ${profitable ? "text-success" : "text-destructive"}`}>
            {formatMoney(Math.abs(s.netProfit))}
          </span>
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statement</CardTitle>
          <CardDescription>Revenue, COGS, selling costs and operating expenses.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-border rounded-lg border border-border">
            {rows.map((row) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-4 py-3 text-sm ${
                  row.emphasis ? "bg-muted/40" : ""
                }`}
              >
                <dt className={row.emphasis ? "font-semibold text-foreground" : "text-muted-foreground"}>
                  {row.label}
                </dt>
                <dd
                  className={`font-mono tabular-nums ${
                    row.emphasis
                      ? row.value < 0
                        ? "font-semibold text-destructive"
                        : "font-semibold text-foreground"
                      : row.value < 0
                        ? "text-destructive"
                        : "text-foreground"
                  }`}
                >
                  {formatMoney(row.value)}
                </dd>
              </div>
            ))}
          </dl>

          <Alert variant="info" title="How this is calculated">
            Net revenue is fulfilled order totals minus refunds. Advertising uses recorded ad spend.
            Manufacturing and packaging come from consumed materials (BR-06). Packaging is treated as
            COGS pending confirmation (Specifications §9, item 5).
          </Alert>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Profit by product</CardTitle>
          <CardDescription>Revenue and costs attributed per product for the period.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Product</TableHeadCell>
                <TableHeadCell className="text-right">Units</TableHeadCell>
                <TableHeadCell className="text-right">Revenue</TableHeadCell>
                <TableHeadCell className="text-right">Manufacturing</TableHeadCell>
                <TableHeadCell className="text-right">Packaging</TableHeadCell>
                <TableHeadCell className="text-right">Courier</TableHeadCell>
                <TableHeadCell className="text-right">Advertising</TableHeadCell>
                <TableHeadCell className="text-right">Profit</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No fulfilled products yet.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p) => (
                  <TableRow key={p.product}>
                    <TableCell className="font-medium text-foreground">{p.product}</TableCell>
                    <TableCell className="text-right tabular-nums text-foreground">{formatNumber(p.units)}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums text-foreground">{formatMoney(p.revenue)}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums text-muted-foreground">{formatMoney(p.manufacturing)}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums text-muted-foreground">{formatMoney(p.packaging)}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums text-muted-foreground">{formatMoney(p.courier)}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums text-muted-foreground">{formatMoney(p.advertising)}</TableCell>
                    <TableCell className={`text-right font-mono font-semibold tabular-nums ${p.profit < 0 ? "text-destructive" : "text-success"}`}>
                      {formatMoney(p.profit)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
import { isFinishedGoodLow } from "@/lib/inventory";
import type { FinishedGood } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/format";

export function FinishedGoodsTable({ goods }: { goods: FinishedGood[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Product</TableHeadCell>
              <TableHeadCell>Unit</TableHeadCell>
              <TableHeadCell className="text-right">Stock</TableHeadCell>
              <TableHeadCell className="text-right">Low-stock threshold</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {goods.map((g) => {
              const low = isFinishedGoodLow(g);
              return (
                <TableRow key={g.id}>
                  <TableCell className="font-semibold text-foreground">{g.product}</TableCell>
                  <TableCell className="text-muted-foreground">{g.unit}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums text-foreground">{formatNumber(g.stock)}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{formatNumber(g.lowStockThreshold)}</TableCell>
                  <TableCell>
                    {low ? <Badge variant="destructive">Low stock</Badge> : <Badge variant="success">In stock</Badge>}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">
          Finished-goods stock is presented as reflected back to Shopify inventory. This is a status
          note only — no real sync happens.
        </p>
      </div>
    </div>
  );
}
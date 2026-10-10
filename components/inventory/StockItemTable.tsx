import { isLowStock } from "@/lib/inventory";
import type { StockItem } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatNumber } from "@/lib/format";

export function StockItemTable({ items }: { items: StockItem[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeadCell>Item</TableHeadCell>
            <TableHeadCell>Unit</TableHeadCell>
            <TableHeadCell className="text-right">Purchased</TableHeadCell>
            <TableHeadCell className="text-right">Used</TableHeadCell>
            <TableHeadCell className="text-right">Remaining</TableHeadCell>
            <TableHeadCell>Usage</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => {
            const low = isLowStock(item);
            const usage = item.purchased > 0 ? Math.round((item.used / item.purchased) * 100) : 0;
            return (
              <TableRow key={item.id}>
                <TableCell className="font-semibold text-foreground">{item.name}</TableCell>
                <TableCell className="text-muted-foreground">{item.unit}</TableCell>
                <TableCell className="text-right tabular-nums text-foreground">{formatNumber(item.purchased)}</TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">{formatNumber(item.used)}</TableCell>
                <TableCell className="text-right font-semibold tabular-nums text-foreground">{formatNumber(item.remaining)}</TableCell>
                <TableCell className="w-40">
                  <ProgressBar value={usage} label={`${usage}% used`} />
                </TableCell>
                <TableCell>
                  {low ? (
                    <Badge variant="destructive">Low stock</Badge>
                  ) : (
                    <Badge variant="success">In stock</Badge>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {low ? `Below threshold (${item.lowStockThreshold})` : `Threshold ${item.lowStockThreshold}`}
                  </p>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
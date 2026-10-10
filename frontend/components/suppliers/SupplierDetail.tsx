"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { getPurchasesForSupplier, getSupplierById, validatePurchase } from "@/lib/suppliers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { EmptyState } from "@/components/ui/EmptyState";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/controls";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Money } from "@/components/ui/Table";
import { formatDate, formatNumber } from "@/lib/format";
import { IconStore } from "@/components/ui/icons";
import type { Purchase } from "@/lib/types";

export function SupplierDetail({ supplierId }: { supplierId: string }) {
  const supplier = getSupplierById(supplierId);
  const [purchases, setPurchases] = useState<Purchase[]>(getPurchasesForSupplier(supplierId));
  const [total, setTotal] = useState(supplier?.totalPurchased ?? 0);

  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [cost, setCost] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!supplier) {
    return (
      <EmptyState
        title="Supplier not found"
        description={`No supplier matches ${supplierId}. Check the link and try again.`}
        action={
          <Link href="/suppliers" className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
            Back to suppliers
          </Link>
        }
      />
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!supplier) return;
    const validation = validatePurchase(item, Number(quantity), Number(cost));
    if (validation.error) {
      setError(validation.error);
      return;
    }
    const purchase: Purchase = {
      id: `pur_${Date.now()}`,
      supplierId: supplier.id,
      item,
      quantity: Number(quantity),
      unit: unit.trim() || "pcs",
      cost: Number(cost),
      purchasedAt: new Date().toISOString().slice(0, 10),
    };
    setPurchases((prev) => [purchase, ...prev]);
    setTotal((prev) => prev + purchase.cost);
    setSuccess(`Purchase recorded: ${formatNumber(purchase.quantity)} ${purchase.unit} of ${purchase.item}.`);
    setItem("");
    setQuantity("");
    setUnit("");
    setCost("");
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <IconStore width={20} height={20} />
            </span>
            <div>
              <CardTitle>{supplier.name}</CardTitle>
              <CardDescription>{supplier.contact}</CardDescription>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-muted-foreground">Total purchased</p>
              <p className="font-mono text-lg font-semibold tabular-nums text-foreground">
                <Money value={total} />
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Alert variant="info" title="Purchases as costs">
        [NEEDS CLARIFICATION] Whether supplier purchases are inventory (COGS when consumed, BR-06) or
        a direct expense — Specifications §9, item 4. For now the purchase is recorded as a cost.
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Record a purchase</CardTitle>
          <CardDescription>Add a purchase from this supplier to the history.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {error && <Alert variant="destructive" title="Check the form">{error}</Alert>}
            {success && <Alert variant="success" title="Recorded">{success}</Alert>}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Item" htmlFor="sup-item" required className="lg:col-span-2">
                <Input id="sup-item" value={item} onChange={(e) => setItem(e.target.value)} placeholder="Base Oil" />
              </Field>
              <Field label="Quantity" htmlFor="sup-qty" required>
                <Input id="sup-qty" type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="500" />
              </Field>
              <Field label="Unit" htmlFor="sup-unit" hint="Default: pcs">
                <Input id="sup-unit" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="L" />
              </Field>
            </div>
            <Field label="Total cost (Rs.)" htmlFor="sup-cost" required>
              <Input id="sup-cost" type="number" min={0} value={cost} onChange={(e) => setCost(e.target.value)} placeholder="42000" />
            </Field>
            <Button type="submit">Record purchase</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Purchase history</CardTitle>
        </CardHeader>
        <CardContent>
          {purchases.length === 0 ? (
            <p className="text-sm text-muted-foreground">No purchases recorded yet.</p>
          ) : (
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeadCell>Date</TableHeadCell>
                    <TableHeadCell>Item</TableHeadCell>
                    <TableHeadCell className="text-right">Quantity</TableHeadCell>
                    <TableHeadCell className="text-right">Cost</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchases.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-muted-foreground">{formatDate(p.purchasedAt)}</TableCell>
                      <TableCell className="font-medium text-foreground">{p.item}</TableCell>
                      <TableCell className="text-right tabular-nums text-foreground">
                        {formatNumber(p.quantity)} {p.unit}
                      </TableCell>
                      <TableCell className="text-right"><Money value={p.cost} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
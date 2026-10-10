"use client";

import { useState, type FormEvent } from "react";
import { PRODUCTION_PRODUCTS } from "@/lib/inventory";
import { useInventory } from "@/lib/inventory-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/controls";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatNumber } from "@/lib/format";
import { IconPlus, IconX } from "@/components/ui/icons";
import type { StockItem } from "@/lib/types";

export function ProductionPanel() {
  const { materials, productionRuns, recordRun } = useInventory();

  const [product, setProduct] = useState(PRODUCTION_PRODUCTS[0]);
  const [quantity, setQuantity] = useState("");
  const [rows, setRows] = useState<{ name: string; qty: string }[]>([
    { name: materials[0]?.name ?? "", qty: "" },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const consumedPreview = rows
    .filter((r) => r.name)
    .map((r) => ({ name: r.name, qty: Number(r.qty) }));

  const expectedImpact = {
    decreases: consumedPreview
      .map((c) => materials.find((m) => m.name === c.name))
      .filter((m): m is StockItem => Boolean(m))
      .map((m) => `${m.name} −${Number.isFinite(consumedPreview.find((c) => c.name === m.name)!.qty) ? consumedPreview.find((c) => c.name === m.name)!.qty : 0} ${m.unit}`),
    increase: `+${Number(quantity) || 0} pcs of ${product}`,
  };

  function addRow() {
    setRows((r) => [...r, { name: materials[0]?.name ?? "", qty: "" }]);
  }

  function removeRow(index: number) {
    setRows((r) => r.filter((_, i) => i !== index));
  }

  function updateRow(index: number, patch: Partial<{ name: string; qty: string }>) {
    setRows((r) => r.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const consumed = rows
      .filter((r) => r.name)
      .map((r) => ({ name: r.name, qty: Number(r.qty) }));
    const qty = Number(quantity);

    const result = recordRun(product, qty, consumed);
    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess(`Production run recorded: ${qty} × ${product}. Raw materials decreased and finished-goods stock increased.`);
    setQuantity("");
    setRows([{ name: materials[0]?.name ?? "", qty: "" }]);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Record a production run</CardTitle>
          <CardDescription>Consume raw and packaging materials to produce finished goods.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {error && <Alert variant="destructive" title="Cannot record the run">{error}</Alert>}
            {success && <Alert variant="success" title="Recorded">{success}</Alert>}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Product" htmlFor="prod-product" required>
                <Select id="prod-product" value={product} onChange={(e) => setProduct(e.target.value)}>
                  {PRODUCTION_PRODUCTS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Quantity to produce" htmlFor="prod-qty" required>
                <Input
                  id="prod-qty"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="50"
                />
              </Field>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-foreground">
                Materials consumed
                <span className="ml-1 text-muted-foreground">(unit cost tracked as manufacturing COGS)</span>
              </p>
              {rows.map((row, i) => (
                <div key={i} className="flex items-end gap-2">
                  <div className="flex-1">
                    <Field label="Material" htmlFor={`prod-mat-${i}`}>
                      <Select
                        id={`prod-mat-${i}`}
                        value={row.name}
                        onChange={(e) => updateRow(i, { name: e.target.value })}
                      >
                        {materials.map((m) => (
                          <option key={m.id} value={m.name}>
                            {m.name} ({formatNumber(m.remaining)} {m.unit} available)
                          </option>
                        ))}
                      </Select>
                    </Field>
                  </div>
                  <div className="w-28">
                    <Field label="Qty" htmlFor={`prod-mat-qty-${i}`}>
                      <Input
                        id={`prod-mat-qty-${i}`}
                        type="number"
                        min={0}
                        value={row.qty}
                        onChange={(e) => {
                          const v = e.target.value.replace(/[^\d.]/g, "");
                          updateRow(i, { qty: v });
                        }}
                        placeholder="0"
                      />
                    </Field>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    disabled={rows.length === 1}
                    className="mb-1 flex h-10 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                    aria-label="Remove material row"
                  >
                    <IconX width={16} height={16} />
                  </button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addRow}>
                <IconPlus width={14} height={14} /> Add material
              </Button>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Expected stock impact
              </p>
              <ul className="mt-2 space-y-1 text-sm text-foreground">
                {expectedImpact.decreases.map((d) => (
                  <li key={d}>{d}</li>
                ))}
                <li className="font-medium">{expectedImpact.increase}</li>
              </ul>
            </div>

            <Button type="submit" size="lg">Record run</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Run history</CardTitle>
          <CardDescription>Each run lists the date, product, quantity, and materials consumed.</CardDescription>
        </CardHeader>
        <CardContent>
          {productionRuns.length === 0 ? (
            <p className="text-sm text-muted-foreground">No production runs yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {productionRuns.map((run) => (
                <div key={run.id} className="rounded-lg border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {run.product} × {formatNumber(run.quantity)}
                    </p>
                    <Badge variant="neutral">{formatDate(run.producedAt)}</Badge>
                  </div>
                  <ul className="mt-2 space-y-0.5 text-sm text-muted-foreground">
                    {run.consumed.map((c, i) => (
                      <li key={i}>
                        − {formatNumber(c.qty)} {materials.find((m) => m.name === c.name)?.unit ?? "u"} {c.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
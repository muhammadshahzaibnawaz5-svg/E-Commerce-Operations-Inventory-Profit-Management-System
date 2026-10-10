"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getExpenseCategories, validateExpense } from "@/lib/expenses";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/controls";
import { Badge } from "@/components/ui/Badge";
import type { ExpenseType } from "@/lib/types";

const SELLING_CATEGORIES = ["Raw Materials", "Packaging", "Advertising"];

function typeForCategory(category: string): ExpenseType {
  return SELLING_CATEGORIES.includes(category) ? "selling" : "operating";
}

export function ExpenseForm() {
  const router = useRouter();
  const categories = getExpenseCategories();
  const [category, setCategory] = useState(categories[0]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const validation = validateExpense({ category, amount: Number(amount), date, note });
    if (validation.error) {
      setError(validation.error);
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    setSuccess(true);
  }

  if (success) {
    return (
      <Card>
        <CardContent className="flex flex-col gap-3 pt-5">
          <Alert variant="success" title="Expense added">
            The expense was recorded for this review session and will appear on the expenses ledger.
          </Alert>
          <div className="flex gap-3">
            <Button onClick={() => router.push("/expenses")}>Back to expenses</Button>
            <Button variant="outline" onClick={() => { setSuccess(false); setAmount(""); setDate(""); setNote(""); }}>
              Add another
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add an expense</CardTitle>
        <CardDescription>Record a business cost by category, amount and date.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {error && <Alert variant="destructive" title="Check the form">{error}</Alert>}
          <Field label="Category" htmlFor="exp-category" required>
            <Select id="exp-category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </Field>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={typeForCategory(category) === "selling" ? "primary" : "neutral"}>
              {typeForCategory(category) === "selling" ? "Selling expense" : "Operating expense"}
            </Badge>
            <p className="text-xs text-muted-foreground">
              Raw Materials, Packaging and Advertising count toward selling costs on the P&amp;L.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Amount (Rs.)" htmlFor="exp-amount" required>
              <Input id="exp-amount" type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="2500" />
            </Field>
            <Field label="Date" htmlFor="exp-date" required>
              <Input id="exp-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
          </div>
          <Field label="Note" htmlFor="exp-note" hint="Optional.">
            <Textarea id="exp-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Electricity bill" />
          </Field>
          <Button type="submit" size="lg" disabled={saving}>
            {saving ? "Saving…" : "Save expense"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
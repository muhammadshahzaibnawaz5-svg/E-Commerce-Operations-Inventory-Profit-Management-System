"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { filterExpensesByCategory, getExpenseCategories, getExpenses, sumExpenses } from "@/lib/expenses";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Money } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/controls";
import { Button } from "@/components/ui/Button";
import { formatDate, formatMoney } from "@/lib/format";
import { IconPlus, IconWallet } from "@/components/ui/icons";
import type { Expense } from "@/lib/types";

const typeVariant: Record<Expense["type"], "primary" | "neutral"> = {
  selling: "primary",
  operating: "neutral",
};

export function ExpensesList() {
  const expenses = getExpenses();
  const categories = getExpenseCategories();
  const [category, setCategory] = useState("All categories");

  const filtered = useMemo(
    () => filterExpensesByCategory(expenses, category),
    [expenses, category],
  );

  const total = useMemo(() => {
    const all = sumExpenses(expenses);
    const operating = sumExpenses(expenses.filter((e) => e.type === "operating"));
    const selling = sumExpenses(expenses.filter((e) => e.type === "selling"));
    return { all, operating, selling };
  }, [expenses]);

  const filteredTotal = sumExpenses(filtered);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total expenses" value={formatMoney(total.all)} icon={<IconWallet width={18} height={18} />} delta="Selling + operating" />
        <StatCard label="Operating expenses" value={formatMoney(total.operating)} icon={<IconWallet width={18} height={18} />} delta="Salaries, utilities and more" />
        <StatCard label="Selling expenses" value={formatMoney(total.selling)} icon={<IconWallet width={18} height={18} />} delta="Not counting ad spend rows" />
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="w-full max-w-64">
          <Field label="Category" htmlFor="expenses-category">
            <Select id="expenses-category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="All categories">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </Field>
        </div>
        <Link href="/expenses/new">
          <Button>
            <IconPlus width={16} height={16} /> Add expense
          </Button>
        </Link>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "expense" : "expenses"} · total {formatMoney(filteredTotal)}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="No expenses in this category"
          description="Try a different category or add a new expense."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Category</TableHeadCell>
                <TableHeadCell>Type</TableHeadCell>
                <TableHeadCell>Date</TableHeadCell>
                <TableHeadCell>Note</TableHeadCell>
                <TableHeadCell className="text-right">Amount</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium text-foreground">{e.category}</TableCell>
                  <TableCell><Badge variant={typeVariant[e.type]}>{e.type}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(e.date)}</TableCell>
                  <TableCell className="text-muted-foreground">{e.note || "—"}</TableCell>
                  <TableCell className="text-right"><Money value={e.amount} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
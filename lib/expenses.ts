import { adCampaigns, adSpend } from "@/lib/data/advertising";
import { expenseCategories, expenses } from "@/lib/data/expenses";
import type { AdCampaign, AdSpend, Expense } from "@/lib/types";

export function getAdCampaigns(): AdCampaign[] {
  return adCampaigns;
}

export function getAdSpend(): AdSpend[] {
  return adSpend;
}

export function getCampaignById(id: string): AdCampaign | undefined {
  return adCampaigns.find((c) => c.id === id);
}

export function sumAdSpend(rows: AdSpend[]): number {
  return rows.reduce((sum, row) => sum + row.amount, 0);
}

export function getExpenses(): Expense[] {
  return expenses;
}

export function getExpenseCategories(): string[] {
  return expenseCategories;
}

export function filterExpensesByCategory(rows: Expense[], category: string): Expense[] {
  if (!category || category === "All categories") return rows;
  return rows.filter((e) => e.category === category);
}

export function sumExpenses(rows: Expense[]): number {
  return rows.reduce((sum, e) => sum + e.amount, 0);
}

export function validateExpense(
  input: { category: string; amount: number; date: string; note: string },
): { error?: string } {
  if (!input.category) return { error: "Category is required" };
  if (!Number.isFinite(input.amount) || input.amount <= 0)
    return { error: "Amount must be greater than 0" };
  if (!input.date) return { error: "Date is required" };
  return {};
}
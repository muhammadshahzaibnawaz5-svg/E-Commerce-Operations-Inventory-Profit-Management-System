import type { Expense } from "@/lib/types";

export const expenses: Expense[] = [
  { id: "exp_1", category: "Salaries", amount: 25000, date: "2026-10-01", note: "Team salaries", type: "operating" },
  { id: "exp_2", category: "Utilities", amount: 3200, date: "2026-10-03", note: "Electricity", type: "operating" },
];

export const expenseCategories = [
  "Raw Materials",
  "Packaging",
  "Advertising",
  "Salaries",
  "Utilities",
  "Other",
];
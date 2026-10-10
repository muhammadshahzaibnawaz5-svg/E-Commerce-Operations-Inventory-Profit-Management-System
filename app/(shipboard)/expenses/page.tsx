import { PageHeader } from "@/components/ui/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { ExpensesList } from "@/components/expenses/ExpensesList";

export default function ExpensesPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Expenses"
        description="Operating and selling expenses by category, amount and date."
      />
      <div className="mb-6">
        <Alert variant="info" title="Expense categories & formats">
          [NEEDS CLARIFICATION] The final list of expense categories and the required report/export
          formats are unconfirmed — Specifications §9, item 7. Default categories are shown until
          confirmed.
        </Alert>
      </div>
      <ExpensesList />
    </div>
  );
}
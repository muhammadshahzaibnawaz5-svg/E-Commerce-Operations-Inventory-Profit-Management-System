import { PageHeader } from "@/components/ui/PageHeader";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";

export default function NewExpensePage() {
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Add an expense" description="Record a business cost." />
      <ExpenseForm />
    </div>
  );
}
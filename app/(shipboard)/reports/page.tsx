import { PageHeader } from "@/components/ui/PageHeader";
import { ReportsView } from "@/components/reports/ReportsView";

export default function ReportsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Reports"
        description="Summaries and export previews for the store."
      />
      <ReportsView />
    </div>
  );
}

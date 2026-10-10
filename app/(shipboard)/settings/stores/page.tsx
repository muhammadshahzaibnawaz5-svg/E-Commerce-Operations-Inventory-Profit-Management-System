import { PageHeader } from "@/components/ui/PageHeader";
import { StoresList } from "@/components/store/StoresList";

export default function StoresSettingsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Connected stores"
        description="Review connected stores and the entities synced from each."
      />
      <StoresList />
    </div>
  );
}
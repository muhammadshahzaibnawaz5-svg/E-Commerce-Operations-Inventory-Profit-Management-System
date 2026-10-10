import { PageHeader } from "@/components/ui/PageHeader";
import { StoreConnect } from "@/components/store/StoreConnect";

export default function StoreSettingsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Store connection"
        description="Connect the Shopify store that all orders, inventory and finance features are attributed to."
      />
      <StoreConnect />
    </div>
  );
}
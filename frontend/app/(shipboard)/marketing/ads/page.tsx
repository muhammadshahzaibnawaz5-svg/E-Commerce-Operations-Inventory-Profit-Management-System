import { PageHeader } from "@/components/ui/PageHeader";
import { AdsOverview } from "@/components/ads/AdsOverview";

export default function AdsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Advertising"
        description="Ad spend by campaign and date for Meta and TikTok, including manual entries."
      />
      <AdsOverview />
    </div>
  );
}
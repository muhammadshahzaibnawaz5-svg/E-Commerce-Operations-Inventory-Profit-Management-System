import type { AdCampaign, AdSpend } from "@/lib/types";

export const adCampaigns: AdCampaign[] = [
  { id: "cmp_1", platform: "Meta", name: "Retargeting - Oct", source: "API" },
  { id: "cmp_2", platform: "Meta", name: "Prospecting - Oct", source: "API" },
  { id: "cmp_3", platform: "TikTok", name: "Spark Ads - Oct", source: "Manual" },
];

export const adSpend: AdSpend[] = [
  { id: "ads_1", campaignId: "cmp_1", date: "2026-10-08", amount: 400 },
  { id: "ads_2", campaignId: "cmp_2", date: "2026-10-08", amount: 300 },
  { id: "ads_3", campaignId: "cmp_3", date: "2026-10-09", amount: 150 },
];
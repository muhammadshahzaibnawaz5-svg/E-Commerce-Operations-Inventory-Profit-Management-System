# Mock Data & Screen Inventory: Advertising & Expenses

**Feature**: `007-advertising-expenses`

## Routes & Components

| Route | Page file | Purpose | Key states |
|---|---|---|---|
| `/marketing/ads` | `app/marketing/ads/page.tsx` | Spend by campaign/date + add cost | populated, filtered, empty, modal-open |
| `/expenses` | `app/expenses/page.tsx` | Ledger + category filter | populated, filtered, empty |
| `/expenses/new` | `app/expenses/new/page.tsx` | Category/amount/date/note | default, validation-error, success |

Shared: `components/marketing/AdSpendTable.tsx`, `AddCostModal.tsx`.

## UI States

- **filtered** — date range (ads) or category (expenses) applied; total recomputed.
- **empty** — "No spend recorded for this period" / "No expenses in this category".
- **validation-error** — required field missing or amount ≤ 0.
- **success** — row added; total updated.
- **possible-duplicate** — visual flag on a manual row resembling an API row.

## Mock Data Shapes (`frontend/lib/types.ts` + `frontend/lib/data/`)

### Advertising
```ts
export type AdPlatform = "Meta" | "TikTok";
export interface AdCampaign { id: string; platform: AdPlatform; name: string; source: "API" | "Manual"; }
export interface AdSpend { id: string; campaignId: string; date: string; amount: number; }
```
```ts
export const adCampaigns: AdCampaign[] = [
  { id: "cmp_1", platform: "Meta",   name: "Retargeting - Oct", source: "API" },
  { id: "cmp_2", platform: "Meta",   name: "Prospecting - Oct", source: "API" },
  { id: "cmp_3", platform: "TikTok", name: "Spark Ads - Oct",   source: "Manual" },
];

export const adSpend: AdSpend[] = [
  { id: "ads_1", campaignId: "cmp_1", date: "2026-10-08", amount: 400 },
  { id: "ads_2", campaignId: "cmp_2", date: "2026-10-08", amount: 300 },
  { id: "ads_3", campaignId: "cmp_3", date: "2026-10-09", amount: 150 },
];
```

### Expenses
```ts
export type ExpenseType = "selling" | "operating";
export interface Expense {
  id: string; category: string; amount: number; date: string; note: string; type: ExpenseType;
}
export const expenseCategories = ["Raw Materials", "Packaging", "Advertising", "Salaries", "Utilities", "Other"];
```
```ts
export const expenses: Expense[] = [
  { id: "exp_1", category: "Salaries",  amount: 25000, date: "2026-10-01", note: "Team salaries", type: "operating" },
  { id: "exp_2", category: "Utilities", amount: 3200,  date: "2026-10-03", note: "Electricity",   type: "operating" },
];
```

## Notes

- Platform badge distinguishes Meta (API) from TikTok (Manual) — provisional pending Specifications §9 item 3.
- Expense category list is a placeholder pending Specifications §9 item 7.
- Export buttons on reports are handled by feature 008.

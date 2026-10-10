"use client";

import { useMemo, useState, type FormEvent } from "react";
import { getAdCampaigns, getAdSpend, sumAdSpend } from "@/lib/expenses";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Modal } from "@/components/ui/Modal";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/controls";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Money } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
import { formatDate, formatMoney } from "@/lib/format";
import { IconMegaphone, IconPlus } from "@/components/ui/icons";
import type { AdCampaign, AdPlatform, AdSpend } from "@/lib/types";

const ALL = "all";

export function AdsOverview() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(getAdCampaigns());
  const [spend, setSpend] = useState<AdSpend[]>(getAdSpend());
  const [platform, setPlatform] = useState<AdPlatform | "all">("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [flagged, setFlagged] = useState<Set<string>>(new Set());

  function toggleFlag(id: string) {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const filtered = useMemo(() => {
    return spend.filter((row) => {
      if (platform !== "all") {
        const campaign = campaigns.find((c) => c.id === row.campaignId);
        if (campaign?.platform !== platform) return false;
      }
      if (from && row.date < from) return false;
      if (to && row.date > to) return false;
      return true;
    });
  }, [spend, campaigns, platform, from, to]);

  const total = sumAdSpend(filtered);
  const apiRowCount = filtered.filter((row) => campaigns.find((c) => c.id === row.campaignId)?.source === "API").length;
  const manualRowCount = filtered.length - apiRowCount;

  return (
    <div className="flex flex-col gap-6">
      <Alert variant="info" title="TikTok integration">
        [NEEDS CLARIFICATION] Whether TikTok ad spend is API-integrated or manual-only —
        Specifications §9, item 3. Meta is treated as the API source; TikTok entries are entered
        manually until confirmed.
      </Alert>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Ad spend (period)" value={formatMoney(total)} icon={<IconMegaphone width={18} height={18} />} delta="Selling expense" />
        <StatCard label="API-synced rows" value={String(apiRowCount)} icon={<IconMegaphone width={18} height={18} />} delta="Meta (assumed)" />
        <StatCard label="Manual rows" value={String(manualRowCount)} icon={<IconPlus width={18} height={18} />} delta="Entered by hand" />
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="w-full max-w-64">
          <Field label="Platform" htmlFor="ads-platform">
            <Select id="ads-platform" value={platform} onChange={(e) => setPlatform(e.target.value as AdPlatform | "all")}>
              <option value={ALL}>All platforms</option>
              <option value="Meta">Meta</option>
              <option value="TikTok">TikTok</option>
            </Select>
          </Field>
        </div>
        <div className="w-40">
          <Field label="From" htmlFor="ads-from">
            <Input id="ads-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </Field>
        </div>
        <div className="w-40">
          <Field label="To" htmlFor="ads-to">
            <Input id="ads-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </Field>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <IconPlus width={16} height={16} /> Add cost
        </Button>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "row" : "rows"} · total {formatMoney(total)}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          title="No ad spend in this range"
          description="Adjust the date range or add a manual cost."
          action={
            <Button onClick={() => setAddOpen(true)}>
              <IconPlus width={16} height={16} /> Add cost
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Platform</TableHeadCell>
                <TableHeadCell>Campaign</TableHeadCell>
                <TableHeadCell>Source</TableHeadCell>
                <TableHeadCell>Date</TableHeadCell>
                <TableHeadCell className="text-right">Spend</TableHeadCell>
                <TableHeadCell>Flags</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((row) => {
                const campaign = campaigns.find((c) => c.id === row.campaignId);
                return (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Badge variant={campaign?.platform === "Meta" ? "primary" : "accent"}>
                        {campaign?.platform ?? "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{campaign?.name ?? "Unknown campaign"}</TableCell>
                    <TableCell>
                      <Badge variant={campaign?.source === "API" ? "success" : "warning"}>
                        {campaign?.source ?? "Manual"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(row.date)}</TableCell>
                    <TableCell className="text-right"><Money value={row.amount} /></TableCell>
                    <TableCell>
                      {flagged.has(row.id) ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="warning">Possible duplicate</Badge>
                          <button
                            type="button"
                            onClick={() => toggleFlag(row.id)}
                            className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
                          >
                            Clear
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleFlag(row.id)}
                          aria-pressed={false}
                          className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
                        >
                          Flag duplicate
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <AddCostModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        campaigns={campaigns}
        platform={platform === "all" ? null : platform}
        onSave={(row, campaign) => {
          setSpend((prev) => [...prev, row]);
          if (campaign) setCampaigns((prev) => [...prev, campaign]);
          setAddOpen(false);
        }}
      />
    </div>
  );
}

function AddCostModal({
  open,
  onClose,
  campaigns,
  platform,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  campaigns: AdCampaign[];
  platform: AdPlatform | null;
  onSave: (row: AdSpend, campaign?: AdCampaign) => void;
}) {
  const [selPlatform, setSelPlatform] = useState<AdPlatform>("Meta");
  const [campaignName, setCampaignName] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  const existing = campaigns.filter((c) => (platform ? c.platform === platform : c.platform === selPlatform));

  function reset() {
    setCampaignName("");
    setDate("");
    setAmount("");
    setError(null);
    setSelPlatform("Meta");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const qty = Number(amount);
    if (!campaignName.trim()) return setError("Campaign name is required");
    if (!Number.isFinite(qty) || qty <= 0) return setError("Amount must be greater than 0");
    if (!date) return setError("Date is required");

    const finalPlatform = platform ?? selPlatform;
    let campaign = existing.find((c) => c.name.toLowerCase() === campaignName.trim().toLowerCase());
    let newCampaign: AdCampaign | undefined;
    if (!campaign) {
      newCampaign = { id: `cmp_${Date.now()}`, platform: finalPlatform, name: campaignName.trim(), source: "Manual" };
      campaign = newCampaign;
    }
    onSave(
      { id: `ads_${Date.now()}`, campaignId: campaign.id, date, amount: qty },
      newCampaign,
    );
    reset();
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        reset();
      }}
      title="Add manual ad cost"
      footer={
        <>
          <Button variant="outline" onClick={() => { onClose(); reset(); }}>Cancel</Button>
          <Button type="submit" form="add-cost-form">Add cost</Button>
        </>
      }
    >
      <form id="add-cost-form" onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && <Alert variant="destructive" title="Check the form">{error}</Alert>}
        {platform === null && (
          <Field label="Platform" htmlFor="add-platform" required>
            <Select id="add-platform" value={selPlatform} onChange={(e) => setSelPlatform(e.target.value as AdPlatform)}>
              <option value="Meta">Meta</option>
              <option value="TikTok">TikTok</option>
            </Select>
          </Field>
        )}
        <Field
          label="Campaign"
          htmlFor="add-campaign"
          required
          hint="Choose an existing campaign or type a new one."
        >
          <Input
            id="add-campaign"
            list="existing-campaigns"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="Spark Ads - Oct"
          />
          <datalist id="existing-campaigns">
            {existing.map((c) => (
              <option key={c.id} value={c.name} />
            ))}
          </datalist>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Date" htmlFor="add-date" required>
            <Input id="add-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Amount (Rs.)" htmlFor="add-amount" required>
            <Input id="add-amount" type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="150" />
          </Field>
        </div>
        <p className="text-xs text-muted-foreground">
          Ad spend is treated as a selling expense on the Profit &amp; Loss.
        </p>
      </form>
    </Modal>
  );
}
"use client";

import { useState } from "react";
import { getStores } from "@/lib/store";
import type { Store } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { formatDateTime, formatNumber } from "@/lib/format";
import { IconChevronDown, IconChevronRight, IconStore } from "@/components/ui/icons";

const statusVariant: Record<Store["connectionStatus"], "success" | "warning" | "destructive"> = {
  Connected: "success",
  Disconnected: "warning",
  Error: "destructive",
};

const entityLabels: { key: keyof Store["entityCounts"]; label: string }[] = [
  { key: "products", label: "Products" },
  { key: "customers", label: "Customers" },
  { key: "orders", label: "Orders" },
  { key: "payments", label: "Payments" },
  { key: "refunds", label: "Refunds" },
  { key: "inventory", label: "Inventory" },
];

export function StoresList() {
  const stores = getStores();
  const [selected, setSelected] = useState<string | null>(null);

  if (stores.length === 0) {
    return (
      <EmptyState
        icon={<IconStore width={22} height={22} />}
        title="No stores connected yet"
        description="Connect your first Shopify store to start importing orders, payments and inventory."
        action={<ButtonLink href="/settings/store">Connect a store</ButtonLink>}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Alert variant="info" title="Store identification">
        Every synced record is presented as belonging to a specific store (business rule BR-07).
      </Alert>

      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell />
              <TableHeadCell>Store</TableHeadCell>
              <TableHeadCell>Shopify URL</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Last synced</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stores.map((store) => {
              const isOpen = selected === store.id;
              return (
                <StoresRow
                  key={store.id}
                  store={store}
                  open={isOpen}
                  onToggle={() => setSelected(isOpen ? null : store.id)}
                />
              );
            })}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        [NEEDS CLARIFICATION] Single vs multiple store support is pending client confirmation
        (Specifications §9, item 8).
      </p>
    </div>
  );
}

function StoresRow({
  store,
  open,
  onToggle,
}: {
  store: Store;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <TableRow className="cursor-pointer" onClick={onToggle}>
        <TableCell className="w-10">
          <span className="flex items-center justify-center text-muted-foreground">
            {open ? <IconChevronDown width={16} height={16} /> : <IconChevronRight width={16} height={16} />}
          </span>
        </TableCell>
        <TableCell className="font-semibold text-foreground">{store.name}</TableCell>
        <TableCell className="font-mono text-muted-foreground">{store.shopifyUrl}</TableCell>
        <TableCell>
          <Badge variant={statusVariant[store.connectionStatus]}>{store.connectionStatus}</Badge>
        </TableCell>
        <TableCell className="text-muted-foreground">
          {store.lastSyncedAt ? formatDateTime(store.lastSyncedAt) : "Not synced"}
        </TableCell>
      </TableRow>
      {open && (
        <tr className="border-b border-border bg-muted/30">
          <td />
          <td colSpan={4} className="px-4 py-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Synced entities
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {entityLabels.map((e) => (
                  <div key={e.key} className="rounded-lg border border-border bg-background p-3">
                    <p className="text-xs text-muted-foreground">{e.label}</p>
                    <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">
                      {formatNumber(store.entityCounts[e.key])}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import type { SyncEntityState, SyncRun } from "@/lib/types";
import { syncEntities } from "@/lib/data/stores";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/controls";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { SyncProgress } from "@/components/store/SyncProgress";
import { formatDateTime } from "@/lib/format";
import { IconLink, IconStore } from "@/components/ui/icons";

interface ConnectedStore {
  name: string;
  shopifyUrl: string;
  lastSyncedAt: string;
}

const STORAGE_KEY = "mockStore";

const flow: SyncEntityState[][] = [
  ["importing", "queued", "queued", "queued", "queued", "queued"],
  ["complete", "importing", "queued", "queued", "queued", "queued"],
  ["complete", "complete", "importing", "queued", "queued", "queued"],
  ["complete", "complete", "complete", "importing", "queued", "queued"],
  ["complete", "complete", "complete", "complete", "importing", "queued"],
  ["complete", "complete", "complete", "complete", "complete", "importing"],
  ["complete", "complete", "complete", "complete", "complete", "complete"],
];

function makeRun(step: number, startedAt: string): SyncRun {
  return {
    storeId: "st_001",
    startedAt,
    status: step === 0 ? "connecting" : step === flow.length - 1 ? "complete" : "importing",
    entities: syncEntities.map((e, i) => ({ name: e.name, state: flow[step][i] })),
  };
}

export function StoreConnect() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [advisory, setAdvisory] = useState<string | null>(null);
  const [run, setRun] = useState<SyncRun | null>(null);
  const [connected, setConnected] = useState<ConnectedStore | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setConnected(JSON.parse(raw) as ConnectedStore);
      } catch {
        setConnected(null);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startSync = useCallback(
    (storeName: string, storeUrl: string) => {
      const startedAt = new Date().toISOString();
      let step = 0;
      setRun(makeRun(0, startedAt));
      timerRef.current = setInterval(() => {
        step += 1;
        if (step >= flow.length) {
          if (timerRef.current) clearInterval(timerRef.current);
          const store: ConnectedStore = {
            name: storeName,
            shopifyUrl: storeUrl,
            lastSyncedAt: new Date().toISOString(),
          };
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
          setRun(makeRun(flow.length - 1, startedAt));
          setConnected(store);
          return;
        }
        setRun(makeRun(step, startedAt));
      }, 900);
    },
    [],
  );

  function handleConnect(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setAdvisory(null);
    if (!name.trim()) {
      setError("Store name is required");
      return;
    }
    if (!url.trim()) {
      setError("Shopify store URL is required");
      return;
    }
    const normalized = url.trim().toLowerCase();
    if (!normalized.includes("myshopify.com")) {
      setAdvisory(
        "This does not look like a Shopify store URL (expected your-store.myshopify.com). You can still connect to preview the flow.",
      );
    }
    startSync(name.trim(), url.trim());
  }

  function handleDisconnect() {
    window.localStorage.removeItem(STORAGE_KEY);
    if (timerRef.current) clearInterval(timerRef.current);
    setRun(null);
    setConnected(null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        {connected ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>Connected store</CardTitle>
                <Badge variant="success">{connected.shopifyUrl.includes("myshopify.com") ? "Connected" : "Connected (advisory)"}</Badge>
              </div>
              <CardDescription>This simulated connection is stored locally for the session.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <IconStore width={20} height={20} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{connected.name}</p>
                  <p className="truncate font-mono text-xs text-muted-foreground">{connected.shopifyUrl}</p>
                </div>
              </div>
              {run && run.status !== "complete" && (
                <Alert variant="info" title="Sync in progress">
                  Shopify GraphQL initial sync and webhook event sync are future backend behavior.
                </Alert>
              )}
              {run && <SyncProgress run={run} />}
              <p className="text-xs text-muted-foreground">
                Last synced: {formatDateTime(connected.lastSyncedAt)}
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => startSync(connected.name, connected.shopifyUrl)}>
                  Sync again
                </Button>
                <Button variant="destructive" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Connect your Shopify store</CardTitle>
              <CardDescription>Link the main store to attribute all features to it.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleConnect} className="flex flex-col gap-4" noValidate>
                {error && <Alert variant="destructive" title="Check the form">{error}</Alert>}
                {advisory && <Alert variant="warning" title="Advisory">{advisory}</Alert>}
                <Field label="Main store name" htmlFor="storeName" required hint="The name is used as the store context across the app.">
                  <Input id="storeName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Aroma Home Goods" />
                </Field>
                <Field label="Shopify store URL" htmlFor="shopifyUrl" required>
                  <div className="relative">
                    <IconLink className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width={16} height={16} />
                    <Input
                      id="shopifyUrl"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="aroma-home-goods.myshopify.com"
                      className="pl-9 font-mono"
                    />
                  </div>
                </Field>
                <Button type="submit" size="lg" disabled={run !== null && run.status !== "complete"}>
                  Connect Store
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>What will be synced</CardTitle>
            <CardDescription>A simulated initial import; no Shopify API is called.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border rounded-lg border border-border">
              {syncEntities.map((entity) => (
                <li key={entity.name} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm">
                  <span className="font-medium text-foreground">{entity.name}</span>
                  <span className="text-xs text-muted-foreground">{entity.note}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              [NEEDS CLARIFICATION] Whether the system supports one store or multiple stores is pending
              client confirmation (Specifications §9, item 8).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
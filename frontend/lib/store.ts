import { sampleSyncRun, stores } from "@/lib/data/stores";
import type { Store, SyncRun } from "@/lib/types";

export function getStores(): Store[] {
  return stores;
}

export function getStoreById(id: string): Store | undefined {
  return stores.find((s) => s.id === id);
}

export function getSyncRun(): SyncRun {
  return sampleSyncRun;
}

export function validateStoreForm(name: string, url: string): { error?: string } {
  if (!name.trim()) return { error: "Store name is required" };
  if (!url.trim()) return { error: "Shopify store URL is required" };
  if (!url.trim().toLowerCase().includes("myshopify.com")) {
    return { error: "URL should look like your-store.myshopify.com" };
  }
  return {};
}
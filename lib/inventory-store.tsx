"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  finishedGoods as finishedGoodsData,
  packagingMaterials as packagingMaterialsData,
  productionRuns as productionRunsData,
  rawMaterials as rawMaterialsData,
} from "@/lib/data/inventory";
import { validateProductionRun } from "@/lib/inventory";
import type { FinishedGood, ProductionRun, StockItem } from "@/lib/types";

interface InventoryContextValue {
  rawMaterials: StockItem[];
  packagingMaterials: StockItem[];
  finishedGoods: FinishedGood[];
  productionRuns: ProductionRun[];
  materials: StockItem[];
  recordRun: (
    product: string,
    quantity: number,
    consumed: { name: string; qty: number }[],
  ) => { error?: string };
}

const InventoryContext = createContext<InventoryContextValue | null>(null);

function consume(items: StockItem[], consumed: { name: string; qty: number }[]): StockItem[] {
  return items.map((item) => {
    const row = consumed.find((c) => c.name === item.name);
    return row
      ? { ...item, used: item.used + row.qty, remaining: item.remaining - row.qty }
      : item;
  });
}

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [rawMaterials, setRawMaterials] = useState<StockItem[]>(() =>
    rawMaterialsData.map((item) => ({ ...item })),
  );
  const [packagingMaterials, setPackagingMaterials] = useState<StockItem[]>(() =>
    packagingMaterialsData.map((item) => ({ ...item })),
  );
  const [finishedGoods, setFinishedGoods] = useState<FinishedGood[]>(() =>
    finishedGoodsData.map((item) => ({ ...item })),
  );
  const [productionRuns, setProductionRuns] = useState<ProductionRun[]>(() =>
    productionRunsData.map((run) => ({ ...run })),
  );

  const materials = useMemo(
    () => [...rawMaterials, ...packagingMaterials],
    [rawMaterials, packagingMaterials],
  );

  const recordRun = useCallback(
    (product: string, quantity: number, consumed: { name: string; qty: number }[]) => {
      const validation = validateProductionRun(consumed, product, quantity, materials);
      if (validation.error) return validation;

      setRawMaterials((prev) => consume(prev, consumed));
      setPackagingMaterials((prev) => consume(prev, consumed));
      setFinishedGoods((prev) =>
        prev.map((item) =>
          item.product === product ? { ...item, stock: item.stock + quantity } : item,
        ),
      );
      setProductionRuns((prev) => [
        {
          id: `pr_${Date.now()}`,
          product,
          quantity,
          producedAt: new Date().toISOString().slice(0, 10),
          consumed,
        },
        ...prev,
      ]);
      return {};
    },
    [materials],
  );

  const value = useMemo(
    () => ({
      rawMaterials,
      packagingMaterials,
      finishedGoods,
      productionRuns,
      materials,
      recordRun,
    }),
    [rawMaterials, packagingMaterials, finishedGoods, productionRuns, materials, recordRun],
  );

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory(): InventoryContextValue {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used within an InventoryProvider");
  return ctx;
}

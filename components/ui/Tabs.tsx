"use client";

import { useState, type ReactNode } from "react";

export interface TabItem {
  key: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  defaultKey?: string;
  render: (key: string) => ReactNode;
}

export function Tabs({ items, defaultKey, render }: TabsProps) {
  const [active, setActive] = useState(defaultKey ?? items[0]?.key ?? "");
  return (
    <div>
      <div
        role="tablist"
        className="flex gap-1 border-b border-border"
        aria-label="Tabs"
      >
        {items.map((item) => {
          const isActive = item.key === active;
          return (
            <button
              key={item.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(item.key)}
              className={`cursor-pointer rounded-t-lg border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div className="pt-4">{render(active)}</div>
    </div>
  );
}
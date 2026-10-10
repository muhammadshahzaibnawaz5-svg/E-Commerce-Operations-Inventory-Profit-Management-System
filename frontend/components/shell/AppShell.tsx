"use client";

import { Suspense, useState, type ReactNode } from "react";
import { Sidebar } from "@/components/shell/Sidebar";
import { Header } from "@/components/shell/Header";

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Suspense fallback={null}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <Header onMenu={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
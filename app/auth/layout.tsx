import type { ReactNode } from "react";
import { Brand } from "@/components/shell/Brand";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
      <div className="mb-8">
        <Brand />
      </div>
      <div className="w-full max-w-md">{children}</div>
      <p className="mt-8 text-xs text-muted-foreground">
        E-Commerce Operations, Inventory &amp; Profit Management — markup prototype
      </p>
    </div>
  );
}
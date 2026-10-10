import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  icon?: ReactNode;
  tone?: "default" | "positive" | "negative";
}

const toneClasses = {
  default: "text-foreground",
  positive: "text-success",
  negative: "text-destructive",
};

export function StatCard({ label, value, delta, icon, tone = "default" }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </span>
        )}
      </div>
      <p className={`mt-2 font-mono text-2xl font-semibold tabular-nums ${toneClasses[tone]}`}>
        {value}
      </p>
      {delta && <p className="mt-1 text-xs text-muted-foreground">{delta}</p>}
    </Card>
  );
}
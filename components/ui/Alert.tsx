import type { ReactNode } from "react";
import { IconAlertTriangle, IconCheck, IconInfo } from "@/components/ui/icons";

type Variant = "info" | "success" | "warning" | "destructive";

const styles: Record<Variant, string> = {
  info: "border-info/30 bg-info/5 text-foreground",
  success: "border-success/30 bg-success/5 text-foreground",
  warning: "border-warning/30 bg-warning/5 text-foreground",
  destructive: "border-destructive/30 bg-destructive/5 text-foreground",
};

const icons: Record<Variant, typeof IconInfo> = {
  info: IconInfo,
  success: IconCheck,
  warning: IconAlertTriangle,
  destructive: IconAlertTriangle,
};

const iconColors: Record<Variant, string> = {
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
};

interface AlertProps {
  variant?: Variant;
  title?: string;
  children?: ReactNode;
}

export function Alert({ variant = "info", title, children }: AlertProps) {
  const Icon = icons[variant];
  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-lg border p-4 ${styles[variant]}`}
    >
      <Icon className={`mt-0.5 shrink-0 ${iconColors[variant]}`} />
      <div className="flex flex-col gap-1">
        {title && <p className="text-sm font-semibold">{title}</p>}
        {children && <div className="text-sm text-muted-foreground">{children}</div>}
      </div>
    </div>
  );
}
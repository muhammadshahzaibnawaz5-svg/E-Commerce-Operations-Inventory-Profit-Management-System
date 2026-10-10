import { IconCheck } from "@/components/ui/icons";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, max = 100, label, showLabel = true }: ProgressBarProps) {
  const pct = max > 0 ? Math.round(Math.min(Math.max(value, 0), max) / max * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-muted-foreground">
          {label ?? `${pct}%`}
        </span>
      )}
      {pct === 100 && <IconCheck className="text-success" width={16} height={16} />}
    </div>
  );
}
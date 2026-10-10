import type { SyncRun } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { IconCheck, IconClock, IconRefresh } from "@/components/ui/icons";

const stateIcon = {
  queued: IconClock,
  importing: IconRefresh,
  complete: IconCheck,
} as const;

const stateLabel = {
  queued: "Queued",
  importing: "Importing",
  complete: "Complete",
} as const;

export function SyncProgress({ run }: { run: SyncRun }) {
  const done = run.entities.filter((e) => e.state === "complete").length;
  const pct = Math.round((done / run.entities.length) * 100);
  const running = run.status !== "complete";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          {run.status === "connecting"
            ? "Connecting to Shopify…"
            : run.status === "importing"
              ? "Importing data from Shopify…"
              : "Initial sync complete"}
        </p>
        <Badge variant={running ? "info" : "success"}>{pct}%</Badge>
      </div>
      <ProgressBar value={pct} showLabel={false} />
      <ul className="flex flex-col gap-1">
        {run.entities.map((entity) => {
          const Icon = stateIcon[entity.state];
          const label = stateLabel[entity.state];
          return (
            <li
              key={entity.name}
              className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
            >
              <span className="flex items-center gap-2 text-sm text-foreground">
                <Icon
                  width={15}
                  height={15}
                  className={
                    entity.state === "complete"
                      ? "text-success"
                      : entity.state === "importing"
                        ? "animate-spin text-info"
                        : "text-muted-foreground"
                  }
                />
                {entity.name}
              </span>
              <span className="text-xs font-medium text-muted-foreground">{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
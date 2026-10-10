import { IconScale } from "@/components/ui/icons";

export function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <IconScale width={20} height={20} />
      </span>
      <span className="text-sm font-semibold tracking-tight text-foreground">
        Nexveins Ops
      </span>
    </div>
  );
}
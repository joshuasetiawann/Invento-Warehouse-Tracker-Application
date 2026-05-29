import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Tone = "primary" | "success" | "warning" | "danger";

const toneMap: Record<Tone, string> = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: Tone;
}) {
  return (
    <div className="rounded-[var(--radius)] border border-border bg-card p-5 shadow-sm shadow-slate-200/40">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <span
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl",
            toneMap[tone],
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {hint && <p className="mt-3 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

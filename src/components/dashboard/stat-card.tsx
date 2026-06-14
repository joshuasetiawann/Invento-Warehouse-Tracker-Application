import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";

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
  delta,
  deltaUp = true,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: Tone;
  delta?: string;
  deltaUp?: boolean;
}) {
  return (
    <div className="rounded-[var(--radius)] border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            toneMap[tone],
          )}
        >
          <Icon className="h-[1.05rem] w-[1.05rem]" />
        </span>
      </div>
      <p className="mt-3 font-mono text-[1.75rem] font-bold leading-none tracking-tight text-foreground tabular">
        {value}
      </p>
      <div className="mt-2 flex items-center gap-1.5">
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-mono text-xs font-semibold",
              deltaUp ? "text-success" : "text-danger",
            )}
          >
            {deltaUp ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {delta}
          </span>
        )}
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import type { StockStatus } from "@/types/database";

type Tone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "primary"
  | "withdrawn";

const tones: Record<Tone, string> = {
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  neutral: "bg-neutral-status-soft text-neutral-status",
  primary: "bg-primary-soft text-primary",
  withdrawn: "bg-withdrawn-soft text-withdrawn",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        // pill, 12px semibold, no icon inside (per design system)
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const stockMeta: Record<StockStatus, { tone: Tone; label: string }> = {
  in_stock: { tone: "success", label: "Tersedia" },
  low_stock: { tone: "warning", label: "Menipis" },
  out_of_stock: { tone: "danger", label: "Habis" },
};

export function StockBadge({ status }: { status: StockStatus }) {
  const meta = stockMeta[status];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}

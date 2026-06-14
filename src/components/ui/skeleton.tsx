import { cn } from "@/lib/utils";

/**
 * Shimmering placeholder block. Compose these to build loading skeletons
 * that mirror the real content layout.
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("skeleton", className)} {...props} />;
}

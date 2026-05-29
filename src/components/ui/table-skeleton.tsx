import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function TableSkeleton({
  rows = 6,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 sm:w-56" />
        <Skeleton className="h-10 w-36" />
      </div>
      <Card className="overflow-hidden">
        <div className="border-b border-border bg-muted/40 px-5 py-3">
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: rows }).map((_, r) => (
            <div key={r} className="flex items-center gap-4 px-5 py-4">
              <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/5" />
              </div>
              {Array.from({ length: cols - 1 }).map((_, c) => (
                <Skeleton key={c} className="hidden h-4 w-20 sm:block" />
              ))}
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

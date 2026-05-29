import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export default function MovementsLoading() {
  return (
    <div>
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-72" />
      </div>
      <TableSkeleton rows={6} cols={5} />
    </div>
  );
}

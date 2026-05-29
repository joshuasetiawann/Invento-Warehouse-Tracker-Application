import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function LocationsLoading() {
  return (
    <div>
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="mb-4 flex justify-end">
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-start justify-between">
              <Skeleton className="h-11 w-11 rounded-xl" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="mt-4 h-5 w-32" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-3 h-3 w-20" />
          </Card>
        ))}
      </div>
    </div>
  );
}

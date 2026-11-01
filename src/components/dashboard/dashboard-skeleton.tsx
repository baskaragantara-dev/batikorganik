import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Memuat ringkasan" className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-64" />
      </div>
      <Skeleton className="h-20" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-56 rounded-card" />
        <Skeleton className="h-56 rounded-card" />
      </div>
      <Skeleton className="h-52 rounded-card" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
    </div>
  );
}

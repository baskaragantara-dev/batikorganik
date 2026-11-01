import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Memuat ringkasan" className="flex flex-col gap-6 lg:gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-12 w-full max-w-xl" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-3 lg:col-span-8">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-44 rounded-card" />
          <Skeleton className="h-44 rounded-card" />
        </div>
        <div className="order-first flex flex-col gap-3 lg:order-none lg:col-span-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-56 rounded-card" />
        </div>
      </div>
    </div>
  );
}

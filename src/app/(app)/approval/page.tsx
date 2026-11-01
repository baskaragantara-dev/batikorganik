import { Suspense } from "react";
import { ApprovalQueue } from "@/components/approvals/approval-queue";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardData } from "@/data/dashboard-repository";
import { parseDemoMode } from "@/data/demo-mode";

export const metadata = { title: "Approval" };

export default function ApprovalPage({ searchParams }: PageProps<"/approval">) {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-4xl font-normal lg:text-5xl">Approval</h1>
        <p className="text-sm text-ink-muted">Draft dari agent yang menunggu keputusan, urut dari risiko tertinggi.</p>
      </header>
      <Suspense fallback={<QueueSkeleton />}>
        <Queue searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Queue({ searchParams }: Pick<PageProps<"/approval">, "searchParams">) {
  const mode = parseDemoMode((await searchParams).demo);
  const data = await getDashboardData(mode);
  return (
    <ApprovalQueue
      approvals={data.approvals}
      members={data.members}
      currentMember={data.currentMember}
      now={data.now}
      simulateFailure={mode === "action-error"}
    />
  );
}

function QueueSkeleton() {
  return (
    <div role="status" aria-label="Memuat antrean" className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Skeleton className="h-11 w-32 rounded-full" />
        <Skeleton className="h-11 w-32 rounded-full" />
        <Skeleton className="h-11 w-28 rounded-full" />
      </div>
      <Skeleton className="h-60 rounded-card" />
      <Skeleton className="h-60 rounded-card" />
    </div>
  );
}

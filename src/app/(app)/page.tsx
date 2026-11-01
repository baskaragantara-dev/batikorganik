import { Suspense } from "react";
import { DecisionSection } from "@/components/approvals/decision-section";
import { AlertList } from "@/components/dashboard/alert-list";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { PerformanceSection } from "@/components/dashboard/performance-section";
import { getDashboardData } from "@/data/dashboard-repository";
import { parseDemoMode } from "@/data/demo-mode";
import { formatLongDate, greetingFor } from "@/lib/format";

export const metadata = { title: "Ringkasan" };

export default function RingkasanPage({ searchParams }: PageProps<"/">) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Ringkasan searchParams={searchParams} />
    </Suspense>
  );
}

async function Ringkasan({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const mode = parseDemoMode((await searchParams).demo);
  const data = await getDashboardData(mode);
  const now = new Date(data.now);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-ink-muted">{formatLongDate(now)} · data contoh</p>
        <h1 className="max-w-xl text-[2rem] leading-[1.15] font-medium tracking-tight lg:text-5xl">
          {greetingFor(now)}, {data.currentMember.name}.{" "}
          <span className="text-ink-muted">Ini yang terjadi di Batik Organik.</span>
        </h1>
      </header>

      <AlertList alerts={data.alerts} />

      <DecisionSection
        approvals={data.approvals}
        members={data.members}
        currentMember={data.currentMember}
        now={data.now}
        simulateFailure={mode === "action-error"}
      />

      <PerformanceSection kpis={data.kpis} trend={data.trend} />
    </div>
  );
}

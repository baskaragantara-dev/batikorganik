import { Suspense } from "react";
import { DecisionSection } from "@/components/approvals/decision-section";
import { AlertList } from "@/components/dashboard/alert-list";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { DashboardBoard } from "@/components/dashboard/dashboard-board";
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
    <DashboardBoard
      kpis={data.kpis}
      trend={data.trend}
      greeting={
        <header className="flex flex-col gap-1">
          <p className="text-sm text-ink-muted">{formatLongDate(now)} · data contoh</p>
          <h1 className="max-w-2xl text-[2rem] leading-[1.15] font-medium tracking-tight lg:text-[2.75rem]">
            {greetingFor(now)}, {data.currentMember.name}.{" "}
            <span className="text-ink-muted">Ini yang terjadi di Batik Organik.</span>
          </h1>
        </header>
      }
      alerts={<AlertList alerts={data.alerts} />}
      decisions={
        <DecisionSection
          approvals={data.approvals}
          members={data.members}
          currentMember={data.currentMember}
          now={data.now}
          simulateFailure={mode === "action-error"}
        />
      }
    />
  );
}

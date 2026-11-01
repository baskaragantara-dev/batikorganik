"use client";

import Link from "next/link";
import { useState, type ComponentType, type ReactNode, type SVGProps } from "react";
import {
  PERIODS,
  PERIOD_LABEL,
  cplStatus,
  spendRatio,
  type DashboardKpis,
  type Period,
  type TrendPoint,
} from "@/domain/dashboard/types";
import { formatIdr, formatIdrCompact } from "@/lib/format";
import { Chip } from "@/components/ui/chip";
import { ArrowUpRightIcon, BagIcon, TargetIcon, UsersIcon, WalletIcon } from "@/components/ui/icons";
import { TrendChart } from "./trend-chart";

type TileTone = "surface" | "mint" | "butter" | "sky";
const TILE_BG: Record<TileTone, string> = {
  surface: "bg-surface",
  mint: "bg-mint",
  butter: "bg-butter",
  sky: "bg-sky",
};

function Tile({
  href,
  tone,
  icon: Icon,
  label,
  value,
  children,
}: {
  href: string;
  tone: TileTone;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  children?: ReactNode;
}) {
  return (
    <Link href={href} className={`group flex flex-col gap-3 rounded-tile p-4 ${TILE_BG[tone]}`}>
      <span className="flex items-start justify-between">
        <span className="grid size-9 place-items-center rounded-full bg-ink text-surface">
          <Icon width={18} height={18} />
        </span>
        <ArrowUpRightIcon width={18} height={18} className="text-ink-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-[1.65rem] leading-none font-medium tabular-nums">{value}</span>
        <span className="text-sm text-ink-soft">{label}</span>
      </span>
      {children}
    </Link>
  );
}

/** DSH-02: four headline numbers per period plus a leads trend. No detail tables here. */
export function PerformanceSection({
  kpis,
  trend,
}: {
  kpis: Record<Period, DashboardKpis>;
  trend: Record<Period, TrendPoint[]>;
}) {
  const [period, setPeriod] = useState<Period>("month");
  const k = kpis[period];
  const ratio = spendRatio(k.spendIdr, k.budgetIdr);
  const cpl = cplStatus(k.cplIdr, k.cplLimitIdr);
  const delta = k.leads - k.leadsPrev;

  return (
    <section aria-labelledby="performa" className="flex flex-col gap-4">
      <h2 id="performa" className="text-2xl font-medium">
        Performa
      </h2>
      <div role="group" aria-label="Pilih periode" className="flex gap-2 overflow-x-auto">
        {PERIODS.map((p) => (
          <button
            key={p}
            type="button"
            aria-pressed={period === p}
            onClick={() => setPeriod(p)}
            className={`min-h-10 shrink-0 rounded-full border px-4 text-sm font-semibold ${
              period === p ? "border-ink bg-ink text-surface" : "border-hairline bg-surface text-ink-soft"
            }`}
          >
            {PERIOD_LABEL[p]}
          </button>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="flex flex-col gap-2 rounded-card bg-sky p-5">
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-semibold">Leads masuk</p>
            <p className="text-sm text-ink-soft">
              {delta >= 0 ? `+${delta}` : delta} dari periode lalu
            </p>
          </div>
          <TrendChart
            data={trend[period]}
            caption={`Grafik leads ${PERIOD_LABEL[period].toLowerCase()}, total ${k.leads}.`}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Tile href="/leads" tone="mint" icon={UsersIcon} label="Leads" value={String(k.leads)} />
          <Tile href="/tracking" tone="butter" icon={TargetIcon} label="Biaya per lead" value={formatIdrCompact(k.cplIdr)}>
            <span className="flex flex-wrap items-center gap-1.5 text-xs text-ink-soft">
              <Chip tone={cpl === "under" ? "success" : cpl === "near" ? "neutral" : "danger"}>
                {cpl === "under" ? "Aman" : cpl === "near" ? "Mendekati batas" : "Lewat batas"}
              </Chip>
              maks {formatIdr(k.cplLimitIdr)}
            </span>
          </Tile>
          <Tile href="/campaign" tone="surface" icon={WalletIcon} label="Spend iklan" value={formatIdrCompact(k.spendIdr)}>
            <span className="flex flex-col gap-1.5">
              <span
                className="h-1.5 overflow-hidden rounded-full bg-surface-deep"
                role="meter"
                aria-label="Pemakaian budget"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(ratio * 100)}
              >
                <span className="block h-full rounded-full bg-ink" style={{ width: `${ratio * 100}%` }} />
              </span>
              <span className="text-xs text-ink-soft">
                {Math.round(ratio * 100)}% dari {formatIdrCompact(k.budgetIdr)}
              </span>
            </span>
          </Tile>
          <Tile href="/tracking" tone="surface" icon={BagIcon} label="Order dari iklan" value={String(k.ordersFromAds)}>
            <span className="text-xs text-ink-soft">Omzet {formatIdrCompact(k.revenueFromAdsIdr)}</span>
          </Tile>
        </div>
      </div>
    </section>
  );
}

import type { ComponentType, ReactNode, SVGProps } from "react";
import { cplStatus, spendRatio, type DashboardKpis } from "@/domain/dashboard/types";
import { formatIdr, formatIdrCompact } from "@/lib/format";
import { BagIcon, TargetIcon, UsersIcon, WalletIcon } from "@/components/ui/icons";
import { Chip } from "@/components/ui/chip";

function Tile({
  icon: Icon,
  label,
  value,
  children,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-tile bg-surface p-4">
      <dt className="flex items-center gap-2 text-xs font-bold text-ink-muted">
        <span className="grid size-7 place-items-center rounded-full bg-indigo-quiet text-indigo-deep">
          <Icon width={16} height={16} />
        </span>
        {label}
      </dt>
      <dd className="flex flex-col gap-1.5">
        <span className="font-display text-[1.75rem] leading-none font-medium tabular-nums">{value}</span>
        {children}
      </dd>
    </div>
  );
}

/** DSH-02: exactly four numbers, no detail tables on the summary screen. */
export function KpiGrid({ kpis }: { kpis: DashboardKpis }) {
  const ratio = spendRatio(kpis.spendIdr, kpis.budgetIdr);
  const cpl = cplStatus(kpis.cplIdr, kpis.cplLimitIdr);
  const leadDelta = kpis.leadsThisWeek - kpis.leadsLastWeek;

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Tile icon={WalletIcon} label="Spend bulan ini" value={formatIdrCompact(kpis.spendIdr)}>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-surface-deep"
          role="meter"
          aria-label="Pemakaian budget"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(ratio * 100)}
        >
          <div className="h-full rounded-full bg-soga" style={{ width: `${ratio * 100}%` }} />
        </div>
        <span className="text-xs text-ink-muted">
          {Math.round(ratio * 100)}% dari {formatIdrCompact(kpis.budgetIdr)}
        </span>
      </Tile>
      <Tile icon={UsersIcon} label="Leads minggu ini" value={String(kpis.leadsThisWeek)}>
        <span className="text-xs text-ink-muted">
          {leadDelta >= 0 ? `+${leadDelta}` : leadDelta} dari minggu lalu
        </span>
      </Tile>
      <Tile icon={TargetIcon} label="Biaya per lead" value={formatIdrCompact(kpis.cplIdr)}>
        <span className="flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
          <Chip tone={cpl === "under" ? "success" : cpl === "near" ? "warning" : "danger"}>
            {cpl === "under" ? "Aman" : cpl === "near" ? "Mendekati batas" : "Lewat batas"}
          </Chip>
          batas {formatIdr(kpis.cplLimitIdr)}
        </span>
      </Tile>
      <Tile icon={BagIcon} label="Order dari iklan" value={String(kpis.ordersFromAds)}>
        <span className="text-xs text-ink-muted">Omzet {formatIdrCompact(kpis.revenueFromAdsIdr)}</span>
      </Tile>
    </dl>
  );
}

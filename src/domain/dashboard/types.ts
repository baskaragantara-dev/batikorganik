/** DSH-02: the four headline numbers. All money in integer rupiah. */
export interface DashboardKpis {
  spendIdr: number;
  budgetIdr: number;
  leadsThisWeek: number;
  leadsLastWeek: number;
  cplIdr: number;
  cplLimitIdr: number;
  ordersFromAds: number;
  revenueFromAdsIdr: number;
}

/** DSH-03: alerts disappear once the underlying problem is resolved. */
export type AlertKind = "tracking_down" | "lead_unclaimed" | "quota_near_limit";

export interface DashboardAlert {
  id: string;
  kind: AlertKind;
  severity: "critical" | "warning";
  title: string;
  detail: string;
  href: string;
}

export type CplStatus = "under" | "near" | "over";

/** CPL within 90% of the limit is "near" so the owner can act before overspending. */
export function cplStatus(cplIdr: number, limitIdr: number): CplStatus {
  if (limitIdr <= 0) return "over";
  const ratio = cplIdr / limitIdr;
  if (ratio > 1) return "over";
  if (ratio >= 0.9) return "near";
  return "under";
}

export function spendRatio(spendIdr: number, budgetIdr: number): number {
  if (budgetIdr <= 0) return 0;
  return Math.min(spendIdr / budgetIdr, 1);
}

export const PERIODS = ["today", "week", "month"] as const;
export type Period = (typeof PERIODS)[number];

export const PERIOD_LABEL: Record<Period, string> = {
  today: "Hari ini",
  week: "Minggu ini",
  month: "Bulan ini",
};

/** DSH-02: the four headline numbers for one period. All money in integer rupiah. */
export interface DashboardKpis {
  spendIdr: number;
  budgetIdr: number;
  leads: number;
  /** Leads in the previous period of the same length, for the delta. */
  leadsPrev: number;
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

/** One point of the leads vs orders trend shown on the summary chart. */
export interface TrendPoint {
  label: string;
  leads: number;
  orders: number;
}

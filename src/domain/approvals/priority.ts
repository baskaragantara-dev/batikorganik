import type { ApprovalItem, RiskLevel } from "./types";

const RISK_WEIGHT: Record<RiskLevel, number> = { high: 3, medium: 2, low: 1 };

/** DSH-01: pending items sorted by risk (high first), then nearest deadline, then oldest. */
export function compareByPriority(a: ApprovalItem, b: ApprovalItem): number {
  const risk = RISK_WEIGHT[b.risk] - RISK_WEIGHT[a.risk];
  if (risk !== 0) return risk;
  const deadline = Date.parse(a.deadline) - Date.parse(b.deadline);
  if (deadline !== 0) return deadline;
  return Date.parse(a.createdAt) - Date.parse(b.createdAt);
}

export function pendingByPriority(items: readonly ApprovalItem[]): ApprovalItem[] {
  return items.filter((i) => i.status === "pending").sort(compareByPriority);
}

export const DASHBOARD_DECISION_LIMIT = 5;

export function topDecisions(
  items: readonly ApprovalItem[],
  limit: number = DASHBOARD_DECISION_LIMIT,
): ApprovalItem[] {
  return pendingByPriority(items).slice(0, limit);
}

export function countByStatus(items: readonly ApprovalItem[]) {
  return items.reduce(
    (acc, i) => {
      acc[i.status] += 1;
      return acc;
    },
    { pending: 0, approved: 0, rejected: 0 },
  );
}

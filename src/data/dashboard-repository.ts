import "server-only";
import type { ApprovalItem, Member } from "@/domain/approvals/types";
import type { DashboardAlert, DashboardKpis } from "@/domain/dashboard/types";
import { ALERTS, APPROVALS, CURRENT_MEMBER_ID, KPIS, MEMBERS, MOCK_NOW } from "./mock/seed";
import type { DemoMode } from "./demo-mode";

export interface DashboardData {
  now: string;
  currentMember: Member;
  members: Member[];
  approvals: ApprovalItem[];
  kpis: DashboardKpis;
  alerts: DashboardAlert[];
}

export class DataUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DataUnavailableError";
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock implementation. The Supabase version will keep this signature and
 * read through RLS-protected views scoped to the member's org.
 */
export async function getDashboardData(mode: DemoMode): Promise<DashboardData> {
  await delay(mode === "slow" ? 2500 : 350);

  if (mode === "error") {
    throw new DataUnavailableError("Mock data source is unavailable (demo=error).");
  }

  const currentMember = MEMBERS.find((m) => m.id === CURRENT_MEMBER_ID);
  if (!currentMember) throw new DataUnavailableError("Current member not found in seed.");

  const empty = mode === "empty";
  return {
    now: MOCK_NOW.toISOString(),
    currentMember,
    members: MEMBERS,
    approvals: empty ? APPROVALS.filter((a) => a.status !== "pending") : APPROVALS,
    kpis: KPIS,
    alerts: empty ? [] : ALERTS,
  };
}

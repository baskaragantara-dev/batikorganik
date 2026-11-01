import { z } from "zod";
import type { ApprovalItem, ApprovalKind, Member, Role } from "./types";

/**
 * Who may approve which kind of request (PRD section 4, permission matrix).
 * Kept as data so the same table can later be mirrored by role_permissions + RLS.
 */
const APPROVER_ROLES: Record<ApprovalKind, readonly Role[]> = {
  campaign: ["owner", "full_access"],
  budget: ["owner", "full_access"],
  ad: ["owner", "full_access", "marketing_lead"],
  content: ["owner", "full_access", "marketing_lead"],
  lead_reply: ["owner", "full_access", "marketing_lead", "sales_cs"],
};

export function roleCanApprove(role: Role, kind: ApprovalKind): boolean {
  return APPROVER_ROLES[kind].includes(role);
}

export type DecideCheck =
  | { allowed: true; selfApproved: boolean }
  | { allowed: false; reason: string };

/**
 * APR-07: a requester cannot approve their own request,
 * unless they are the only member allowed to approve that kind.
 */
export function checkCanDecide(
  item: Pick<ApprovalItem, "kind" | "requestedBy" | "status">,
  actor: Member,
  members: readonly Member[],
): DecideCheck {
  if (item.status !== "pending") {
    return { allowed: false, reason: "Permintaan ini sudah diputuskan." };
  }
  if (!roleCanApprove(actor.role, item.kind)) {
    return {
      allowed: false,
      reason: "Peran Anda tidak bisa menyetujui jenis permintaan ini.",
    };
  }
  const isOwnRequest = item.requestedBy.id === actor.id;
  if (!isOwnRequest) return { allowed: true, selfApproved: false };

  const approverCount = members.filter((m) =>
    roleCanApprove(m.role, item.kind),
  ).length;
  if (approverCount <= 1) return { allowed: true, selfApproved: true };

  return {
    allowed: false,
    reason: "Anda pembuat permintaan ini. Penyetuju lain yang memutuskan.",
  };
}

/** APR-04: rejection needs a reason of at least 5 characters, sent back to the agent. */
export const rejectReasonSchema = z
  .string()
  .trim()
  .min(5, "Tulis alasan minimal 5 karakter agar agent bisa merevisi.")
  .max(500, "Alasan maksimal 500 karakter.");

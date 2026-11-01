/**
 * Approval domain types (PRD section 7, APR-01..07).
 * Money is stored as integer rupiah, never floats (PRD section 10).
 */

export const ROLES = [
  "owner",
  "full_access",
  "marketing_lead",
  "content_creator",
  "sales_cs",
  "viewer",
] as const;
export type Role = (typeof ROLES)[number];

export const APPROVAL_KINDS = [
  "campaign",
  "budget",
  "ad",
  "content",
  "lead_reply",
] as const;
export type ApprovalKind = (typeof APPROVAL_KINDS)[number];

export type RiskLevel = "high" | "medium" | "low";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type ComplianceLevel = "ok" | "warning" | "blocker";

export interface Member {
  id: string;
  name: string;
  role: Role;
}

export interface ComplianceNote {
  level: ComplianceLevel;
  text: string;
}

export interface ApprovalItem {
  id: string;
  kind: ApprovalKind;
  title: string;
  summary: string;
  /** Name of the AI agent that produced the draft, e.g. "Campaign Strategist". */
  agent: string;
  /** Member who triggered the agent run; used for the self-approval rule (APR-07). */
  requestedBy: Member;
  risk: RiskLevel;
  /** 0..100, from Brand Manager agent. */
  brandFit: number;
  compliance: ComplianceNote;
  /** ISO timestamp. */
  deadline: string;
  /** ISO timestamp. */
  createdAt: string;
  amountIdr?: number;
  markets?: string[];
  status: ApprovalStatus;
  decidedAt?: string;
  decisionReason?: string;
}

export type Decision = "approved" | "rejected";

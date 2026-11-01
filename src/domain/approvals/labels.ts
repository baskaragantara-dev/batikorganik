import type { ApprovalKind, RiskLevel } from "./types";

export const KIND_LABEL: Record<ApprovalKind, string> = {
  campaign: "Campaign",
  budget: "Perubahan budget",
  ad: "Ads",
  content: "Konten",
  lead_reply: "Balasan lead",
};

export const RISK_LABEL: Record<RiskLevel, string> = {
  high: "Risiko tinggi",
  medium: "Risiko sedang",
  low: "Risiko rendah",
};

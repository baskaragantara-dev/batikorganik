import { describe, expect, it } from "vitest";
import { checkCanDecide, rejectReasonSchema, roleCanApprove } from "./policy";
import type { Member } from "./types";

const owner: Member = { id: "u1", name: "Owner", role: "owner" };
const lead: Member = { id: "u2", name: "Lead", role: "marketing_lead" };
const cs: Member = { id: "u3", name: "CS", role: "sales_cs" };

describe("roleCanApprove (PRD permission matrix)", () => {
  it("only owner and full access approve campaigns and budgets", () => {
    expect(roleCanApprove("owner", "campaign")).toBe(true);
    expect(roleCanApprove("full_access", "budget")).toBe(true);
    expect(roleCanApprove("marketing_lead", "campaign")).toBe(false);
    expect(roleCanApprove("marketing_lead", "budget")).toBe(false);
  });

  it("marketing lead approves ads and content, sales/cs approves lead replies", () => {
    expect(roleCanApprove("marketing_lead", "ad")).toBe(true);
    expect(roleCanApprove("marketing_lead", "content")).toBe(true);
    expect(roleCanApprove("sales_cs", "lead_reply")).toBe(true);
    expect(roleCanApprove("sales_cs", "ad")).toBe(false);
    expect(roleCanApprove("viewer", "lead_reply")).toBe(false);
    expect(roleCanApprove("content_creator", "content")).toBe(false);
  });
});

describe("checkCanDecide (APR-07)", () => {
  const members = [owner, lead, cs];

  it("allows an approver to decide someone else's request", () => {
    const res = checkCanDecide({ kind: "ad", requestedBy: lead, status: "pending" }, owner, members);
    expect(res).toEqual({ allowed: true, selfApproved: false });
  });

  it("blocks self-approval when another approver exists", () => {
    const res = checkCanDecide({ kind: "ad", requestedBy: lead, status: "pending" }, lead, members);
    expect(res.allowed).toBe(false);
  });

  it("allows self-approval when the actor is the only approver, flagged self_approved", () => {
    const res = checkCanDecide({ kind: "campaign", requestedBy: owner, status: "pending" }, owner, members);
    expect(res).toEqual({ allowed: true, selfApproved: true });
  });

  it("blocks roles outside the matrix", () => {
    const res = checkCanDecide({ kind: "campaign", requestedBy: owner, status: "pending" }, cs, members);
    expect(res.allowed).toBe(false);
  });

  it("blocks decisions on items that are no longer pending", () => {
    const res = checkCanDecide({ kind: "ad", requestedBy: lead, status: "approved" }, owner, members);
    expect(res.allowed).toBe(false);
  });
});

describe("rejectReasonSchema (APR-04)", () => {
  it("requires at least 5 non-space characters", () => {
    expect(rejectReasonSchema.safeParse("   abc  ").success).toBe(false);
    expect(rejectReasonSchema.safeParse("Klaim belum ada bukti").success).toBe(true);
  });

  it("trims the reason", () => {
    expect(rejectReasonSchema.parse("  Ganti hook  ")).toBe("Ganti hook");
  });
});

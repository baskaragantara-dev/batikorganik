import { describe, expect, it } from "vitest";
import { countByStatus, pendingByPriority, topDecisions } from "./priority";
import type { ApprovalItem } from "./types";

const base: ApprovalItem = {
  id: "x",
  kind: "ad",
  title: "t",
  summary: "s",
  agent: "a",
  requestedBy: { id: "u", name: "U", role: "owner" },
  risk: "low",
  brandFit: 80,
  compliance: { level: "ok", text: "" },
  deadline: "2026-11-02T00:00:00Z",
  createdAt: "2026-11-01T00:00:00Z",
  status: "pending",
};
const make = (o: Partial<ApprovalItem>): ApprovalItem => ({ ...base, ...o });

describe("pendingByPriority (DSH-01)", () => {
  it("orders by risk, then nearest deadline, then oldest request", () => {
    const items = [
      make({ id: "low-soon", risk: "low", deadline: "2026-11-01T01:00:00Z" }),
      make({ id: "high-late", risk: "high", deadline: "2026-11-05T00:00:00Z" }),
      make({ id: "high-soon", risk: "high", deadline: "2026-11-01T05:00:00Z" }),
      make({ id: "med-old", risk: "medium", createdAt: "2026-10-20T00:00:00Z" }),
      make({ id: "med-new", risk: "medium", createdAt: "2026-10-30T00:00:00Z" }),
    ];
    expect(pendingByPriority(items).map((i) => i.id)).toEqual([
      "high-soon",
      "high-late",
      "med-old",
      "med-new",
      "low-soon",
    ]);
  });

  it("excludes decided items", () => {
    const items = [make({ id: "a" }), make({ id: "b", status: "approved" })];
    expect(pendingByPriority(items).map((i) => i.id)).toEqual(["a"]);
  });
});

describe("topDecisions", () => {
  it("caps the dashboard card at 5 items", () => {
    const items = Array.from({ length: 8 }, (_, n) => make({ id: `i${n}` }));
    expect(topDecisions(items)).toHaveLength(5);
  });
});

describe("countByStatus (APR-01 tab counts)", () => {
  it("counts each status", () => {
    const items = [make({}), make({ status: "approved" }), make({ status: "rejected" }), make({})];
    expect(countByStatus(items)).toEqual({ pending: 2, approved: 1, rejected: 1 });
  });
});

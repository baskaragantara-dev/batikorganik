import { describe, expect, it } from "vitest";
import { describeDeadline, formatIdr, formatIdrCompact, greetingFor } from "./format";
import { cplStatus, spendRatio } from "@/domain/dashboard/types";

const now = new Date("2026-11-01T09:00:00+07:00");

describe("formatIdr", () => {
  it("formats integer rupiah with dot separators", () => {
    expect(formatIdr(4_500_000)).toBe("Rp4.500.000");
  });
  it("compacts large amounts", () => {
    expect(formatIdrCompact(2_840_000)).toBe("Rp2,8 jt");
    expect(formatIdrCompact(450_000)).toBe("Rp450 rb");
    expect(formatIdrCompact(1_200_000_000)).toBe("Rp1,2 M");
    expect(formatIdrCompact(900)).toBe("Rp900");
  });
});

describe("describeDeadline (WIB)", () => {
  it("marks past deadlines as overdue", () => {
    const r = describeDeadline("2026-11-01T06:00:00+07:00", now);
    expect(r).toMatchObject({ text: "Lewat 3 jam", overdue: true });
  });
  it("shows today with time", () => {
    const r = describeDeadline("2026-11-01T17:00:00+07:00", now);
    expect(r.dueToday).toBe(true);
    expect(r.text).toBe("Hari ini 17.00");
  });
  it("shows tomorrow", () => {
    expect(describeDeadline("2026-11-02T11:00:00+07:00", now).text).toBe("Besok 11.00");
  });
  it("shows days for later deadlines", () => {
    expect(describeDeadline("2026-11-04T09:00:00+07:00", now).text).toBe("3 hari lagi");
  });
});

describe("greetingFor", () => {
  it("uses WIB time of day", () => {
    expect(greetingFor(now)).toBe("Selamat pagi");
    expect(greetingFor(new Date("2026-11-01T19:00:00+07:00"))).toBe("Selamat malam");
  });
});

describe("dashboard KPI helpers", () => {
  it("classifies CPL against its limit", () => {
    expect(cplStatus(20_000, 25_000)).toBe("under");
    expect(cplStatus(22_800, 25_000)).toBe("near");
    expect(cplStatus(26_000, 25_000)).toBe("over");
  });
  it("caps spend ratio at 1", () => {
    expect(spendRatio(5, 4)).toBe(1);
    expect(spendRatio(1, 0)).toBe(0);
  });
});

import type { ApprovalItem, Member } from "@/domain/approvals/types";
import type { DashboardAlert, DashboardKpis, Period, TrendPoint } from "@/domain/dashboard/types";

/**
 * Sample data for the R0 prototype. All figures are examples, not Batik Organik's real numbers.
 * A fixed "now" keeps server and client renders identical and makes demos repeatable.
 */
export const MOCK_NOW = new Date("2026-11-01T09:00:00+07:00");

const at = (hoursFromNow: number) =>
  new Date(MOCK_NOW.getTime() + hoursFromNow * 3_600_000).toISOString();

export const MEMBERS: Member[] = [
  { id: "u-baskara", name: "Baskara", role: "owner" },
  { id: "u-ana", name: "Ana", role: "full_access" },
  { id: "u-rina", name: "Rina", role: "full_access" },
  { id: "u-dimas", name: "Dimas", role: "full_access" },
];

export const CURRENT_MEMBER_ID = "u-baskara";

const [baskara, ana, rina, dimas] = MEMBERS as [Member, Member, Member, Member];

export const APPROVALS: ApprovalItem[] = [
  {
    id: "apr-101",
    kind: "campaign",
    title: "Seragam kantor untuk perusahaan Jepang",
    summary:
      "Offer: kain batik pewarna alam untuk seragam, minimum 50 potong. Target 30 lead B2B dalam 3 minggu di Jepang lewat Meta dan LinkedIn.",
    agent: "Campaign Strategist",
    requestedBy: ana,
    risk: "high",
    brandFit: 88,
    compliance: {
      level: "warning",
      text: "Klaim \"100% organik\" belum didukung sertifikat di Brand Hub. Ganti menjadi \"pewarna alami\" atau unggah sertifikat.",
    },
    deadline: at(8),
    createdAt: at(-20),
    amountIdr: 4_500_000,
    markets: ["JP"],
    status: "pending",
  },
  {
    id: "apr-102",
    kind: "budget",
    title: "Naikkan budget harian Ads Reels Motif Kawung",
    summary:
      "CPL Rp18.500, di bawah batas Rp25.000. Performance Analyst mengusulkan budget harian naik dari Rp150.000 ke Rp225.000 selama 7 hari.",
    agent: "Performance Analyst",
    requestedBy: rina,
    risk: "medium",
    brandFit: 92,
    compliance: { level: "ok", text: "Tidak ada catatan." },
    deadline: at(4),
    createdAt: at(-6),
    amountIdr: 525_000,
    markets: ["ID"],
    status: "pending",
  },
  {
    id: "apr-103",
    kind: "ad",
    title: "3 varian ads Carousel Kain Tenun Indigo",
    summary:
      "Hook: \"Biru yang datang dari daun, bukan pabrik.\" Tujuan klik ke WA dengan kode BO-IND-07. Bahasa Indonesia dan Inggris.",
    agent: "Script Writer",
    requestedBy: dimas,
    risk: "medium",
    brandFit: 81,
    compliance: { level: "ok", text: "Label konten AI sudah terpasang di varian gambar." },
    deadline: at(26),
    createdAt: at(-3),
    markets: ["ID", "SG"],
    status: "pending",
  },
  {
    id: "apr-104",
    kind: "lead_reply",
    title: "Balasan untuk lead hotel di Bali (skor 82)",
    summary:
      "Draft balasan menawarkan sampel kain 3 motif dan jadwal panggilan video hari Senin. Lead masuk dari ads BO-HTL-02.",
    agent: "Lead Qualifier",
    requestedBy: rina,
    risk: "low",
    brandFit: 90,
    compliance: { level: "ok", text: "Tidak ada catatan." },
    deadline: at(1),
    createdAt: at(-1),
    status: "pending",
  },
  {
    id: "apr-105",
    kind: "content",
    title: "Video proses celup indigo, 4 varian durasi",
    summary:
      "Varian 15, 30, 45, dan 60 detik dari aset master syuting 28 Oktober. Subtitle Indonesia dan Inggris.",
    agent: "Editor/QA",
    requestedBy: baskara,
    risk: "low",
    brandFit: 95,
    compliance: { level: "ok", text: "Izin pakai wajah perajin sudah ada di Brand Hub." },
    deadline: at(50),
    createdAt: at(-30),
    status: "pending",
  },
  {
    id: "apr-106",
    kind: "ad",
    title: "Ads Story promo Harbolnas 11.11",
    summary:
      "Diskon 11% untuk kain motif Parang. Compliance Guard menandai klaim harga coret yang belum punya bukti harga normal.",
    agent: "Media Buyer",
    requestedBy: ana,
    risk: "high",
    brandFit: 64,
    compliance: {
      level: "blocker",
      text: "Harga coret Rp850.000 belum punya bukti harga normal 30 hari terakhir. Berisiko ditolak Meta dan melanggar aturan promosi.",
    },
    deadline: at(30),
    createdAt: at(-10),
    amountIdr: 1_200_000,
    markets: ["ID"],
    status: "pending",
  },
  {
    id: "apr-090",
    kind: "content",
    title: "Foto katalog 12 SKU kain Sogan",
    summary: "Foto latar krem, rasio 4:5 dan 1:1.",
    agent: "Content Planner",
    requestedBy: dimas,
    risk: "low",
    brandFit: 93,
    compliance: { level: "ok", text: "Tidak ada catatan." },
    deadline: at(-20),
    createdAt: at(-48),
    status: "approved",
    decidedAt: at(-22),
  },
  {
    id: "apr-091",
    kind: "ad",
    title: "Ads video testimoni butik Yogyakarta",
    summary: "Testimoni pemilik butik, 30 detik.",
    agent: "Script Writer",
    requestedBy: rina,
    risk: "medium",
    brandFit: 70,
    compliance: { level: "warning", text: "Izin pakai wajah belum diunggah." },
    deadline: at(-12),
    createdAt: at(-40),
    status: "rejected",
    decidedAt: at(-15),
    decisionReason: "Tunggu izin pakai wajah dari pemilik butik dulu.",
  },
];

export const KPIS: Record<Period, DashboardKpis> = {
  today: {
    spendIdr: 152_000,
    budgetIdr: 155_000,
    leads: 9,
    leadsPrev: 6,
    cplIdr: 16_900,
    cplLimitIdr: 25_000,
    ordersFromAds: 1,
    revenueFromAdsIdr: 1_450_000,
  },
  week: {
    spendIdr: 1_020_000,
    budgetIdr: 1_085_000,
    leads: 47,
    leadsPrev: 38,
    cplIdr: 21_700,
    cplLimitIdr: 25_000,
    ordersFromAds: 3,
    revenueFromAdsIdr: 4_200_000,
  },
  month: {
    spendIdr: 2_840_000,
    budgetIdr: 4_600_000,
    leads: 131,
    leadsPrev: 104,
    cplIdr: 22_800,
    cplLimitIdr: 25_000,
    ordersFromAds: 6,
    revenueFromAdsIdr: 9_350_000,
  },
};

export const TREND: Record<Period, TrendPoint[]> = {
  today: [
    { label: "06", leads: 0, orders: 0 },
    { label: "09", leads: 2, orders: 0 },
    { label: "12", leads: 3, orders: 1 },
    { label: "15", leads: 1, orders: 0 },
    { label: "18", leads: 2, orders: 0 },
    { label: "21", leads: 1, orders: 0 },
  ],
  week: [
    { label: "Sen", leads: 5, orders: 0 },
    { label: "Sel", leads: 8, orders: 1 },
    { label: "Rab", leads: 6, orders: 0 },
    { label: "Kam", leads: 9, orders: 1 },
    { label: "Jum", leads: 7, orders: 0 },
    { label: "Sab", leads: 3, orders: 0 },
    { label: "Min", leads: 9, orders: 1 },
  ],
  month: [
    { label: "Mg 1", leads: 24, orders: 1 },
    { label: "Mg 2", leads: 31, orders: 1 },
    { label: "Mg 3", leads: 29, orders: 2 },
    { label: "Mg 4", leads: 47, orders: 2 },
  ],
};

export const ALERTS: DashboardAlert[] = [
  {
    id: "al-1",
    kind: "lead_unclaimed",
    severity: "critical",
    title: "2 lead belum diambil admin",
    detail: "Sudah menunggu lebih dari 5 menit di jam kerja.",
    href: "/leads",
  },
  {
    id: "al-2",
    kind: "tracking_down",
    severity: "warning",
    title: "Tracking TikTok tidak mengirim data",
    detail: "Tidak ada event sejak kemarin 21.10. Leads dari TikTok tidak tercatat.",
    href: "/tracking",
  },
];

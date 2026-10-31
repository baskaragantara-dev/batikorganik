// Domain types of the prototype. They mirror the data model in the concept doc (PRD, Data model inti) so the screens
// can later read the same shapes from Supabase.

export type MarketCode = 'ID' | 'MY' | 'BN' | 'SG' | 'JP' | 'CH' | 'DE' | 'AE';
export type Platform = 'meta' | 'tiktok' | 'google' | 'whatsapp' | 'shopee' | 'email';
export type Funnel = 'b2c' | 'b2b';

export interface Market {
  code: MarketCode;
  country: string;
  language: string;
  currency: string;
  score: number; // 0..100, from Market Research
  rationale: string;
}

export type CampaignStatus = 'draft' | 'menunggu' | 'aktif' | 'dijeda' | 'selesai';

export interface Campaign {
  id: string;
  name: string;
  goal: string;
  funnel: Funnel;
  markets: MarketCode[];
  status: CampaignStatus;
  budgetMonthly: number; // IDR
  start: string; // ISO date
  end: string;
  offer: string;
  kpi: { leadsTarget: number; cplTarget: number };
  createdBy: 'agent' | 'manusia';
}

export type AdStatus = 'draft' | 'menunggu' | 'disetujui' | 'live' | 'dijeda';
export type AdObjective = 'Leads' | 'Messages' | 'Sales' | 'Traffic';

export interface Utm {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
}

export interface AdPlan {
  id: string;
  campaignId: string;
  platform: Platform;
  name: string;
  objective: AdObjective;
  audience: string;
  market: MarketCode;
  dailyBudget: number; // IDR
  destination: string;
  status: AdStatus;
  utm: Utm;
  creativeIds: string[];
  // Simulated performance; zero while not live.
  spend: number;
  leads: number;
}

export type ContentFormat =
  | 'Reels/TikTok'
  | 'Video ads'
  | 'Foto produk'
  | 'Carousel'
  | 'Story'
  | 'Statis ads'
  | 'Artikel SEO'
  | 'Email'
  | 'Broadcast WA'
  | 'Katalog B2B';

export type ContentStage = 'brief' | 'script' | 'produksi' | 'review' | 'siap' | 'tayang';

export interface ContentItem {
  id: string;
  campaignId: string;
  title: string;
  format: ContentFormat;
  language: string;
  stage: ContentStage;
  owner: string;
  hook: string;
  variants: number;
  dueDate: string;
  aiAssisted: boolean;
}

export type ApprovalKind = 'campaign' | 'ads' | 'konten' | 'balasan' | 'budget';
export type ApprovalStatus = 'menunggu' | 'disetujui' | 'ditolak';
export type Risk = 'rendah' | 'sedang' | 'tinggi';

export interface ApprovalItem {
  id: string;
  kind: ApprovalKind;
  campaignId?: string;
  title: string;
  summary: string;
  requestedBy: string; // agent name
  createdAt: string; // ISO datetime
  status: ApprovalStatus;
  risk: Risk;
  brandScore: number; // 0..100 from Brand Manager
  complianceNote: string | null; // null = passed Compliance Guard without notes
  reason?: string;
  preview?: string;
}

export type LeadStatus = 'baru' | 'dibalas' | 'kualifikasi' | 'penawaran' | 'menang' | 'kalah';
export type LeadChannel = 'WhatsApp' | 'Instagram DM' | 'Form website' | 'Email' | 'TikTok' | 'Shopee chat';

export interface Lead {
  id: string;
  name: string;
  company?: string;
  country: string;
  channel: LeadChannel;
  campaignId?: string;
  adId?: string;
  segment: Funnel;
  score: number; // 0..100 from Lead Qualifier
  status: LeadStatus;
  language: string;
  receivedAt: string;
  message: string;
  draftReply: string;
  valueEstimate: number; // IDR
}

export interface AgentDef {
  id: string;
  name: string;
  status: 'disepakati' | 'tambahan';
  role: string;
  gate: 'approval' | 'otomatis' | 'baca';
  runsToday: number;
  costTodayIdr: number;
}

export interface AgentRun {
  id: string;
  agentId: string;
  task: string;
  at: string;
  durationSec: number;
  costIdr: number;
  status: 'selesai' | 'gagal' | 'ditolak';
}

export interface DailyMetric {
  date: string;
  spend: number;
  leads: number;
  orders: number;
}

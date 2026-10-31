import type { AdStatus, ApprovalKind, ApprovalStatus, CampaignStatus, ContentStage, LeadStatus, Platform, Risk } from '@/lib/types';

type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'dark';

export const CAMPAIGN_STATUS: Record<CampaignStatus, { label: string; tone: Tone }> = {
  draft: { label: 'Draft', tone: 'neutral' },
  menunggu: { label: 'Menunggu approval', tone: 'warning' },
  aktif: { label: 'Aktif', tone: 'success' },
  dijeda: { label: 'Dijeda', tone: 'neutral' },
  selesai: { label: 'Selesai', tone: 'info' },
};

export const AD_STATUS: Record<AdStatus, { label: string; tone: Tone }> = {
  draft: { label: 'Draft', tone: 'neutral' },
  menunggu: { label: 'Menunggu approval', tone: 'warning' },
  disetujui: { label: 'Disetujui', tone: 'info' },
  live: { label: 'Live', tone: 'success' },
  dijeda: { label: 'Dijeda', tone: 'neutral' },
};

export const PLATFORM: Record<Platform, string> = {
  meta: 'Meta (FB/IG)',
  tiktok: 'TikTok',
  google: 'Google',
  whatsapp: 'WhatsApp',
  shopee: 'Shopee',
  email: 'Email',
};

export const STAGES: { key: ContentStage; label: string }[] = [
  { key: 'brief', label: 'Brief' },
  { key: 'script', label: 'Script' },
  { key: 'produksi', label: 'Produksi' },
  { key: 'review', label: 'Review' },
  { key: 'siap', label: 'Siap tayang' },
  { key: 'tayang', label: 'Tayang' },
];

export const APPROVAL_KIND: Record<ApprovalKind, string> = {
  campaign: 'Campaign',
  ads: 'Ads',
  konten: 'Konten',
  balasan: 'Balasan',
  budget: 'Budget',
};

export const APPROVAL_STATUS: Record<ApprovalStatus, { label: string; tone: Tone }> = {
  menunggu: { label: 'Menunggu', tone: 'warning' },
  disetujui: { label: 'Disetujui', tone: 'success' },
  ditolak: { label: 'Ditolak', tone: 'danger' },
};

export const RISK: Record<Risk, { label: string; tone: Tone }> = {
  rendah: { label: 'Risiko rendah', tone: 'neutral' },
  sedang: { label: 'Risiko sedang', tone: 'warning' },
  tinggi: { label: 'Risiko tinggi', tone: 'danger' },
};

export const LEAD_STATUS: Record<LeadStatus, { label: string; tone: Tone }> = {
  baru: { label: 'Baru', tone: 'info' },
  dibalas: { label: 'Dibalas', tone: 'neutral' },
  kualifikasi: { label: 'Kualifikasi', tone: 'neutral' },
  penawaran: { label: 'Penawaran', tone: 'warning' },
  menang: { label: 'Menang', tone: 'success' },
  kalah: { label: 'Kalah', tone: 'danger' },
};

export const LEAD_STATUS_ORDER: LeadStatus[] = ['baru', 'dibalas', 'kualifikasi', 'penawaran', 'menang', 'kalah'];

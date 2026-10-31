import { z } from 'zod';
import { slugify } from '@/lib/domain/utm';
import type { AdPlan, ApprovalItem, Campaign, ContentItem, Funnel, MarketCode, Platform } from '@/lib/types';

// Deterministic stand-in for the agent pipeline (Market Research -> Campaign Strategist -> Media Buyer -> Script
// Writer -> Brand Manager -> Compliance Guard). No LLM is called: the prototype shows the shape of the output so the
// flow can be reviewed. The real agents replace this function behind the same input and output types.

export const MARKET_CODES = ['ID', 'MY', 'BN', 'SG', 'JP', 'CH', 'DE', 'AE'] as const satisfies readonly MarketCode[];

export const campaignBriefSchema = z.object({
  goal: z.string().trim().min(10, 'Tulis tujuan minimal 10 karakter.').max(400, 'Tujuan maksimal 400 karakter.'),
  funnel: z.enum(['b2c', 'b2b']),
  markets: z.array(z.enum(MARKET_CODES)).min(1, 'Pilih minimal satu pasar.').max(4, 'Maksimal 4 pasar per campaign.'),
  budgetMonthly: z.number().int().min(1_000_000, 'Budget minimal Rp1 juta per bulan.').max(500_000_000),
  start: z.iso.date('Tanggal mulai tidak valid.'),
});
export type CampaignBrief = z.infer<typeof campaignBriefSchema>;

export interface AgentStep {
  agent: string;
  output: string;
}

export interface SimulatedDraft {
  campaign: Campaign;
  ads: AdPlan[];
  content: ContentItem[];
  approval: ApprovalItem;
  steps: AgentStep[];
}

const LANGUAGE: Record<MarketCode, string> = { ID: 'ID', MY: 'MS', BN: 'MS', SG: 'EN', JP: 'JA', CH: 'DE', DE: 'DE', AE: 'AR' };
const COUNTRY: Record<MarketCode, string> = {
  ID: 'Indonesia', MY: 'Malaysia', BN: 'Brunei', SG: 'Singapura', JP: 'Jepang', CH: 'Swiss', DE: 'Jerman', AE: 'UEA',
};

// Leads targets assume a starting CPL per funnel; the Performance Analyst replaces them once tracking has a baseline.
const START_CPL: Record<Funnel, number> = { b2c: 45_000, b2b: 120_000 };

function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function shortName(goal: string): string {
  const words = goal.replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean).slice(0, 6);
  const name = words.join(' ');
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function platformsFor(funnel: Funnel, market: MarketCode): Platform[] {
  if (funnel === 'b2b') return market === 'ID' ? ['meta', 'google', 'email'] : ['google', 'email'];
  return market === 'JP' || market === 'CH' || market === 'DE' ? ['meta', 'google'] : ['meta', 'tiktok'];
}

export function simulateCampaignDraft(brief: CampaignBrief, seq: number, nowIso: string): SimulatedDraft {
  const b = campaignBriefSchema.parse(brief);
  const id = `cmp-sim-${seq}`;
  const name = shortName(b.goal);
  const slug = `bo-${slugify(name).slice(0, 24)}`;
  const cpl = START_CPL[b.funnel];
  const leadsTarget = Math.max(1, Math.floor(b.budgetMonthly / cpl));

  const campaign: Campaign = {
    id,
    name,
    goal: b.goal,
    funnel: b.funnel,
    markets: b.markets,
    status: 'menunggu',
    budgetMonthly: b.budgetMonthly,
    start: b.start,
    end: addDays(b.start, 60),
    offer: b.funnel === 'b2b' ? 'Sampel kain dan konsultasi desain gratis untuk order pertama.' : 'Gratis ongkir untuk 2 pcs dan katalog warna lewat WhatsApp.',
    kpi: { leadsTarget, cplTarget: cpl },
    createdBy: 'agent',
  };

  const pairs = b.markets.flatMap((m) => platformsFor(b.funnel, m).map((p) => ({ m, p })));
  const paid = pairs.filter(({ p }) => p !== 'email').length || 1;
  const dailyPerAd = Math.floor(b.budgetMonthly / 30 / paid / 1_000) * 1_000;

  const ads: AdPlan[] = pairs.map(({ m, p }, i) => {
    const isEmail = p === 'email';
    const medium = p === 'google' ? 'cpc' : isEmail ? 'outreach' : 'paid_social';
    return {
      id: `${id}-ad-${i + 1}`,
      campaignId: id,
      platform: p,
      name: `${isEmail ? 'Outreach' : p === 'google' ? 'Search' : 'Ads'} ${COUNTRY[m]}`,
      objective: b.funnel === 'b2b' ? 'Leads' : p === 'meta' ? 'Messages' : 'Sales',
      audience: b.funnel === 'b2b' ? `Pengambil keputusan pembelian, ${COUNTRY[m]}` : `Wanita 25 sampai 44, minat modest dan sustainable fashion, ${COUNTRY[m]}`,
      market: m,
      dailyBudget: isEmail ? 0 : dailyPerAd,
      destination: p === 'meta' && b.funnel === 'b2c' ? `WhatsApp + kode ${m}${seq}` : isEmail ? 'Email + jadwal call' : 'Landing page + form',
      status: 'draft',
      utm: { source: p === 'meta' ? 'instagram' : p, medium, campaign: slug, content: `${p}-${m.toLowerCase()}-v1`, term: `${m.toLowerCase()}-${b.funnel}` },
      creativeIds: [`${id}-ct-1`],
      spend: 0,
      leads: 0,
    };
  });

  const content: ContentItem[] = b.markets.map((m, i) => ({
    id: `${id}-ct-${i + 1}`,
    campaignId: id,
    title: b.funnel === 'b2b' ? `Katalog dan cerita bahan untuk ${COUNTRY[m]}` : `Reels 3 gaya pakai untuk ${COUNTRY[m]}`,
    format: b.funnel === 'b2b' ? 'Katalog B2B' : 'Reels/TikTok',
    language: LANGUAGE[m],
    stage: 'brief',
    owner: 'Content Planner',
    hook: b.funnel === 'b2b' ? 'Warna dari tanaman, bisa dilacak sampai petaninya.' : 'Satu kain, tiga gaya, tanpa jahit.',
    variants: 0,
    dueDate: addDays(b.start, -3),
    aiAssisted: true,
  }));

  const approval: ApprovalItem = {
    id: `ap-sim-${seq}`,
    kind: 'campaign',
    campaignId: id,
    title: `Campaign: ${name}`,
    summary: `${b.markets.length} pasar, budget Rp${b.budgetMonthly.toLocaleString('id-ID')} per bulan, target ${leadsTarget} leads.`,
    requestedBy: 'Campaign Strategist',
    createdAt: nowIso,
    status: 'menunggu',
    risk: b.budgetMonthly > 20_000_000 ? 'tinggi' : 'sedang',
    brandScore: 90,
    complianceNote: b.markets.some((m) => m === 'CH' || m === 'DE') ? 'Pasar EU dan Swiss: Pixel hanya aktif setelah consent cookie.' : null,
  };

  const steps: AgentStep[] = [
    { agent: 'Market Research', output: `Skor ${b.markets.length} pasar dan persona utama disiapkan.` },
    { agent: 'Campaign Strategist', output: `Offer, periode 60 hari, target ${leadsTarget} leads dengan CPL awal Rp${cpl.toLocaleString('id-ID')}.` },
    { agent: 'Media Buyer', output: `${ads.length} ads plan dengan UTM otomatis.` },
    { agent: 'Script Writer', output: `${content.length} brief konten dengan hook awal.` },
    { agent: 'Brand Manager', output: 'Tone dan klaim sesuai guideline (skor 90).' },
    { agent: 'Compliance Guard', output: approval.complianceNote ?? 'Lolos tanpa catatan.' },
  ];

  return { campaign, ads, content, approval, steps };
}

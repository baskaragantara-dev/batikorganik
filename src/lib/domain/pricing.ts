import { z } from 'zod';

// Package pricing for the customer offer. Costs come from the concept doc (Opsi biaya bulanan); every number here is an
// estimate to be checked against the vendors' price pages before a quote is sent.

export const WA_MARKETING_IDR_PER_MESSAGE = 586.33; // Meta rate recorded in Naklasa, effective 2026-01-01

export const pricingAssumptionsSchema = z.object({
  fxIdrPerUsd: z.number().positive(),
  // Extra on USD costs so a weaker rupiah does not eat the margin.
  fxBuffer: z.number().min(0).max(0.5),
});
export type PricingAssumptions = z.infer<typeof pricingAssumptionsSchema>;

export const DEFAULT_ASSUMPTIONS: PricingAssumptions = { fxIdrPerUsd: 16_500, fxBuffer: 0.1 };

export type PackageId = 'starter' | 'growth' | 'scale';

export interface PackageCostBasis {
  supabaseUsd: number;
  llmUsd: number;
  higgsfieldUsd: number;
  vpsIdr: number;
  waMessages: number;
}

export interface PackageDefinition {
  id: PackageId;
  name: string;
  tagline: string;
  contentTier: 1 | 2 | 3;
  outputPerDay: number;
  markets: string;
  languages: string;
  users: number;
  defaultMargin: number;
  cost: PackageCostBasis;
  includes: readonly string[];
}

export const PACKAGES: readonly PackageDefinition[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Tracking rapi dan konten konsisten',
    contentTier: 1,
    outputPerDay: 9,
    markets: '1 sampai 2 pasar',
    languages: '2 bahasa',
    users: 3,
    defaultMargin: 0.6,
    cost: { supabaseUsd: 25, llmUsd: 20, higgsfieldUsd: 15, vpsIdr: 150_000, waMessages: 500 },
    includes: ['9 agent inti', 'Ads plan Meta dan TikTok', 'Leads inbox WA dan form', 'Laporan mingguan'],
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'Amplifikasi konten dan multi-pasar',
    contentTier: 2,
    outputPerDay: 24,
    markets: '3 sampai 4 pasar',
    languages: '4 bahasa',
    users: 10,
    defaultMargin: 0.55,
    cost: { supabaseUsd: 35, llmUsd: 60, higgsfieldUsd: 60, vpsIdr: 250_000, waMessages: 2_000 },
    includes: ['14 agent', 'Ads plan semua platform', 'Inbox semua kanal', 'Gambar pendukung Higgsfield', 'Laporan harian'],
  },
  {
    id: 'scale',
    name: 'Scale',
    tagline: 'Dynamic creative testing lintas negara',
    contentTier: 3,
    outputPerDay: 60,
    markets: 'Tanpa batas pasar',
    languages: '5+ bahasa',
    users: 25,
    defaultMargin: 0.5,
    cost: { supabaseUsd: 50, llmUsd: 150, higgsfieldUsd: 200, vpsIdr: 400_000, waMessages: 5_000 },
    includes: ['14 agent + B2B Export Prospector', 'Optimasi stop dan scale dengan approval', 'Video pendukung Higgsfield', 'Prioritas support'],
  },
] as const;

export const SETUP_FEE_IDR = 7_500_000;

export interface CostBreakdown {
  usdCostsIdr: number;
  vpsIdr: number;
  waIdr: number;
  total: number;
}

export function monthlyCost(cost: PackageCostBasis, assumptions: PricingAssumptions): CostBreakdown {
  const a = pricingAssumptionsSchema.parse(assumptions);
  const usd = cost.supabaseUsd + cost.llmUsd + cost.higgsfieldUsd;
  const usdCostsIdr = Math.round(usd * a.fxIdrPerUsd * (1 + a.fxBuffer));
  const waIdr = Math.round(cost.waMessages * WA_MARKETING_IDR_PER_MESSAGE);
  return { usdCostsIdr, vpsIdr: cost.vpsIdr, waIdr, total: usdCostsIdr + cost.vpsIdr + waIdr };
}

const PRICE_STEP_IDR = 100_000;

/** Price that keeps at least `margin` gross margin, rounded up to the next Rp100 ribu. */
export function priceForMargin(costIdr: number, margin: number): number {
  if (!(margin >= 0 && margin < 0.95)) throw new RangeError(`margin must be in [0, 0.95), got ${margin}`);
  if (!(costIdr >= 0)) throw new RangeError(`cost must be non-negative, got ${costIdr}`);
  return Math.ceil(costIdr / (1 - margin) / PRICE_STEP_IDR) * PRICE_STEP_IDR;
}

export function grossMargin(priceIdr: number, costIdr: number): number {
  if (priceIdr <= 0) return 0;
  return (priceIdr - costIdr) / priceIdr;
}

export interface PackageQuote {
  pkg: PackageDefinition;
  cost: CostBreakdown;
  price: number;
  margin: number;
}

export function quotePackage(pkg: PackageDefinition, margin: number, assumptions: PricingAssumptions): PackageQuote {
  const cost = monthlyCost(pkg.cost, assumptions);
  const price = priceForMargin(cost.total, margin);
  return { pkg, cost, price, margin: grossMargin(price, cost.total) };
}

/** Extra WhatsApp promo messages beyond the quota, sold at cost plus `markup`. */
export function waOveragePrice(markup = 0.2): number {
  return Math.ceil(WA_MARKETING_IDR_PER_MESSAGE * (1 + markup));
}

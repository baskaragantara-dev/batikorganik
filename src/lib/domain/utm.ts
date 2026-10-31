import { z } from 'zod';
import type { Utm } from '@/lib/types';

// UTM convention of the concept doc: lowercase slugs, no spaces, every link carries all five parameters.

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

const utmSchema = z.object({
  source: z.string().min(1),
  medium: z.string().min(1),
  campaign: z.string().min(1),
  content: z.string().min(1),
  term: z.string().min(1),
});

export type UtmResult = { ok: true; url: string } | { ok: false; error: string };

export function buildUtmUrl(baseUrl: string, utm: Utm): UtmResult {
  let url: URL;
  try {
    url = new URL(baseUrl);
  } catch {
    return { ok: false, error: 'URL tujuan tidak valid. Contoh: https://batikorganik.id/produk' };
  }
  if (url.protocol !== 'https:') return { ok: false, error: 'URL tujuan harus memakai https.' };
  const parsed = utmSchema.safeParse({
    source: slugify(utm.source),
    medium: slugify(utm.medium).replace(/-/g, '_'),
    campaign: slugify(utm.campaign),
    content: slugify(utm.content),
    term: slugify(utm.term),
  });
  if (!parsed.success) return { ok: false, error: 'Semua parameter UTM wajib diisi.' };
  for (const [key, value] of Object.entries(parsed.data)) url.searchParams.set(`utm_${key}`, value);
  return { ok: true, url: url.toString() };
}

/** WhatsApp loses UTM, so the click-to-chat link carries the campaign code in the prefilled message instead. */
export function waClickToChat(phoneE164: string, campaignCode: string, greeting: string): string {
  const digits = phoneE164.replace(/\D/g, '');
  const text = `${greeting} [${campaignCode.toUpperCase()}]`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

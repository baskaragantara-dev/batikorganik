import { describe, expect, it } from 'vitest';
import { buildUtmUrl, slugify, waClickToChat } from './utm';

const utm = { source: 'Instagram', medium: 'Paid Social', campaign: 'BO Modest MY Nov', content: 'Video Hook 3', term: 'MY 25-40' };

describe('slugify', () => {
  it('lowercases, strips accents and joins with dashes', () => {
    expect(slugify('  Batik Organik Café! ')).toBe('batik-organik-cafe');
  });
});

describe('buildUtmUrl', () => {
  it('adds all five parameters as slugs', () => {
    const r = buildUtmUrl('https://batikorganik.id/produk?ref=1', utm);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const u = new URL(r.url);
    expect(u.searchParams.get('ref')).toBe('1');
    expect(u.searchParams.get('utm_source')).toBe('instagram');
    expect(u.searchParams.get('utm_medium')).toBe('paid_social');
    expect(u.searchParams.get('utm_campaign')).toBe('bo-modest-my-nov');
    expect(u.searchParams.get('utm_content')).toBe('video-hook-3');
    expect(u.searchParams.get('utm_term')).toBe('my-25-40');
  });

  it('rejects a non-https or malformed URL', () => {
    expect(buildUtmUrl('http://batikorganik.id', utm).ok).toBe(false);
    expect(buildUtmUrl('batikorganik', utm).ok).toBe(false);
  });

  it('rejects an empty parameter', () => {
    expect(buildUtmUrl('https://batikorganik.id', { ...utm, term: '  ' }).ok).toBe(false);
  });
});

describe('waClickToChat', () => {
  it('keeps digits only and puts the campaign code in the message', () => {
    const link = waClickToChat('+62 816-1700-0530', 'my1123', 'Halo, saya tertarik');
    expect(link).toBe('https://wa.me/6281617000530?text=Halo%2C%20saya%20tertarik%20%5BMY1123%5D');
  });
});

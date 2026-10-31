import { describe, expect, it } from 'vitest';
import { campaignBriefSchema, simulateCampaignDraft } from './simulate';

const brief = {
  goal: 'Leads reseller modest fashion di Malaysia dan Singapura',
  funnel: 'b2c' as const,
  markets: ['MY' as const, 'SG' as const],
  budgetMonthly: 6_000_000,
  start: '2026-11-15',
};

describe('simulateCampaignDraft', () => {
  it('builds a pending campaign with ads, content and one approval', () => {
    const d = simulateCampaignDraft(brief, 7, '2026-10-31T10:00:00+07:00');
    expect(d.campaign.status).toBe('menunggu');
    expect(d.campaign.end).toBe('2027-01-14');
    expect(d.ads).toHaveLength(4); // meta + tiktok for each of 2 markets
    expect(d.content).toHaveLength(2);
    expect(d.approval.kind).toBe('campaign');
    expect(d.steps.map((s) => s.agent)).toContain('Compliance Guard');
  });

  it('never plans more daily spend than the monthly budget', () => {
    const d = simulateCampaignDraft(brief, 1, '2026-10-31T10:00:00+07:00');
    const daily = d.ads.reduce((s, a) => s + a.dailyBudget, 0);
    expect(daily * 30).toBeLessThanOrEqual(brief.budgetMonthly);
  });

  it('gives every ad a complete UTM set', () => {
    const d = simulateCampaignDraft({ ...brief, funnel: 'b2b', markets: ['ID'] }, 2, '2026-10-31T10:00:00+07:00');
    for (const ad of d.ads) expect(Object.values(ad.utm).every((v) => v.length > 0)).toBe(true);
  });

  it('flags EU markets for cookie consent', () => {
    const d = simulateCampaignDraft({ ...brief, funnel: 'b2b', markets: ['DE'] }, 3, '2026-10-31T10:00:00+07:00');
    expect(d.approval.complianceNote).toMatch(/consent/);
  });
});

describe('campaignBriefSchema', () => {
  it('rejects a short goal, no market and a tiny budget', () => {
    const r = campaignBriefSchema.safeParse({ ...brief, goal: 'leads', markets: [], budgetMonthly: 1000 });
    expect(r.success).toBe(false);
    if (r.success) return;
    expect(r.error.issues.map((i) => i.path[0])).toEqual(expect.arrayContaining(['goal', 'markets', 'budgetMonthly']));
  });
});

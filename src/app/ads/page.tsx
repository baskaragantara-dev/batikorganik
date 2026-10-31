'use client';

import { useMemo, useState } from 'react';
import { AdsTable } from '@/components/ads-table';
import { Card, CardTitle, EmptyState, PageHeader, SimNote, Stat } from '@/components/ui';
import { number, rupiahShort } from '@/lib/format';
import { AD_STATUS, PLATFORM } from '@/lib/labels';
import { useStore } from '@/lib/store';
import type { AdStatus, Platform } from '@/lib/types';
import { cn } from '@/lib/utils';

const PLATFORMS: (Platform | 'semua')[] = ['semua', 'meta', 'tiktok', 'google', 'email'];

export default function AdsPage() {
  const { ads, campaigns } = useStore();
  const [platform, setPlatform] = useState<Platform | 'semua'>('semua');
  const [status, setStatus] = useState<AdStatus | 'semua'>('semua');

  const filtered = useMemo(
    () => ads.filter((a) => (platform === 'semua' || a.platform === platform) && (status === 'semua' || a.status === status)),
    [ads, platform, status],
  );
  const live = ads.filter((a) => a.status === 'live');
  const spend = ads.reduce((s, a) => s + a.spend, 0);
  const leads = ads.reduce((s, a) => s + a.leads, 0);
  const dailyLive = live.reduce((s, a) => s + a.dailyBudget, 0);
  const name = (id: string) => campaigns.find((c) => c.id === id)?.name ?? id;
  const grouped = campaigns.map((c) => ({ c, items: filtered.filter((a) => a.campaignId === c.id) })).filter((g) => g.items.length > 0);

  return (
    <>
      <PageHeader title="Ads" sub="Semua ads plan per campaign. Media Buyer hanya mengusulkan objective Leads, Messages, atau Sales, dan setiap ad wajib punya tujuan klik dan UTM." />
      <div className="mb-6">
        <SimNote>Belum tersambung ke Meta, TikTok, atau Google. Push ke platform butuh akses API yang sedang diajukan.</SimNote>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Ads live" value={number(live.length)} hint={`${rupiahShort(dailyLive)} per hari`} />
        <Stat label="Spend total" value={rupiahShort(spend)} />
        <Stat label="Leads dari ads" value={number(leads)} />
        <Stat label="CPL rata-rata" value={leads ? rupiahShort(Math.round(spend / leads)) : 'Belum ada'} />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2" role="group" aria-label="Filter platform">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPlatform(p)}
            aria-pressed={platform === p}
            className={cn('rounded-full px-4 py-1.5 text-body-sm font-semibold', platform === p ? 'bg-inverse text-inverse-foreground' : 'bg-card hover:bg-muted')}
          >
            {p === 'semua' ? 'Semua platform' : PLATFORM[p]}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 text-body-sm">
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as AdStatus | 'semua')} className="rounded-full border border-input-border bg-card px-3 py-1.5">
            <option value="semua">Semua</option>
            {(Object.keys(AD_STATUS) as AdStatus[]).map((s) => (
              <option key={s} value={s}>
                {AD_STATUS[s].label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {grouped.length === 0 ? (
        <EmptyState title="Tidak ada ads dengan filter ini." />
      ) : (
        <div className="space-y-4">
          {grouped.map(({ c, items }) => (
            <Card key={c.id}>
              <CardTitle sub={`${c.markets.join(', ')} · ${c.funnel.toUpperCase()}`}>{name(c.id)}</CardTitle>
              <AdsTable ads={items} />
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

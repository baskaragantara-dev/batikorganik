'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Progress } from '@/components/charts';
import { AiTag, Badge, Card, LinkButton, PageHeader, SimNote } from '@/components/ui';
import { date, rupiah } from '@/lib/format';
import { CAMPAIGN_STATUS } from '@/lib/labels';
import { useStore } from '@/lib/store';

export default function CampaignListPage() {
  const { campaigns, ads } = useStore();
  return (
    <>
      <PageHeader
        title="Campaign"
        sub="Setiap campaign punya tujuan, pasar, offer, budget, dan KPI. Ads dan konten selalu menempel ke satu campaign."
        action={
          <LinkButton href="/campaign/baru">
            <Plus className="size-4" aria-hidden /> Campaign baru
          </LinkButton>
        }
      />
      <div className="mb-6">
        <SimNote />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {campaigns.map((c) => {
          const cAds = ads.filter((a) => a.campaignId === c.id);
          const leads = cAds.reduce((s, a) => s + a.leads, 0);
          return (
            <Card key={c.id} className="flex flex-col gap-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <Link href={`/campaign/${c.id}`} className="text-h3 hover:text-link">
                    {c.name}
                  </Link>
                  <p className="mt-1 text-body-sm text-muted-foreground">{c.goal}</p>
                </div>
                <Badge tone={CAMPAIGN_STATUS[c.status].tone}>{CAMPAIGN_STATUS[c.status].label}</Badge>
              </div>
              <dl className="grid grid-cols-2 gap-3 text-body-sm sm:grid-cols-4">
                <div>
                  <dt className="text-caption text-muted-foreground">Pasar</dt>
                  <dd className="font-semibold">{c.markets.join(', ')}</dd>
                </div>
                <div>
                  <dt className="text-caption text-muted-foreground">Funnel</dt>
                  <dd className="font-semibold">{c.funnel === 'b2b' ? 'B2B' : 'B2C'}</dd>
                </div>
                <div>
                  <dt className="text-caption text-muted-foreground">Budget/bulan</dt>
                  <dd className="font-semibold tabular">{rupiah(c.budgetMonthly)}</dd>
                </div>
                <div>
                  <dt className="text-caption text-muted-foreground">Periode</dt>
                  <dd className="font-semibold">
                    {date(c.start)} sampai {date(c.end)}
                  </dd>
                </div>
              </dl>
              <div className="mt-auto">
                <div className="mb-1 flex justify-between text-body-sm text-muted-foreground">
                  <span>
                    {cAds.length} ads plan {c.createdBy === 'agent' ? <AiTag label="Disusun agent" /> : null}
                  </span>
                  <span className="tabular">
                    {leads}/{c.kpi.leadsTarget} leads
                  </span>
                </div>
                <Progress value={leads} max={c.kpi.leadsTarget} label={`Progres leads ${c.name}`} />
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}

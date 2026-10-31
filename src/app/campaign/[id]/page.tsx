'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AdsTable } from '@/components/ads-table';
import { Progress } from '@/components/charts';
import { AiTag, Badge, Card, CardTitle, EmptyState, LinkButton, PageHeader, SimNote, Stat } from '@/components/ui';
import { date, number, rupiah, rupiahShort } from '@/lib/format';
import { CAMPAIGN_STATUS, LEAD_STATUS, STAGES } from '@/lib/labels';
import { MARKETS } from '@/lib/mock/data';
import { useStore } from '@/lib/store';

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { campaigns, ads, content, leads, approvals } = useStore();
  const c = campaigns.find((x) => x.id === id);

  if (!c) {
    return (
      <>
        <PageHeader title="Campaign tidak ditemukan" />
        <EmptyState title="Campaign ini tidak ada atau data demo sudah di-reset.">
          <Link href="/campaign" className="text-link underline">
            Kembali ke daftar campaign
          </Link>
        </EmptyState>
      </>
    );
  }

  const cAds = ads.filter((a) => a.campaignId === c.id);
  const cContent = content.filter((x) => x.campaignId === c.id);
  const cLeads = leads.filter((l) => l.campaignId === c.id);
  const spend = cAds.reduce((s, a) => s + a.spend, 0);
  const leadCount = cAds.reduce((s, a) => s + a.leads, 0);
  const pending = approvals.filter((a) => a.campaignId === c.id && a.status === 'menunggu').length;

  return (
    <>
      <Link href="/campaign" className="mb-3 inline-flex items-center gap-1 text-body-sm text-link">
        <ArrowLeft className="size-4" aria-hidden /> Semua campaign
      </Link>
      <PageHeader
        title={c.name}
        sub={c.goal}
        action={
          <div className="flex items-center gap-2">
            {c.createdBy === 'agent' ? <AiTag label="Disusun agent" /> : null}
            <Badge tone={CAMPAIGN_STATUS[c.status].tone}>{CAMPAIGN_STATUS[c.status].label}</Badge>
          </div>
        }
      />
      <div className="mb-6">
        <SimNote />
      </div>

      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Budget per bulan" value={rupiahShort(c.budgetMonthly)} hint={`${date(c.start)} sampai ${date(c.end)}`} />
        <Stat label="Spend sejauh ini" value={rupiahShort(spend)} />
        <Stat label="Leads" value={`${number(leadCount)}/${c.kpi.leadsTarget}`} hint={`CPL ${leadCount ? rupiahShort(Math.round(spend / leadCount)) : 'belum ada'}, target ${rupiahShort(c.kpi.cplTarget)}`} />
        <Stat tone="dark" label="Menunggu approval" value={number(pending)} hint={<Link href="/approval" className="underline underline-offset-2">Buka approval</Link>} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardTitle>Strategi</CardTitle>
          <dl className="space-y-3 text-body">
            <div>
              <dt className="text-caption text-muted-foreground">Offer</dt>
              <dd>{c.offer}</dd>
            </div>
            <div>
              <dt className="text-caption text-muted-foreground">Funnel</dt>
              <dd>{c.funnel === 'b2b' ? 'B2B: lead ke form penawaran, lalu sales follow-up' : 'B2C: lead ke chat WhatsApp atau checkout'}</dd>
            </div>
            <div>
              <dt className="text-caption text-muted-foreground">Pasar</dt>
              <dd>
                <ul className="mt-1 space-y-1">
                  {c.markets.map((code) => {
                    const m = MARKETS.find((x) => x.code === code);
                    return (
                      <li key={code} className="text-body-sm">
                        <strong>{m?.country}</strong> · {m?.language} · {m?.currency}
                      </li>
                    );
                  })}
                </ul>
              </dd>
            </div>
            <div>
              <dt className="text-caption text-muted-foreground">Progres leads</dt>
              <dd className="mt-1">
                <Progress value={leadCount} max={c.kpi.leadsTarget} label="Progres leads" />
              </dd>
            </div>
          </dl>
        </Card>

        <Card className="xl:col-span-2">
          <CardTitle action={<LinkButton href="/ads" size="sm" variant="secondary">Semua ads</LinkButton>} sub="UTM dibuat otomatis untuk setiap ad. Tombol Salin URL menghasilkan link tujuan lengkap.">
            Ads plan ({cAds.length})
          </CardTitle>
          {cAds.length ? <AdsTable ads={cAds} /> : <EmptyState title="Belum ada ads plan." />}
        </Card>

        <Card className="xl:col-span-2">
          <CardTitle action={<LinkButton href="/konten" size="sm" variant="secondary">Content Studio</LinkButton>}>Konten ({cContent.length})</CardTitle>
          {cContent.length ? (
            <ul className="divide-y divide-border">
              {cContent.map((x) => (
                <li key={x.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <p className="font-semibold">{x.title}</p>
                    <p className="text-body-sm text-muted-foreground">
                      {x.format} · {x.language} · {x.owner} · {x.variants} varian
                    </p>
                  </div>
                  <Badge>{STAGES.find((s) => s.key === x.stage)?.label}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Belum ada konten." />
          )}
        </Card>

        <Card>
          <CardTitle action={<LinkButton href="/leads" size="sm" variant="secondary">Inbox</LinkButton>}>Leads ({cLeads.length})</CardTitle>
          {cLeads.length ? (
            <ul className="space-y-3">
              {cLeads.map((l) => (
                <li key={l.id} className="rounded-tile bg-surface-2 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{l.company ?? l.name}</p>
                    <Badge tone={LEAD_STATUS[l.status].tone}>{LEAD_STATUS[l.status].label}</Badge>
                  </div>
                  <p className="text-body-sm text-muted-foreground">
                    {l.channel} · skor {l.score} · {rupiah(l.valueEstimate)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Belum ada lead.">Lead muncul setelah ads tayang dan tracking aktif.</EmptyState>
          )}
        </Card>
      </div>
    </>
  );
}

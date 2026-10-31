'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { LeadsSpendChart, Progress } from '@/components/charts';
import { AiTag, Badge, Card, CardTitle, LinkButton, PageHeader, SimNote, Stat } from '@/components/ui';
import { dateTime, number, rupiah, rupiahShort } from '@/lib/format';
import { CAMPAIGN_STATUS } from '@/lib/labels';
import { AGENTS, AGENT_RUNS, DAILY, TRACKING } from '@/lib/mock/data';
import { useStore } from '@/lib/store';

export default function HomePage() {
  const { campaigns, approvals, leads, ads } = useStore();
  const spend = DAILY.reduce((s, d) => s + d.spend, 0);
  const leadCount = DAILY.reduce((s, d) => s + d.leads, 0);
  const orders = DAILY.reduce((s, d) => s + d.orders, 0);
  const pending = approvals.filter((a) => a.status === 'menunggu');
  const trackingReady = TRACKING.filter((t) => t.status === 'siap').length;
  const active = campaigns.filter((c) => c.status === 'aktif' || c.status === 'menunggu');
  const newLeads = leads.filter((l) => l.status === 'baru');

  return (
    <>
      <PageHeader title="Selamat pagi, tim Batik Organik" sub="Ringkasan 14 hari terakhir: dari rupiah ads sampai lead dan order." />
      <div className="mb-6">
        <SimNote />
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-xl bg-warning-soft p-4 text-warning-text">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden />
        <div className="text-body">
          <p className="font-semibold">
            Tracking baru {trackingReady} dari {TRACKING.length} siap.
          </p>
          <p>Selama Pixel, CAPI, dan GA4 belum aktif, angka leads dari ads tidak lengkap dan platform tidak bisa mengoptimasi ke arah leads.</p>
          <p className="mt-1 font-semibold">Halaman Tracking dengan langkah aktivasi menyusul di rilis R0 berikutnya.</p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Stat label="Spend ads, 14 hari" value={rupiahShort(spend)} hint="Meta dan Google" />
        <Stat label="Leads, 14 hari" value={number(leadCount)} hint={`${newLeads.length} belum dibalas`} />
        <Stat label="Biaya per lead (CPL)" value={rupiahShort(Math.round(spend / Math.max(1, leadCount)))} hint="Target campaign aktif Rp100 rb" />
        <Stat label="Order dari lead" value={number(orders)} hint={`Konversi ${Math.round((orders / Math.max(1, leadCount)) * 100)}%`} />
        <Stat tone="dark" label="Menunggu keputusan Anda" value={number(pending.length)} hint={<Link href="/approval" className="underline underline-offset-2">Buka approval</Link>} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardTitle sub="Bar = leads, garis = spend. Leads naik setelah objective diganti ke Leads pada 20 Okt.">Leads dan spend harian</CardTitle>
          <LeadsSpendChart data={DAILY} />
        </Card>

        <Card>
          <CardTitle action={<LinkButton href="/approval" size="sm" variant="secondary">Semua</LinkButton>}>Perlu keputusan</CardTitle>
          {pending.length === 0 ? (
            <p className="text-body text-muted-foreground">Tidak ada yang menunggu. Agent akan mengirim draft berikutnya ke sini.</p>
          ) : (
            <ul className="space-y-3">
              {pending.slice(0, 5).map((a) => (
                <li key={a.id} className="rounded-tile bg-surface-2 p-3">
                  <p className="text-body font-semibold">{a.title}</p>
                  <p className="mt-0.5 text-body-sm text-muted-foreground">
                    {a.requestedBy} · {dateTime(a.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="xl:col-span-2">
          <CardTitle action={<LinkButton href="/campaign/baru" size="sm">Campaign baru</LinkButton>}>Campaign berjalan</CardTitle>
          <ul className="divide-y divide-border">
            {active.map((c) => {
              const cAds = ads.filter((a) => a.campaignId === c.id);
              const cLeads = cAds.reduce((s, a) => s + a.leads, 0);
              const cSpend = cAds.reduce((s, a) => s + a.spend, 0);
              return (
                <li key={c.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link href={`/campaign/${c.id}`} className="text-title hover:text-link">
                      {c.name}
                    </Link>
                    <Badge tone={CAMPAIGN_STATUS[c.status].tone}>{CAMPAIGN_STATUS[c.status].label}</Badge>
                  </div>
                  <p className="mt-1 text-body-sm text-muted-foreground">
                    {c.markets.join(', ')} · {c.funnel.toUpperCase()} · budget {rupiah(c.budgetMonthly)}/bulan · spend {rupiahShort(cSpend)}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1">
                      <Progress value={cLeads} max={c.kpi.leadsTarget} label={`Leads ${c.name}`} />
                    </div>
                    <span className="text-body-sm tabular text-muted-foreground">
                      {cLeads}/{c.kpi.leadsTarget} leads
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <CardTitle action={<AiTag label="Agent" />}>Aktivitas agent</CardTitle>
          <ul className="space-y-3">
            {AGENT_RUNS.slice(0, 6).map((r) => {
              const agent = AGENTS.find((a) => a.id === r.agentId);
              return (
                <li key={r.id} className="text-body-sm">
                  <p className="font-semibold">{agent?.name}</p>
                  <p className="text-muted-foreground">
                    {r.task}
                    {r.status !== 'selesai' ? (
                      <Badge tone={r.status === 'gagal' ? 'danger' : 'warning'} className="ml-2">
                        {r.status}
                      </Badge>
                    ) : null}
                  </p>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </>
  );
}

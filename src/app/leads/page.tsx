'use client';

import { useMemo, useState } from 'react';
import { AiTag, Badge, Button, Card, CardTitle, EmptyState, PageHeader, SimNote } from '@/components/ui';
import { dateTime, rupiah } from '@/lib/format';
import { LEAD_STATUS, LEAD_STATUS_ORDER } from '@/lib/labels';
import { useStore } from '@/lib/store';
import type { Funnel, LeadStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

function scoreTone(score: number) {
  if (score >= 75) return 'success' as const;
  if (score >= 50) return 'warning' as const;
  return 'neutral' as const;
}

export default function LeadsPage() {
  const { leads, campaigns, setLeadStatus } = useStore();
  const [segment, setSegment] = useState<Funnel | 'semua'>('semua');
  const [status, setStatus] = useState<LeadStatus | 'aktif'>('aktif');
  const sorted = useMemo(
    () =>
      leads
        .filter((l) => (segment === 'semua' || l.segment === segment) && (status === 'aktif' ? l.status !== 'menang' && l.status !== 'kalah' : l.status === status))
        .sort((a, b) => b.score - a.score),
    [leads, segment, status],
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = sorted.find((l) => l.id === activeId) ?? sorted[0] ?? null;
  const [sent, setSent] = useState<Set<string>>(new Set());

  return (
    <>
      <PageHeader title="Leads" sub="Lead dari WhatsApp, Instagram, TikTok, form website, email, dan Shopee dalam satu inbox. Diurutkan dari skor tertinggi, dengan draft balasan dalam bahasa lead." />
      <div className="mb-6">
        <SimNote>Nama, perusahaan, dan pesan di bawah adalah contoh. Belum ada kanal yang tersambung.</SimNote>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(['semua', 'b2b', 'b2c'] as const).map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={segment === s}
            onClick={() => setSegment(s)}
            className={cn('rounded-full px-4 py-1.5 text-body-sm font-semibold', segment === s ? 'bg-inverse text-inverse-foreground' : 'bg-card hover:bg-muted')}
          >
            {s === 'semua' ? 'Semua' : s.toUpperCase()}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 text-body-sm">
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as LeadStatus | 'aktif')} className="rounded-full border border-input-border bg-card px-3 py-1.5">
            <option value="aktif">Masih berjalan</option>
            {LEAD_STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {LEAD_STATUS[s].label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {sorted.length === 0 ? (
        <EmptyState title="Tidak ada lead dengan filter ini." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <ul className="space-y-2" aria-label="Daftar lead">
            {sorted.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(l.id)}
                  aria-current={active?.id === l.id ? 'true' : undefined}
                  className={cn('w-full rounded-lg bg-card p-4 text-left ring-inset transition-colors hover:bg-card-hover', active?.id === l.id && 'ring-2 ring-primary')}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{l.company ?? l.name}</p>
                      <p className="text-body-sm text-muted-foreground">
                        {l.channel} · {l.country} · {dateTime(l.receivedAt)}
                      </p>
                    </div>
                    <Badge tone={scoreTone(l.score)}>Skor {l.score}</Badge>
                  </div>
                  <p className="mt-2 line-clamp-2 text-body-sm">{l.message}</p>
                  <div className="mt-2 flex gap-2">
                    <Badge tone={LEAD_STATUS[l.status].tone}>{LEAD_STATUS[l.status].label}</Badge>
                    <Badge>{l.segment.toUpperCase()}</Badge>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {active ? (
            <Card className="h-fit lg:sticky lg:top-6">
              <CardTitle sub={`${active.name}${active.company ? ` · ${active.company}` : ''} · ${active.country}`}>{active.company ?? active.name}</CardTitle>
              <dl className="mb-4 grid grid-cols-2 gap-3 text-body-sm sm:grid-cols-4">
                <div>
                  <dt className="text-caption text-muted-foreground">Kanal</dt>
                  <dd className="font-semibold">{active.channel}</dd>
                </div>
                <div>
                  <dt className="text-caption text-muted-foreground">Sumber</dt>
                  <dd className="font-semibold">{campaigns.find((c) => c.id === active.campaignId)?.name ?? 'Organik / tidak terlacak'}</dd>
                </div>
                <div>
                  <dt className="text-caption text-muted-foreground">Nilai estimasi</dt>
                  <dd className="font-semibold tabular">{rupiah(active.valueEstimate)}</dd>
                </div>
                <div>
                  <dt className="text-caption text-muted-foreground">Skor</dt>
                  <dd className="font-semibold tabular">{active.score}/100</dd>
                </div>
              </dl>
              <p className="text-caption text-muted-foreground">Pesan masuk</p>
              <blockquote lang={active.language.toLowerCase()} className="mt-1 rounded-tile bg-surface-2 p-3 text-body">
                {active.message}
              </blockquote>
              <div className="mt-4 flex items-center gap-2">
                <p className="text-caption text-muted-foreground">Draft balasan</p>
                <AiTag label="Lead Qualifier" />
              </div>
              <p lang={active.language.toLowerCase()} className="mt-1 rounded-tile bg-ai-soft/60 p-3 text-body">
                {active.draftReply}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  disabled={sent.has(active.id)}
                  onClick={() => {
                    setSent((s) => new Set(s).add(active.id));
                    if (active.status === 'baru') setLeadStatus(active.id, 'dibalas');
                  }}
                >
                  {sent.has(active.id) ? 'Terkirim (simulasi)' : 'Setujui dan kirim'}
                </Button>
                <label className="flex items-center gap-2 text-body-sm">
                  Ubah status
                  <select value={active.status} onChange={(e) => setLeadStatus(active.id, e.target.value as LeadStatus)} className="rounded-full border border-input-border bg-card px-3 py-1.5">
                    {LEAD_STATUS_ORDER.map((s) => (
                      <option key={s} value={s}>
                        {LEAD_STATUS[s].label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="mt-3 text-caption text-muted-foreground">Status Menang mencatat order ke conversion ledger, lalu dikirim ke Meta dan Google lewat CAPI sebagai Purchase.</p>
            </Card>
          ) : null}
        </div>
      )}
    </>
  );
}

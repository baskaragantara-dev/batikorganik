'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { AiTag, Badge, Button, Card, CardTitle, Field, PageHeader, inputClass } from '@/components/ui';
import { rupiah } from '@/lib/format';
import { PLATFORM } from '@/lib/labels';
import { MARKETS } from '@/lib/mock/data';
import { campaignBriefSchema, simulateCampaignDraft, type SimulatedDraft } from '@/lib/domain/simulate';
import { useStore } from '@/lib/store';
import type { Funnel, MarketCode } from '@/lib/types';
import { cn } from '@/lib/utils';

type Errors = Partial<Record<'goal' | 'markets' | 'budgetMonthly' | 'start', string>>;

const EXAMPLES = [
  'Leads reseller dan butik modest fashion di Malaysia dan Brunei untuk koleksi lebaran',
  'Leads perusahaan yang butuh seragam batik ramah lingkungan untuk 2027',
  'Buyer B2B kain pewarna alami untuk butik di Swiss dan Jerman',
];

export default function NewCampaignPage() {
  const router = useRouter();
  const { addDraft, seq } = useStore();
  const [goal, setGoal] = useState('');
  const [funnel, setFunnel] = useState<Funnel>('b2c');
  const [markets, setMarkets] = useState<MarketCode[]>(['MY']);
  const [budget, setBudget] = useState('5000000');
  const [start, setStart] = useState('2026-11-15');
  const [errors, setErrors] = useState<Errors>({});
  const [draft, setDraft] = useState<SimulatedDraft | null>(null);
  const [shown, setShown] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  function toggleMarket(code: MarketCode) {
    setMarkets((m) => (m.includes(code) ? m.filter((x) => x !== code) : [...m, code]));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = campaignBriefSchema.safeParse({ goal, funnel, markets, budgetMonthly: Number(budget), start });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    const d = simulateCampaignDraft(parsed.data, seq, new Date().toISOString());
    setDraft(d);
    setShown(0);
    // Reveal one agent step at a time so reviewers see the order of work.
    timer.current = setInterval(() => {
      setShown((n) => {
        if (n + 1 >= d.steps.length && timer.current) clearInterval(timer.current);
        return n + 1;
      });
    }, 550);
  }

  function sendToApproval() {
    if (!draft) return;
    addDraft(draft);
    router.push('/approval');
  }

  const done = draft !== null && shown >= draft.steps.length;

  return (
    <>
      <PageHeader title="Campaign baru" sub="Tulis tujuan bisnis dengan bahasa biasa. Agent menyusun draft campaign, ads plan, dan brief konten. Tidak ada yang tayang sebelum Anda setujui." />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <CardTitle>1. Brief dari Owner</CardTitle>
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <Field label="Tujuan bisnis" htmlFor="goal" error={errors.goal} hint="Contoh di bawah bisa diklik.">
              <textarea id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} rows={3} className={inputClass} aria-invalid={Boolean(errors.goal)} />
            </Field>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button key={ex} type="button" onClick={() => setGoal(ex)} className="rounded-full bg-surface-2 px-3 py-1 text-left text-body-sm hover:bg-muted">
                  {ex}
                </button>
              ))}
            </div>

            <fieldset>
              <legend className="mb-1.5 text-body-sm font-semibold">Jenis funnel</legend>
              <div className="flex gap-2">
                {(['b2c', 'b2b'] as const).map((f) => (
                  <label key={f} className={cn('cursor-pointer rounded-full px-4 py-2 text-body-sm font-semibold ring-1 ring-inset', funnel === f ? 'bg-inverse text-inverse-foreground ring-inverse' : 'ring-input-border')}>
                    <input type="radio" name="funnel" value={f} checked={funnel === f} onChange={() => setFunnel(f)} className="sr-only" />
                    {f === 'b2c' ? 'B2C: konsumen' : 'B2B: perusahaan, butik, buyer'}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-1.5 text-body-sm font-semibold">Pasar (maksimal 4)</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {MARKETS.map((m) => {
                  const on = markets.includes(m.code);
                  return (
                    <label key={m.code} className={cn('flex cursor-pointer items-start gap-3 rounded-tile p-3 ring-1 ring-inset', on ? 'bg-accent ring-primary' : 'ring-border hover:bg-surface-2')}>
                      <input type="checkbox" checked={on} onChange={() => toggleMarket(m.code)} className="mt-1 accent-[var(--primary)]" />
                      <span>
                        <span className="block text-body font-semibold">
                          {m.country} <span className="text-caption text-muted-foreground">skor {m.score}</span>
                        </span>
                        <span className="block text-body-sm text-muted-foreground">{m.rationale}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
              {errors.markets ? (
                <p role="alert" className="mt-1 text-body-sm text-danger-text">
                  {errors.markets}
                </p>
              ) : null}
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Budget ads per bulan (Rp)" htmlFor="budget" error={errors.budgetMonthly} hint={Number(budget) > 0 ? rupiah(Number(budget)) : undefined}>
                <input id="budget" inputMode="numeric" value={budget} onChange={(e) => setBudget(e.target.value.replace(/\D/g, ''))} className={inputClass} />
              </Field>
              <Field label="Mulai" htmlFor="start" error={errors.start}>
                <input id="start" type="date" value={start} onChange={(e) => setStart(e.target.value)} className={inputClass} />
              </Field>
            </div>

            <Button type="submit" disabled={draft !== null && !done}>
              Minta agent menyusun draft
            </Button>
          </form>
        </Card>

        <Card aria-live="polite">
          <CardTitle action={<AiTag label="Simulasi agent" />} sub="Prototype ini belum memanggil AI. Isi draft dibuat dari template agar alurnya bisa direview.">
            2. Draft dari agent
          </CardTitle>
          {!draft ? (
            <p className="text-body text-muted-foreground">Draft akan muncul di sini setelah brief dikirim.</p>
          ) : (
            <div className="space-y-6">
              <ol className="space-y-2">
                {draft.steps.map((s, i) => (
                  <li key={s.agent} className={cn('flex items-start gap-3 text-body', i >= shown && 'opacity-40')}>
                    {i < shown ? <Check className="mt-0.5 size-4 text-success-text" aria-hidden /> : <Loader2 className={cn('mt-0.5 size-4', i === shown && 'animate-spin')} aria-hidden />}
                    <span>
                      <strong>{s.agent}</strong>
                      {i < shown ? <span className="block text-body-sm text-muted-foreground">{s.output}</span> : null}
                    </span>
                  </li>
                ))}
              </ol>

              {done ? (
                <>
                  <div className="rounded-tile bg-surface-2 p-4">
                    <p className="text-title">{draft.campaign.name}</p>
                    <p className="mt-1 text-body-sm text-muted-foreground">{draft.campaign.offer}</p>
                    <p className="mt-2 text-body-sm">
                      Target {draft.campaign.kpi.leadsTarget} leads, CPL awal {rupiah(draft.campaign.kpi.cplTarget)}. Angka ini dikoreksi Performance Analyst setelah tracking punya data.
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-body-sm font-semibold">Ads plan ({draft.ads.length})</p>
                    <ul className="space-y-2">
                      {draft.ads.map((a) => (
                        <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded-tile ring-1 ring-inset ring-border p-3 text-body-sm">
                          <span>
                            <strong>{PLATFORM[a.platform]}</strong> · {a.name} · {a.objective}
                          </span>
                          <Badge>{a.dailyBudget > 0 ? `${rupiah(a.dailyBudget)}/hari` : 'Tanpa spend'}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {draft.approval.complianceNote ? (
                    <p className="rounded-note bg-warning-soft px-3 py-2 text-body-sm text-warning-text">Compliance Guard: {draft.approval.complianceNote}</p>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={sendToApproval}>Kirim ke approval</Button>
                    <Button variant="secondary" onClick={() => setDraft(null)}>
                      Ubah brief
                    </Button>
                  </div>
                </>
              ) : null}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { AiTag, Badge, Card, CardTitle, Field, PageHeader, SimNote, inputClass } from '@/components/ui';
import { hppPerContent } from '@/lib/domain/capacity';
import { DEFAULT_ASSUMPTIONS, PACKAGES, monthlyCost } from '@/lib/domain/pricing';
import { date, number, percent, rupiah } from '@/lib/format';
import { STAGES } from '@/lib/labels';
import { useStore } from '@/lib/store';

const TIERS = [
  { id: 0, label: '0. Sekarang (manual)', perDay: 2, systemMonthly: 0, extraTeam: 0 },
  ...PACKAGES.map((p) => ({
    id: p.contentTier,
    label: `${p.contentTier}. ${p.name}`,
    perDay: p.outputPerDay,
    systemMonthly: monthlyCost(p.cost, DEFAULT_ASSUMPTIONS).total,
    extraTeam: p.contentTier === 3 ? 1 : 0, // tier 3 adds one editor
  })),
];

const FORMATS = ['Reels/TikTok', 'Video ads', 'Foto produk', 'Carousel', 'Story', 'Statis ads', 'Artikel SEO', 'Email', 'Broadcast WA', 'Katalog B2B'];

function CapacityCalculator() {
  const [tierId, setTierId] = useState(2);
  const [passRate, setPassRate] = useState(70);
  const [salary, setSalary] = useState('5000000');
  const tier = TIERS.find((t) => t.id === tierId) ?? TIERS[0]!;
  const people = 2 + tier.extraTeam;
  const result = useMemo(
    () =>
      hppPerContent({
        teamMonthlyIdr: people * (Number(salary) || 0),
        systemMonthlyIdr: tier.systemMonthly,
        theoreticalPerDay: tier.perDay,
        firstPassRate: passRate / 100,
        workDays: 22,
      }),
    [people, salary, tier, passRate],
  );
  const baseline = hppPerContent({ teamMonthlyIdr: 2 * (Number(salary) || 0), systemMonthlyIdr: 0, theoreticalPerDay: 2, firstPassRate: 1, workDays: 22 });
  const saving = baseline.hppPerContent > 0 ? 1 - result.hppPerContent / baseline.hppPerContent : 0;

  return (
    <Card>
      <CardTitle sub="Revisi memakan slot output baru, jadi output efektif = output teoretis ÷ (1 + tingkat revisi). 22 hari kerja per bulan.">Kalkulator kapasitas dan HPP konten</CardTitle>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="Tingkat" htmlFor="tier">
          <select id="tier" value={tierId} onChange={(e) => setTierId(Number(e.target.value))} className={inputClass}>
            {TIERS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label={`Lolos approval pertama: ${passRate}%`} htmlFor="pass" hint="Sisanya butuh satu kali revisi.">
          <input id="pass" type="range" min={40} max={100} step={5} value={passRate} onChange={(e) => setPassRate(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
        </Field>
        <Field label="Gaji per orang per bulan (Rp)" htmlFor="salary" hint="Asumsi. Ganti dengan angka sebenarnya.">
          <input id="salary" inputMode="numeric" value={salary} onChange={(e) => setSalary(e.target.value.replace(/\D/g, ''))} className={inputClass} />
        </Field>
      </div>
      <dl className="mt-5 grid gap-3 sm:grid-cols-4">
        <div className="rounded-tile bg-surface-2 p-4">
          <dt className="text-caption text-muted-foreground">Output per hari</dt>
          <dd className="text-value tabular">
            {Math.round(result.outputPerMonth / 22)} <span className="text-body-sm text-muted-foreground">dari {tier.perDay}</span>
          </dd>
        </div>
        <div className="rounded-tile bg-surface-2 p-4">
          <dt className="text-caption text-muted-foreground">Output per bulan</dt>
          <dd className="text-value tabular">{number(result.outputPerMonth)}</dd>
        </div>
        <div className="rounded-tile bg-surface-2 p-4">
          <dt className="text-caption text-muted-foreground">Biaya tim + sistem</dt>
          <dd className="text-value tabular">{rupiah(result.monthlyTotal)}</dd>
          <dd className="text-caption text-muted-foreground">{people} orang</dd>
        </div>
        <div className="rounded-tile bg-inverse p-4 text-inverse-foreground">
          <dt className="text-caption text-inverse-subtle">HPP per konten</dt>
          <dd className="text-value tabular">{rupiah(result.hppPerContent)}</dd>
          <dd className="text-caption text-inverse-secondary">{tierId === 0 ? 'Baseline' : `${percent(saving)} lebih murah dari manual`}</dd>
        </div>
      </dl>
      <p className="mt-4 text-body-sm text-muted-foreground">
        Render video AI biasanya butuh 2 sampai 3 percobaan per klip yang layak. Karena itu script dan storyboard disetujui dulu sebelum render, agar revisi terjadi di tahap teks yang hampir gratis.
      </p>
    </Card>
  );
}

export default function ContentPage() {
  const { content, campaigns } = useStore();
  const name = (id: string) => campaigns.find((c) => c.id === id)?.name ?? '';
  return (
    <>
      <PageHeader title="Content Studio" sub="Satu aset master dari kreator dipecah agent menjadi banyak varian: potongan durasi, rasio, hook, dan bahasa. Kreator fokus syuting dan editing." />
      <div className="mb-6">
        <SimNote />
      </div>

      <div className="mb-6 -mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        <div className="grid min-w-[1100px] grid-cols-6 gap-3">
          {STAGES.map((s) => {
            const items = content.filter((x) => x.stage === s.key);
            return (
              <section key={s.key} aria-label={s.label} className="rounded-lg bg-muted/60 p-3">
                <h2 className="mb-3 flex items-center justify-between text-body font-semibold">
                  {s.label} <span className="text-caption text-muted-foreground tabular">{items.length}</span>
                </h2>
                <ul className="space-y-2">
                  {items.map((x) => (
                    <li key={x.id} className="rounded-tile bg-card p-3">
                      <p className="text-body-sm font-semibold">{x.title}</p>
                      <p className="mt-1 text-caption text-muted-foreground">{name(x.campaignId)}</p>
                      <p className="mt-2 text-body-sm italic">“{x.hook}”</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <Badge>{x.format}</Badge>
                        <Badge>{x.language}</Badge>
                        {x.variants > 0 ? <Badge tone="info">{x.variants} varian</Badge> : null}
                        {x.aiAssisted ? <AiTag /> : null}
                      </div>
                      <p className="mt-2 text-caption text-muted-foreground">
                        {x.owner} · tenggat {date(x.dueDate)}
                      </p>
                    </li>
                  ))}
                  {items.length === 0 ? <li className="text-body-sm text-muted-foreground">Kosong</li> : null}
                </ul>
              </section>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <CapacityCalculator />
        </div>
        <Card>
          <CardTitle sub="Semua format tersedia sebagai opsi. Paket menentukan kuota output, bukan format.">Format yang didukung</CardTitle>
          <ul className="flex flex-wrap gap-2">
            {FORMATS.map((f) => (
              <li key={f}>
                <Badge>{f}</Badge>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-body-sm text-muted-foreground">Gambar dan video pendukung dibuat lewat Higgsfield oleh Creative Producer. Motif batik asli tidak boleh diubah AI: produk selalu dari foto atau video asli.</p>
        </Card>
      </div>
    </>
  );
}

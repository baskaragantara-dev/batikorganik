import type { DailyMetric } from '@/lib/types';
import { date, number, rupiahShort } from '@/lib/format';

/** Leads per day as bars with the daily spend as a line, both against the same days. */
export function LeadsSpendChart({ data }: { data: DailyMetric[] }) {
  const W = 640;
  const H = 220;
  const pad = { l: 32, r: 72, t: 16, b: 28 };
  const maxLeads = Math.max(1, ...data.map((d) => d.leads));
  const maxSpend = Math.max(1, ...data.map((d) => d.spend));
  const step = (W - pad.l - pad.r) / data.length;
  const barW = Math.max(6, step * 0.55);
  const y = (v: number, max: number) => pad.t + (H - pad.t - pad.b) * (1 - v / max);
  const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${pad.l + step * i + step / 2} ${y(d.spend, maxSpend * 1.15)}`).join(' ');
  const ticks = Array.from({ length: maxLeads + 1 }, (_, i) => i).filter((v) => maxLeads <= 5 || v % 2 === 0);
  const first = data.at(0);
  const last = data.at(-1);

  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Leads per hari dan spend harian, 14 hari terakhir">
        {ticks.map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={y(v, maxLeads)} y2={y(v, maxLeads)} stroke="var(--border)" />
            <text x={pad.l - 8} y={y(v, maxLeads) + 4} textAnchor="end" fontSize="11" fill="var(--muted-foreground)">
              {v}
            </text>
          </g>
        ))}
        {data.map((d, i) => (
          <rect key={d.date} x={pad.l + step * i + (step - barW) / 2} y={y(d.leads, maxLeads)} width={barW} height={H - pad.b - y(d.leads, maxLeads)} rx="4" fill="var(--chart-1)">
            <title>{`${date(d.date)}: ${d.leads} leads, spend ${rupiahShort(d.spend)}`}</title>
          </rect>
        ))}
        <path d={line} fill="none" stroke="var(--chart-2)" strokeWidth="2" />
        <text x={W - pad.r + 6} y={y(maxSpend, maxSpend * 1.15) + 4} fontSize="11" fill="var(--muted-foreground)">
          {rupiahShort(maxSpend)}
        </text>
        {first ? (
          <text x={pad.l} y={H - 8} fontSize="11" fill="var(--muted-foreground)">
            {date(first.date)}
          </text>
        ) : null}
        {last ? (
          <text x={W - pad.r} y={H - 8} textAnchor="end" fontSize="11" fill="var(--muted-foreground)">
            {date(last.date)}
          </text>
        ) : null}
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-4 text-caption text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-chart-1" aria-hidden /> Leads per hari (sumbu kiri)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-chart-2" aria-hidden /> Spend harian (puncak {rupiahShort(maxSpend)})
        </span>
        <span>Total {number(data.reduce((s, d) => s + d.leads, 0))} leads</span>
      </figcaption>
    </figure>
  );
}

export function Progress({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

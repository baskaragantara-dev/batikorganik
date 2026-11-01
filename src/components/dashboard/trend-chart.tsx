import type { TrendPoint } from "@/domain/dashboard/types";

const W = 320;
const H = 140;
const PAD = { top: 28, right: 12, bottom: 24, left: 12 };

/** Catmull-Rom to cubic Bezier, so the line reads smooth like the reference without a chart library. */
function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  const [first] = points;
  if (!first) return "";
  let d = `M${first.x},${first.y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }
  return d;
}

/** Leads per bucket for the selected period. Orders are shown in the tiles, not on this scale. */
export function TrendChart({ data, caption }: { data: TrendPoint[]; caption: string }) {
  const max = Math.max(1, ...data.map((d) => d.leads));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const step = data.length > 1 ? innerW / (data.length - 1) : 0;
  const pts = data.map((d, i) => ({
    x: PAD.left + i * step,
    y: PAD.top + innerH - (d.leads / max) * innerH,
  }));
  const last = pts.at(-1);
  const lastValue = data.at(-1)?.leads ?? 0;
  const line = smoothPath(pts);
  const area = last ? `${line} L${last.x},${PAD.top + innerH} L${PAD.left},${PAD.top + innerH} Z` : "";

  return (
    <figure className="flex flex-col gap-1">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={caption}>
        {[0, 0.5, 1].map((t) => (
          <line
            key={t}
            x1={PAD.left}
            x2={W - PAD.right}
            y1={PAD.top + innerH * t}
            y2={PAD.top + innerH * t}
            stroke="var(--color-ink)"
            strokeOpacity={0.08}
          />
        ))}
        <path d={area} fill="var(--color-surface)" fillOpacity={0.45} />
        <path d={line} fill="none" stroke="var(--color-ink)" strokeWidth={2} strokeLinecap="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="var(--color-ink)" />
        ))}
        {last ? (
          <g transform={`translate(${Math.min(last.x, W - 40)},${Math.max(last.y - 22, 4)})`}>
            <rect x={-22} y={0} width={44} height={18} rx={9} fill="var(--color-butter)" />
            <text x={0} y={12.5} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--color-ink)">
              {lastValue}
            </text>
          </g>
        ) : null}
        {data.map((d, i) => (
          <text
            key={d.label}
            x={PAD.left + i * step}
            y={H - 6}
            textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"}
            fontSize={11}
            fill="var(--color-ink-muted)"
          >
            {d.label}
          </text>
        ))}
      </svg>
      <figcaption className="sr-only">{caption}</figcaption>
    </figure>
  );
}

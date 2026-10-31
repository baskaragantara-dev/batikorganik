import type { Metadata } from 'next';
import { Badge, Card, CardTitle, PageHeader, SimNote, Table, td, th } from '@/components/ui';
import { dateTime, number, rupiah } from '@/lib/format';
import { AGENTS, AGENT_RUNS } from '@/lib/mock/data';

export const metadata: Metadata = { title: 'Agent' };

const GATE = {
  approval: { label: 'Butuh approval', tone: 'warning' as const },
  otomatis: { label: 'Gate otomatis', tone: 'info' as const },
  baca: { label: 'Bahan baca', tone: 'neutral' as const },
};

export default function AgentPage() {
  const runs = AGENTS.reduce((s, a) => s + a.runsToday, 0);
  const cost = AGENTS.reduce((s, a) => s + a.costTodayIdr, 0);
  return (
    <>
      <PageHeader title="Agent" sub="14 agent: 9 yang disepakati dan 5 tambahan. Agent hanya membuat draft dan rekomendasi. Publish, belanja budget, dan pesan ke pelanggan selalu lewat approval manusia." />
      <div className="mb-6">
        <SimNote>Jumlah run dan biaya adalah contoh. Biaya nyata tercatat per run setelah agent terhubung ke model AI.</SimNote>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-caption text-muted-foreground">Run hari ini</p>
          <p className="mt-2 text-kpi-sm tabular">{number(runs)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-caption text-muted-foreground">Biaya AI hari ini</p>
          <p className="mt-2 text-kpi-sm tabular">{rupiah(cost)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-caption text-muted-foreground">Batas biaya AI bulanan</p>
          <p className="mt-2 text-kpi-sm tabular">{rupiah(1_000_000)}</p>
          <p className="mt-1 text-body-sm text-muted-foreground">Agent berhenti dan memberi tahu Owner bila batas tercapai.</p>
        </Card>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {AGENTS.map((a) => (
          <Card key={a.id} className="p-5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-title">{a.name}</p>
              <Badge tone={a.status === 'tambahan' ? 'info' : 'neutral'}>{a.status === 'tambahan' ? 'Tambahan' : 'Disepakati'}</Badge>
            </div>
            <p className="mt-1 text-body-sm text-muted-foreground">{a.role}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-body-sm">
              <Badge tone={GATE[a.gate].tone}>{GATE[a.gate].label}</Badge>
              <span className="tabular text-muted-foreground">
                {a.runsToday} run · {rupiah(a.costTodayIdr)}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardTitle sub="Setiap run tercatat: agent, tugas, durasi, biaya, dan hasil. Run yang ditolak gate otomatis tidak sampai ke approver.">Riwayat run</CardTitle>
        <Table label="Riwayat run agent">
          <thead>
            <tr>
              <th className={th}>Waktu</th>
              <th className={th}>Agent</th>
              <th className={th}>Tugas</th>
              <th className={th}>Durasi</th>
              <th className={th}>Biaya</th>
              <th className={th}>Hasil</th>
            </tr>
          </thead>
          <tbody>
            {AGENT_RUNS.map((r) => (
              <tr key={r.id}>
                <td className={`${td} whitespace-nowrap`}>{dateTime(r.at)}</td>
                <td className={td}>{AGENTS.find((a) => a.id === r.agentId)?.name}</td>
                <td className={td}>{r.task}</td>
                <td className={`${td} tabular`}>{r.durationSec} dtk</td>
                <td className={`${td} tabular`}>{rupiah(r.costIdr)}</td>
                <td className={td}>
                  <Badge tone={r.status === 'selesai' ? 'success' : r.status === 'gagal' ? 'danger' : 'warning'}>{r.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </>
  );
}

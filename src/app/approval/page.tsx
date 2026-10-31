'use client';

import { useMemo, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { AiTag, Badge, Button, Card, EmptyState, PageHeader, SimNote, inputClass } from '@/components/ui';
import { dateTime } from '@/lib/format';
import { APPROVAL_KIND, APPROVAL_STATUS, RISK } from '@/lib/labels';
import { useStore } from '@/lib/store';
import type { ApprovalKind, ApprovalStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const TABS: { key: ApprovalStatus; label: string }[] = [
  { key: 'menunggu', label: 'Menunggu' },
  { key: 'disetujui', label: 'Disetujui' },
  { key: 'ditolak', label: 'Ditolak' },
];

export default function ApprovalPage() {
  const { approvals, decide } = useStore();
  const [tab, setTab] = useState<ApprovalStatus>('menunggu');
  const [kind, setKind] = useState<ApprovalKind | 'semua'>('semua');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [rejecting, setRejecting] = useState<string[] | null>(null);
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  const list = useMemo(() => approvals.filter((a) => a.status === tab && (kind === 'semua' || a.kind === kind)), [approvals, tab, kind]);
  const pendingIds = list.filter((a) => a.status === 'menunggu').map((a) => a.id);
  const allSelected = pendingIds.length > 0 && pendingIds.every((id) => selected.has(id));

  function toggle(id: string) {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  function approve(ids: string[]) {
    decide(ids, 'disetujui');
    setSelected(new Set());
  }

  function confirmReject() {
    if (!rejecting) return;
    if (reason.trim().length < 5) {
      setReasonError('Tulis alasan minimal 5 karakter. Alasan ini dikirim ke agent untuk revisi.');
      return;
    }
    decide(rejecting, 'ditolak', reason.trim());
    setRejecting(null);
    setReason('');
    setReasonError('');
    setSelected(new Set());
  }

  return (
    <>
      <PageHeader title="Approval" sub="Satu antrean untuk semua yang butuh keputusan manusia: campaign, ads, konten, budget, dan balasan ke lead. Draft yang gagal di gate otomatis tidak sampai ke sini." />
      <div className="mb-6">
        <SimNote>Keputusan Anda tersimpan di browser ini saja dan bisa dikembalikan lewat Reset data demo.</SimNote>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div role="tablist" aria-label="Status" className="flex gap-1 rounded-full bg-card p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              type="button"
              aria-selected={tab === t.key}
              onClick={() => {
                setTab(t.key);
                setSelected(new Set());
              }}
              className={cn('rounded-full px-4 py-1.5 text-body-sm font-semibold', tab === t.key ? 'bg-inverse text-inverse-foreground' : 'hover:bg-muted')}
            >
              {t.label} <span className="tabular">({approvals.filter((a) => a.status === t.key).length})</span>
            </button>
          ))}
        </div>
        <label className="ml-auto flex items-center gap-2 text-body-sm">
          Jenis
          <select value={kind} onChange={(e) => setKind(e.target.value as ApprovalKind | 'semua')} className="rounded-full border border-input-border bg-card px-3 py-1.5">
            <option value="semua">Semua</option>
            {(Object.keys(APPROVAL_KIND) as ApprovalKind[]).map((k) => (
              <option key={k} value={k}>
                {APPROVAL_KIND[k]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {tab === 'menunggu' && pendingIds.length > 0 ? (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl bg-card px-4 py-3">
          <label className="flex items-center gap-2 text-body-sm font-semibold">
            <input type="checkbox" checked={allSelected} onChange={() => setSelected(allSelected ? new Set() : new Set(pendingIds))} className="accent-[var(--primary)]" />
            Pilih semua
          </label>
          <span className="text-body-sm text-muted-foreground">{selected.size} dipilih</span>
          <div className="ml-auto flex gap-2">
            <Button size="sm" disabled={selected.size === 0} onClick={() => approve([...selected])}>
              Setujui terpilih
            </Button>
            <Button size="sm" variant="secondary" disabled={selected.size === 0} onClick={() => setRejecting([...selected])}>
              Tolak terpilih
            </Button>
          </div>
        </div>
      ) : null}

      {rejecting ? (
        <Card className="mb-4 ring-2 ring-danger-solid">
          <p className="text-title">Tolak {rejecting.length} item</p>
          <p className="mb-3 text-body-sm text-muted-foreground">Alasan dikirim ke agent pembuatnya agar draft berikutnya diperbaiki.</p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            className={inputClass}
            aria-label="Alasan penolakan"
            aria-invalid={Boolean(reasonError)}
            placeholder="Contoh: hook terlalu umum, tampilkan harga dalam MYR"
          />
          {reasonError ? (
            <p role="alert" className="mt-1 text-body-sm text-danger-text">
              {reasonError}
            </p>
          ) : null}
          <div className="mt-3 flex gap-2">
            <Button variant="danger" size="sm" onClick={confirmReject}>
              Tolak dan kirim alasan
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setRejecting(null)}>
              Batal
            </Button>
          </div>
        </Card>
      ) : null}

      {list.length === 0 ? (
        <EmptyState title={tab === 'menunggu' ? 'Tidak ada yang menunggu keputusan.' : 'Belum ada item di sini.'}>
          {tab === 'menunggu' ? 'Buat campaign baru untuk melihat draft agent masuk ke antrean ini.' : null}
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {list.map((a) => (
            <li key={a.id}>
              <Card className="p-5">
                <div className="flex flex-wrap items-start gap-3">
                  {a.status === 'menunggu' ? (
                    <input type="checkbox" checked={selected.has(a.id)} onChange={() => toggle(a.id)} className="mt-1.5 accent-[var(--primary)]" aria-label={`Pilih ${a.title}`} />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="dark">{APPROVAL_KIND[a.kind]}</Badge>
                      <Badge tone={RISK[a.risk].tone}>{RISK[a.risk].label}</Badge>
                      <AiTag label={a.requestedBy} />
                      {a.status !== 'menunggu' ? <Badge tone={APPROVAL_STATUS[a.status].tone}>{APPROVAL_STATUS[a.status].label}</Badge> : null}
                    </div>
                    <p className="mt-2 text-title">{a.title}</p>
                    <p className="text-body text-muted-foreground">{a.summary}</p>
                    {a.preview ? <p className="mt-2 rounded-note bg-surface-2 px-3 py-2 text-body-sm">{a.preview}</p> : null}
                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-body-sm">
                      <span>
                        Brand fit <strong className="tabular">{a.brandScore}</strong>/100
                      </span>
                      <span>{a.complianceNote ? 'Compliance: ada catatan' : 'Compliance: lolos'}</span>
                      <span className="text-muted-foreground">{dateTime(a.createdAt)}</span>
                    </div>
                    {a.complianceNote ? (
                      <p className="mt-2 flex items-start gap-2 rounded-note bg-warning-soft px-3 py-2 text-body-sm text-warning-text">
                        <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                        {a.complianceNote}
                      </p>
                    ) : null}
                    {a.reason ? <p className="mt-2 text-body-sm text-danger-text">Alasan ditolak: {a.reason}</p> : null}
                  </div>
                  {a.status === 'menunggu' ? (
                    <div className="flex w-full gap-2 sm:w-auto">
                      <Button size="sm" onClick={() => approve([a.id])}>
                        Setujui
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => setRejecting([a.id])}>
                        Tolak
                      </Button>
                    </div>
                  ) : null}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

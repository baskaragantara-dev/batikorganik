"use client";

import { useState } from "react";
import { checkCanDecide } from "@/domain/approvals/policy";
import { countByStatus, pendingByPriority } from "@/domain/approvals/priority";
import { KIND_LABEL } from "@/domain/approvals/labels";
import type { ApprovalItem, ApprovalStatus, Member } from "@/domain/approvals/types";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { CheckCircleIcon } from "@/components/ui/icons";
import { StatePanel } from "@/components/ui/state-panel";
import { useDecisions } from "./decisions-store";
import { DecisionCard } from "./decision-card";
import { RejectDialog } from "./reject-dialog";
import { useDecisionFlow } from "./use-decision-flow";

const TABS: { status: ApprovalStatus; label: string }[] = [
  { status: "pending", label: "Menunggu" },
  { status: "approved", label: "Disetujui" },
  { status: "rejected", label: "Ditolak" },
];

const EMPTY_TEXT: Record<ApprovalStatus, string> = {
  pending: "Tidak ada draft yang menunggu keputusan.",
  approved: "Belum ada permintaan yang disetujui.",
  rejected: "Belum ada permintaan yang ditolak.",
};

const decidedFmt = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});

/** APR-01 (tabs with counts) and APR-03 (per item or batch decisions). */
export function ApprovalQueue({
  approvals,
  members,
  currentMember,
  now,
  simulateFailure,
}: {
  approvals: ApprovalItem[];
  members: Member[];
  currentMember: Member;
  now: string;
  simulateFailure: boolean;
}) {
  const { apply } = useDecisions();
  const flow = useDecisionFlow(simulateFailure);
  const [tab, setTab] = useState<ApprovalStatus>("pending");
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());

  const items = apply(approvals);
  const counts = countByStatus(items);
  const nowDate = new Date(now);
  const pending = pendingByPriority(items);
  const decidable = pending.filter((i) => checkCanDecide(i, currentMember, members).allowed);
  // Drop selections that were decided meanwhile.
  const selectedItems = decidable.filter((i) => selected.has(i.id));
  const allSelected = decidable.length > 0 && selectedItems.length === decidable.length;
  const shown = tab === "pending" ? pending : items.filter((i) => i.status === tab);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function approveSelected() {
    if (await flow.approve(selectedItems)) setSelected(new Set());
  }

  async function confirmReject(reason: string) {
    if ((await flow.confirmReject(reason)) && flow.rejecting && flow.rejecting.length > 1) setSelected(new Set());
  }

  return (
    <div className="flex flex-col gap-5">
      <div role="tablist" aria-label="Status approval" className="grid grid-cols-3 gap-2 lg:flex lg:w-fit lg:rounded-full lg:bg-surface lg:p-1">
        {TABS.map(({ status, label }) => {
          const active = tab === status;
          return (
            <button
              key={status}
              role="tab"
              type="button"
              id={`tab-${status}`}
              aria-selected={active}
              aria-controls="approval-panel"
              onClick={() => setTab(status)}
              className={`flex min-h-11 items-center justify-center gap-1.5 rounded-full px-2 text-sm font-semibold ${
                active ? "bg-ink text-surface" : "bg-surface text-ink-soft lg:bg-transparent"
              }`}
            >
              {label}
              <span className={`rounded-full px-2 text-xs ${active ? "bg-surface/20" : "bg-surface-deep"}`}>
                {counts[status]}
              </span>
            </button>
          );
        })}
      </div>

      <div id="approval-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="flex flex-col gap-3">
        {tab === "pending" && decidable.length > 1 ? (
          <label className="flex min-h-11 items-center gap-3 px-1 text-sm font-semibold text-ink-soft">
            <input
              type="checkbox"
              className="size-5 accent-ink"
              checked={allSelected}
              onChange={() => setSelected(allSelected ? new Set() : new Set(decidable.map((i) => i.id)))}
            />
            Pilih semua yang bisa Anda putuskan ({decidable.length})
          </label>
        ) : null}

        {shown.length === 0 ? (
          <StatePanel icon={<CheckCircleIcon width={24} height={24} />} title="Kosong">
            {EMPTY_TEXT[tab]}
          </StatePanel>
        ) : (
          <ul className="flex flex-col gap-3">
            {shown.map((item) =>
              tab === "pending" ? (
                <li key={item.id}>
                  <DecisionCard
                    item={item}
                    now={nowDate}
                    check={checkCanDecide(item, currentMember, members)}
                    busy={flow.isBusy(item.id)}
                    onApprove={() => flow.approve([item])}
                    onReject={() => flow.startReject([item])}
                    leading={
                      decidable.includes(item) ? (
                        <input
                          type="checkbox"
                          aria-label={`Pilih ${item.title}`}
                          className="mt-0.5 size-5 shrink-0 accent-ink"
                          checked={selected.has(item.id)}
                          onChange={() => toggle(item.id)}
                        />
                      ) : null
                    }
                  />
                </li>
              ) : (
                <li key={item.id} className="flex flex-col gap-2 rounded-card bg-surface p-5">
                  <p className="text-xs font-semibold tracking-wide text-ink-muted uppercase">
                    {KIND_LABEL[item.kind]} · {item.agent}
                  </p>
                  <h3 className="font-semibold">{item.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                    <Chip tone={item.status === "approved" ? "success" : "danger"}>
                      {item.status === "approved" ? "Disetujui" : "Ditolak"}
                    </Chip>
                    {item.decidedAt ? decidedFmt.format(new Date(item.decidedAt)) : null}
                  </div>
                  {item.decisionReason ? (
                    <p className="rounded-tile bg-surface-deep p-3 text-sm text-ink-soft">
                      Alasan: {item.decisionReason}
                    </p>
                  ) : null}
                </li>
              ),
            )}
          </ul>
        )}
      </div>

      {tab === "pending" && selectedItems.length > 0 ? (
        <div className="fixed inset-x-0 z-30 px-4 bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] lg:bottom-6">
          <div className="mx-auto flex max-w-xl items-center gap-2 rounded-full bg-ink p-2 pl-5 text-surface shadow-sheet">
            <span className="flex-1 text-sm font-semibold">{selectedItems.length} dipilih</span>
            <Button variant="inverse-outline" onClick={() => flow.startReject(selectedItems)}>
              Tolak
            </Button>
            <Button variant="inverse" onClick={approveSelected}>
              Setujui
            </Button>
          </div>
        </div>
      ) : null}

      <RejectDialog
        open={flow.rejecting !== null}
        subject={
          flow.rejecting && flow.rejecting.length > 1
            ? `${flow.rejecting.length} permintaan. Alasan yang sama dikirim ke setiap agent.`
            : (flow.rejecting?.[0]?.title ?? "")
        }
        busy={flow.rejectBusy}
        onCancel={flow.cancelReject}
        onConfirm={confirmReject}
      />
    </div>
  );
}

"use client";

import Link from "next/link";
import { checkCanDecide } from "@/domain/approvals/policy";
import { DASHBOARD_DECISION_LIMIT, pendingByPriority } from "@/domain/approvals/priority";
import type { ApprovalItem, Member } from "@/domain/approvals/types";
import { CheckCircleIcon, ArrowRightIcon } from "@/components/ui/icons";
import { StatePanel } from "@/components/ui/state-panel";
import { useDecisions } from "./decisions-store";
import { DecisionCard } from "./decision-card";
import { RejectDialog } from "./reject-dialog";
import { useDecisionFlow } from "./use-decision-flow";

/** DSH-01: "Perlu keputusan Anda", top 5 by risk and deadline, with direct approve/reject. */
export function DecisionSection({
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
  const pending = pendingByPriority(apply(approvals));
  const top = pending.slice(0, DASHBOARD_DECISION_LIMIT);
  const nowDate = new Date(now);

  return (
    <section aria-labelledby="perlu-keputusan" className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="perlu-keputusan" className="font-display text-2xl font-medium">
          Perlu keputusan Anda
          {pending.length > 0 ? (
            <span className="ml-2 align-middle font-sans text-sm font-semibold text-ink-muted">{pending.length}</span>
          ) : null}
        </h2>
        {pending.length > 0 ? (
          <Link href="/approval" className="flex shrink-0 items-center gap-1 text-sm font-semibold text-ink">
            Semua <ArrowRightIcon width={16} height={16} />
          </Link>
        ) : null}
      </div>

      {top.length === 0 ? (
        <StatePanel icon={<CheckCircleIcon width={24} height={24} />} title="Semua sudah diputuskan">
          Tidak ada draft yang menunggu. Draft baru dari agent akan muncul di sini.
        </StatePanel>
      ) : (
        <ul className="flex flex-col gap-3">
          {top.map((item) => (
            <li key={item.id}>
              <DecisionCard
                item={item}
                now={nowDate}
                check={checkCanDecide(item, currentMember, members)}
                busy={flow.isBusy(item.id)}
                onApprove={() => flow.approve([item])}
                onReject={() => flow.startReject([item])}
                compact
              />
            </li>
          ))}
        </ul>
      )}

      {pending.length > top.length ? (
        <Link
          href="/approval"
          className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-hairline text-sm font-semibold"
        >
          Lihat {pending.length - top.length} permintaan lain <ArrowRightIcon width={16} height={16} />
        </Link>
      ) : null}

      <RejectDialog
        open={flow.rejecting !== null}
        subject={flow.rejecting?.[0]?.title ?? ""}
        busy={flow.rejectBusy}
        onCancel={flow.cancelReject}
        onConfirm={flow.confirmReject}
      />
    </section>
  );
}

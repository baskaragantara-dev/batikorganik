"use client";

import type { ReactNode } from "react";
import type { DecideCheck } from "@/domain/approvals/policy";
import { KIND_LABEL, RISK_LABEL } from "@/domain/approvals/labels";
import type { ApprovalItem, RiskLevel } from "@/domain/approvals/types";
import { describeDeadline, formatIdr } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Chip, type ChipTone } from "@/components/ui/chip";
import { ShieldIcon, SparkIcon } from "@/components/ui/icons";

const RISK_TONE: Record<RiskLevel, ChipTone> = { high: "danger", medium: "butter", low: "neutral" };

export function DecisionCard({
  item,
  now,
  check,
  busy,
  onApprove,
  onReject,
  compact = false,
  leading,
}: {
  item: ApprovalItem;
  now: Date;
  check: DecideCheck;
  busy: boolean;
  onApprove: () => void;
  onReject: () => void;
  /** Dashboard mode: fewer chips and clamped text, details live in the Approval tab. */
  compact?: boolean;
  /** Slot for a selection checkbox in the full queue. */
  leading?: ReactNode;
}) {
  const deadline = describeDeadline(item.deadline, now);
  const titleId = `apr-${item.id}-title`;

  return (
    <article aria-labelledby={titleId} aria-busy={busy} className="flex gap-3 rounded-card bg-surface p-5">
      {leading}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-ink-muted uppercase">
          <SparkIcon width={14} height={14} />
          {KIND_LABEL[item.kind]} · {item.agent}
        </p>
        <h3 id={titleId} className="text-base leading-snug font-semibold">
          {item.title}
        </h3>
        <p className={`text-sm text-ink-soft ${compact ? "line-clamp-2" : ""}`}>{item.summary}</p>

        <div className="flex flex-wrap gap-1.5">
          <Chip tone={RISK_TONE[item.risk]}>{RISK_LABEL[item.risk]}</Chip>
          <Chip tone={deadline.overdue || deadline.dueToday ? "butter" : "neutral"}>
            {deadline.overdue ? deadline.text : `Tenggat ${deadline.text.toLowerCase()}`}
          </Chip>
          {compact ? null : <Chip tone="sky">Brand fit {item.brandFit}</Chip>}
          {item.amountIdr !== undefined ? <Chip>{formatIdr(item.amountIdr)}</Chip> : null}
        </div>

        {item.compliance.level !== "ok" ? (
          <p
            className={`flex gap-2 rounded-tile p-3 text-sm ${
              item.compliance.level === "blocker" ? "bg-danger-quiet text-danger" : "bg-warning-quiet text-warning"
            }`}
          >
            <ShieldIcon className="mt-0.5 shrink-0" width={18} height={18} />
            <span className={compact ? "line-clamp-3" : undefined}>
              <strong className="font-semibold">
                {item.compliance.level === "blocker" ? "Compliance: wajib diperbaiki. " : "Compliance: perlu dicek. "}
              </strong>
              {item.compliance.text}
            </span>
          </p>
        ) : null}

        {check.allowed ? (
          <div className="flex flex-col gap-2">
            {check.selfApproved ? (
              <p className="text-xs text-ink-muted">
                Anda satu-satunya penyetuju, jadi keputusan ini dicatat sebagai self-approved.
              </p>
            ) : null}
            <div className="flex gap-2">
              <Button className="flex-1" onClick={onApprove} disabled={busy}>
                {busy ? "Menyimpan…" : "Setujui"}
              </Button>
              <Button variant="secondary" className="flex-1" onClick={onReject} disabled={busy}>
                Tolak
              </Button>
            </div>
          </div>
        ) : (
          <p className="rounded-tile bg-surface-deep p-3 text-sm text-ink-soft">{check.reason}</p>
        )}
      </div>
    </article>
  );
}

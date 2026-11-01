import type { ReactNode } from "react";

export type ChipTone = "neutral" | "soga" | "indigo" | "danger" | "warning" | "success";

const TONE: Record<ChipTone, string> = {
  neutral: "bg-surface-deep text-ink-soft",
  soga: "bg-soga-quiet text-soga-deep",
  indigo: "bg-indigo-quiet text-indigo-deep",
  danger: "bg-danger-quiet text-danger",
  warning: "bg-warning-quiet text-warning",
  success: "bg-success-quiet text-success",
};

export function Chip({ tone = "neutral", children }: { tone?: ChipTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap ${TONE[tone]}`}
    >
      {children}
    </span>
  );
}

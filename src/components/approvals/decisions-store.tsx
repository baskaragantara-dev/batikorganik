"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { ApprovalItem, Decision } from "@/domain/approvals/types";

interface LocalDecision {
  status: Decision;
  reason?: string;
  decidedAt: string;
}

type Toast = { id: number; tone: "success" | "error"; text: string };

interface DecisionsContextValue {
  /** Server items with this session's local decisions applied. */
  apply: (items: readonly ApprovalItem[]) => ApprovalItem[];
  isBusy: (id: string) => boolean;
  decide: (input: {
    items: readonly ApprovalItem[];
    decision: Decision;
    reason?: string;
    simulateFailure?: boolean;
  }) => Promise<boolean>;
  toast: Toast | null;
  dismissToast: () => void;
}

const DecisionsContext = createContext<DecisionsContextValue | null>(null);

/**
 * Prototype stand-in for the approvals RPC. R1 replaces this with a server action
 * that calls a security-definer RPC (approve/reject + audit log) behind RLS.
 */
async function submitDecisionMock(simulateFailure: boolean): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  if (simulateFailure) throw new Error("Mock approval service rejected the request (demo=action-error).");
}

function summarize(items: readonly ApprovalItem[]): string {
  if (items.length === 1 && items[0]) return items[0].title;
  return `${items.length} permintaan`;
}

export function DecisionsProvider({ children }: { children: ReactNode }) {
  const [decisions, setDecisions] = useState<Record<string, LocalDecision>>({});
  const [busy, setBusy] = useState<ReadonlySet<string>>(new Set());
  const [toast, setToast] = useState<Toast | null>(null);
  const toastSeq = useRef(0);

  const showToast = useCallback((tone: Toast["tone"], text: string) => {
    toastSeq.current += 1;
    setToast({ id: toastSeq.current, tone, text });
  }, []);

  const apply = useCallback(
    (items: readonly ApprovalItem[]) =>
      items.map((item) => {
        const local = decisions[item.id];
        if (!local || item.status !== "pending") return item;
        return { ...item, status: local.status, decisionReason: local.reason, decidedAt: local.decidedAt };
      }),
    [decisions],
  );

  const decide = useCallback<DecisionsContextValue["decide"]>(
    async ({ items, decision, reason, simulateFailure = false }) => {
      const ids = items.map((i) => i.id);
      setBusy((prev) => new Set([...prev, ...ids]));
      try {
        await submitDecisionMock(simulateFailure);
        const decidedAt = new Date().toISOString();
        setDecisions((prev) => {
          const next = { ...prev };
          for (const id of ids) next[id] = { status: decision, reason, decidedAt };
          return next;
        });
        showToast(
          "success",
          `${decision === "approved" ? "Disetujui" : "Ditolak dan dikirim ke agent"}: ${summarize(items)}`,
        );
        return true;
      } catch (error) {
        console.error("[approvals] decision failed", { ids, decision, error });
        showToast("error", "Keputusan belum tersimpan. Periksa koneksi lalu coba lagi.");
        return false;
      } finally {
        setBusy((prev) => {
          const next = new Set(prev);
          for (const id of ids) next.delete(id);
          return next;
        });
      }
    },
    [showToast],
  );

  const value = useMemo<DecisionsContextValue>(
    () => ({
      apply,
      isBusy: (id) => busy.has(id),
      decide,
      toast,
      dismissToast: () => setToast(null),
    }),
    [apply, busy, decide, toast],
  );

  return <DecisionsContext.Provider value={value}>{children}</DecisionsContext.Provider>;
}

export function useDecisions(): DecisionsContextValue {
  const ctx = useContext(DecisionsContext);
  if (!ctx) throw new Error("useDecisions must be used inside <DecisionsProvider>.");
  return ctx;
}

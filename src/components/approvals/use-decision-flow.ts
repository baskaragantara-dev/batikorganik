"use client";

import { useState } from "react";
import type { ApprovalItem } from "@/domain/approvals/types";
import { useDecisions } from "./decisions-store";

/** Shared approve/reject flow for the dashboard card and the full queue. */
export function useDecisionFlow(simulateFailure: boolean) {
  const { decide, isBusy } = useDecisions();
  const [rejecting, setRejecting] = useState<ApprovalItem[] | null>(null);

  return {
    isBusy,
    rejecting,
    approve: (items: ApprovalItem[]) => decide({ items, decision: "approved", simulateFailure }),
    startReject: (items: ApprovalItem[]) => setRejecting(items),
    cancelReject: () => setRejecting(null),
    confirmReject: async (reason: string) => {
      if (!rejecting) return false;
      const ok = await decide({ items: rejecting, decision: "rejected", reason, simulateFailure });
      if (ok) setRejecting(null);
      return ok;
    },
    rejectBusy: rejecting?.some((i) => isBusy(i.id)) ?? false,
  };
}

"use client";

import { useEffect } from "react";
import { useDecisions } from "./decisions-store";

export function DecisionToast() {
  const { toast, dismissToast } = useDecisions();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(dismissToast, 4000);
    return () => clearTimeout(timer);
  }, [toast, dismissToast]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-[calc(4rem+env(safe-area-inset-top,0px))] z-40 flex justify-center px-4 lg:top-6"
    >
      {toast ? (
        <p
          key={toast.id}
          className={`pointer-events-auto max-w-md rounded-full px-5 py-3 text-sm font-bold shadow-sheet ${
            toast.tone === "success" ? "bg-ink text-surface" : "bg-danger text-surface"
          }`}
        >
          {toast.text}
        </p>
      ) : null}
    </div>
  );
}

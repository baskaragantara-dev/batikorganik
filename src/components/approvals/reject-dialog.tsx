"use client";

import { useEffect, useId, useRef, useState } from "react";
import { rejectReasonSchema } from "@/domain/approvals/policy";
import { Button } from "@/components/ui/button";

/**
 * APR-04: rejection always carries a reason that is sent back to the agent.
 * Native <dialog> gives focus trapping, Esc to close and an inert background for free.
 */
export function RejectDialog({
  open,
  subject,
  busy,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  subject: string;
  busy: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fieldId = useId();
  const errorId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setReason("");
      setError(null);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = rejectReasonSchema.safeParse(reason);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Alasan tidak valid.");
      return;
    }
    setError(null);
    onConfirm(parsed.data);
  }

  return (
    <dialog
      ref={ref}
      onClose={onCancel}
      aria-labelledby={`${fieldId}-title`}
      className="m-0 mt-auto w-full max-w-none rounded-t-card bg-surface p-0 text-ink shadow-sheet sm:m-auto sm:max-w-lg sm:rounded-card"
    >
      <form onSubmit={submit} className="flex flex-col gap-4 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
        <div className="flex flex-col gap-1">
          <h2 id={`${fieldId}-title`} className="font-display text-2xl font-medium">
            Tolak permintaan
          </h2>
          <p className="text-sm text-ink-soft">{subject}</p>
        </div>
        <label htmlFor={fieldId} className="text-sm font-semibold">
          Alasan untuk agent
        </label>
        <textarea
          id={fieldId}
          name="reason"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          placeholder="Contoh: klaim organik belum ada sertifikat, ganti jadi pewarna alami."
          className="rounded-tile border border-hairline bg-canvas p-3 text-base outline-none focus:border-ink"
          autoFocus
        />
        {error ? (
          <p id={errorId} className="text-sm font-semibold text-danger">
            {error}
          </p>
        ) : null}
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onCancel} disabled={busy}>
            Batal
          </Button>
          <Button type="submit" className="flex-1" disabled={busy}>
            {busy ? "Menyimpan…" : "Tolak dan kirim"}
          </Button>
        </div>
      </form>
    </dialog>
  );
}

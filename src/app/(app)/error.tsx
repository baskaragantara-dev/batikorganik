"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertIcon, RefreshIcon } from "@/components/ui/icons";
import { StatePanel } from "@/components/ui/state-panel";

export default function AppError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // TODO(observability): forward to error tracking once it is set up.
    console.error("[app] segment render failed", error);
  }, [error]);

  return (
    <div className="flex flex-col gap-6 pt-4">
      <StatePanel
        tone="danger"
        icon={<AlertIcon width={24} height={24} />}
        title="Data belum bisa dimuat"
        heading="h1"
        action={
          <Button onClick={retry}>
            <RefreshIcon width={18} height={18} /> Coba lagi
          </Button>
        }
      >
        Koneksi ke server terputus atau sedang sibuk. Keputusan yang sudah Anda buat tetap aman.
      </StatePanel>
    </div>
  );
}

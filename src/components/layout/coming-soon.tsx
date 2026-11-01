import Link from "next/link";
import { buttonClass } from "@/components/ui/button";

/** Placeholder for modules scheduled in later slices, so navigation never dead-ends. */
export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-4xl font-normal lg:text-5xl">{title}</h1>
      <div className="flex flex-col items-start gap-4 rounded-card bg-surface p-6">
        <p className="max-w-prose text-ink-soft">{description}</p>
        <p className="text-sm text-ink-muted">Modul ini dibangun di tahap berikutnya.</p>
        <Link href="/" className={buttonClass("secondary")}>
          Kembali ke Ringkasan
        </Link>
      </div>
    </div>
  );
}

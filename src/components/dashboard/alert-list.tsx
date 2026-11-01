import Link from "next/link";
import type { DashboardAlert } from "@/domain/dashboard/types";
import { AlertIcon, ArrowRightIcon } from "@/components/ui/icons";

/** DSH-03. Renders nothing when there are no alerts, so a healthy day stays quiet. */
export function AlertList({ alerts }: { alerts: DashboardAlert[] }) {
  if (alerts.length === 0) return null;
  return (
    <section aria-label="Peringatan" className="flex flex-col gap-2">
      {alerts.map((a) => (
        <Link
          key={a.id}
          href={a.href}
          className={`flex items-start gap-3 rounded-tile p-4 ${
            a.severity === "critical" ? "bg-danger-quiet text-danger" : "bg-warning-quiet text-warning"
          }`}
        >
          <AlertIcon className="mt-0.5 shrink-0" />
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="font-bold">{a.title}</span>
            <span className="text-sm opacity-90">{a.detail}</span>
          </span>
          <ArrowRightIcon className="mt-0.5 shrink-0" />
        </Link>
      ))}
    </section>
  );
}

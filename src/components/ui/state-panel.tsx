import type { ReactNode } from "react";

/** Shared layout for empty and error states so they read consistently. */
export function StatePanel({
  icon,
  title,
  children,
  action,
  tone = "neutral",
  heading: Heading = "h3",
}: {
  icon: ReactNode;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  tone?: "neutral" | "danger";
  heading?: "h1" | "h2" | "h3";
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card bg-surface px-6 py-10 text-center">
      <span
        className={`grid size-12 place-items-center rounded-full ${tone === "danger" ? "bg-danger-quiet text-danger" : "bg-success-quiet text-success"}`}
      >
        {icon}
      </span>
      <Heading className="font-display text-xl font-medium">{title}</Heading>
      {children ? <p className="max-w-sm text-sm text-ink-soft">{children}</p> : null}
      {action}
    </div>
  );
}

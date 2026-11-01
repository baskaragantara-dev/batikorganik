import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "inverse" | "inverse-outline";

const VARIANT: Record<Variant, string> = {
  primary: "bg-ink text-surface hover:bg-ink/85 disabled:bg-ink/40",
  secondary:
    "border border-hairline bg-surface text-ink hover:border-ink-muted disabled:text-ink-muted",
  ghost: "text-ink-soft hover:bg-surface-deep",
  /** For use on dark (ink) surfaces such as the batch action bar. */
  inverse: "bg-surface text-ink hover:bg-surface-deep",
  "inverse-outline": "border border-surface/30 text-surface hover:border-surface",
};

export function buttonClass(variant: Variant = "primary", extra = ""): string {
  return `inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${VARIANT[variant]} ${extra}`;
}

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />;
}

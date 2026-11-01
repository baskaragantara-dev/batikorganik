import Link from "next/link";

/**
 * Text stand-in for the official black Batik Organik wordmark.
 * TODO(brand): replace with the official logo file once it is added to /public/brand.
 */
export function Wordmark() {
  return (
    <Link href="/" className="flex items-baseline gap-2" aria-label="Batik Organik Growth OS, ke Ringkasan">
      <span className="font-display text-xl font-medium tracking-tight">batikorganik</span>
      <span className="rounded-full bg-ink px-2 py-0.5 text-[0.65rem] font-semibold tracking-wider text-surface uppercase">
        Growth OS
      </span>
    </Link>
  );
}

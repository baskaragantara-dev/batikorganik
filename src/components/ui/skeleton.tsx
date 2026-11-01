export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse rounded-tile bg-surface-deep ${className}`} />;
}

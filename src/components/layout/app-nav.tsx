"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, isActive } from "./nav-items";

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-surface/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto flex max-w-xl">
        {NAV_ITEMS.filter((i) => i.mobile).map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[0.7rem] font-semibold ${
                  active ? "text-ink" : "text-ink-muted"
                }`}
              >
                <span className={`grid h-7 w-12 place-items-center rounded-full ${active ? "bg-ink text-surface" : ""}`}>
                  <Icon />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SideNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navigasi utama" className="hidden lg:block">
      <ul className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-full px-4 text-sm font-semibold ${
                  active ? "bg-ink text-surface" : "text-ink-soft hover:bg-surface-deep"
                }`}
              >
                <Icon />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import {
  BadgeCheck,
  Bot,
  Clapperboard,
  Inbox,
  LayoutGrid,
  Megaphone,
  Menu,
  Package,
  Palette,
  Radar,
  RotateCcw,
  Settings,
  Target,
  X,
} from 'lucide-react';
import { ORG } from '@/lib/mock/data';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/', label: 'Ringkasan', icon: LayoutGrid },
  { href: '/campaign', label: 'Campaign', icon: Target },
  { href: '/ads', label: 'Ads', icon: Megaphone },
  { href: '/konten', label: 'Content Studio', icon: Clapperboard },
  { href: '/approval', label: 'Approval', icon: BadgeCheck, badge: 'approvals' as const },
  { href: '/leads', label: 'Leads', icon: Inbox, badge: 'leads' as const },
  { href: '/agent', label: 'Agent', icon: Bot },
  // Not built yet in R0: shown so reviewers see the full scope, but not linked.
  { href: '/tracking', label: 'Tracking', icon: Radar, soon: true },
  { href: '/brand', label: 'Brand Hub', icon: Palette, soon: true },
  { href: '/paket', label: 'Paket dan harga', icon: Package, soon: true },
  { href: '/pengaturan', label: 'Pengaturan', icon: Settings, soon: true },
];

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { approvals, leads } = useStore();
  const counts = {
    approvals: approvals.filter((a) => a.status === 'menunggu').length,
    leads: leads.filter((l) => l.status === 'baru').length,
  };
  return (
    <nav aria-label="Navigasi utama">
      <ul className="space-y-1">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          const count = item.badge ? counts[item.badge] : 0;
          if (item.soon) {
            return (
              <li key={item.href}>
                <span className="flex items-center gap-3 rounded-full px-4 py-2.5 text-body font-medium text-muted-foreground" aria-disabled="true">
                  <Icon className="size-4 shrink-0" aria-hidden />
                  <span className="flex-1">{item.label}</span>
                  <span className="rounded-full bg-muted px-2 text-micro">Segera</span>
                </span>
              </li>
            );
          }
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-full px-4 py-2.5 text-body font-medium transition-colors duration-[120ms]',
                  active ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent',
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                <span className="flex-1">{item.label}</span>
                {count > 0 ? (
                  <span className={cn('rounded-full px-2 text-micro tabular', active ? 'bg-inverse-raised text-inverse-foreground' : 'bg-primary-solid text-primary-foreground')}>
                    {count}
                    <span className="sr-only"> menunggu</span>
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3 px-2">
      <span className="grid size-9 place-items-center rounded-full bg-inverse text-caption font-bold text-inverse-foreground" aria-hidden>
        BO
      </span>
      <div className="leading-tight">
        <p className="text-title text-logo-wordmark">Growth OS</p>
        <p className="text-caption text-muted-foreground">
          {ORG.name} · {ORG.city}
        </p>
      </div>
    </div>
  );
}

function ResetButton() {
  const { reset } = useStore();
  return (
    <button
      type="button"
      onClick={() => {
        if (window.confirm('Kembalikan semua data demo ke kondisi awal? Keputusan approval dan campaign baru akan hilang.')) reset();
      }}
      className="flex w-full items-center gap-2 rounded-full px-4 py-2 text-body-sm text-muted-foreground hover:bg-sidebar-accent"
    >
      <RotateCcw className="size-4" aria-hidden />
      Reset data demo
    </button>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[260px_1fr]">
      <a href="#konten-utama" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-card focus:px-4 focus:py-2">
        Lewati ke konten
      </a>
      <aside className="sticky top-0 hidden h-dvh flex-col gap-6 overflow-y-auto border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <Brand />
        <Nav />
        <div className="mt-auto space-y-2">
          <p className="rounded-note bg-highlight px-3 py-2 text-caption text-highlight-foreground">Prototype review. Semua data simulasi, agent belum memanggil AI.</p>
          <ResetButton />
        </div>
      </aside>

      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
        <Brand />
        <button type="button" onClick={() => setOpen(true)} className="rounded-full p-2 hover:bg-muted" aria-label="Buka menu" aria-expanded={open}>
          <Menu className="size-5" aria-hidden />
        </button>
      </div>
      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" className="absolute inset-0 bg-black/40" aria-label="Tutup menu" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col gap-6 overflow-y-auto bg-sidebar p-4 shadow-modal">
            <div className="flex items-center justify-between">
              <Brand />
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-muted" aria-label="Tutup menu">
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <Nav onNavigate={() => setOpen(false)} />
            <div className="mt-auto">
              <ResetButton />
            </div>
          </div>
        </div>
      ) : null}

      <main id="konten-utama" className="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-[1280px]">{children}</div>
      </main>
    </div>
  );
}

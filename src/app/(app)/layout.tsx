import { DecisionsProvider } from "@/components/approvals/decisions-store";
import { DecisionToast } from "@/components/approvals/toast";
import { BottomNav, SideNav } from "@/components/layout/app-nav";
import { Wordmark } from "@/components/layout/wordmark";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <DecisionsProvider>
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-surface"
      >
        Lewati ke konten
      </a>
      <div className="mx-auto flex min-h-dvh max-w-[90rem] gap-8 lg:px-8">
        <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 py-6 lg:block">
          <div className="flex h-full flex-col gap-8 rounded-card bg-surface p-4">
            <div className="px-2 pt-2">
              <Wordmark />
            </div>
            <SideNav />
            {/* TODO(auth): read the signed-in member once Supabase auth lands; mock identity for R0. */}
            <div className="mt-auto flex items-center gap-3 rounded-full bg-canvas p-2">
              <span aria-hidden className="grid size-9 place-items-center rounded-full bg-ink text-sm font-semibold text-surface">
                B
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-semibold">Baskara</span>
                <span className="text-xs text-ink-muted">Owner</span>
              </span>
            </div>
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between bg-canvas/95 px-5 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] pb-3 backdrop-blur lg:hidden">
            <Wordmark />
          </header>
          <main
            id="konten-utama"
            className="flex-1 px-5 pt-4 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] lg:px-0 lg:pt-10 lg:pb-12"
          >
            {children}
          </main>
        </div>
      </div>
      <BottomNav />
      <DecisionToast />
    </DecisionsProvider>
  );
}

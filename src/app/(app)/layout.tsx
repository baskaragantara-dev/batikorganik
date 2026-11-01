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
      <div className="mx-auto flex min-h-dvh max-w-6xl gap-10 lg:px-8">
        <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col gap-8 py-8 lg:flex">
          <Wordmark />
          <SideNav />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between bg-surface-warm/95 px-5 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] pb-3 backdrop-blur lg:hidden">
            <Wordmark />
          </header>
          <main
            id="konten-utama"
            className="flex-1 px-5 pt-4 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] lg:px-0 lg:pt-10 lg:pb-16"
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

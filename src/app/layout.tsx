import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import { AppShell } from '@/components/shell';
import { StoreProvider } from '@/lib/store';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Growth OS · Batik Organik', template: '%s · Growth OS' },
  description: 'Prototype review: campaign, ads, konten, dan leads dengan agent AI untuk Batik Organik.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: '#F4F5F7' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${jakarta.variable} ${jetbrains.variable}`}>
      <body>
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}

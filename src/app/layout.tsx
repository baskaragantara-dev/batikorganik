import type { Metadata, Viewport } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Growth OS · Batik Organik", template: "%s · Growth OS" },
  description: "Pusat keputusan marketing Batik Organik: approval, campaign, konten, dan leads.",
};

export const viewport: Viewport = {
  themeColor: "#f6f5fa",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${urbanist.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}

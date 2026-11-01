import type { Metadata, Viewport } from "next";
import { Karla, Newsreader } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Growth OS · Batik Organik", template: "%s · Growth OS" },
  description: "Pusat keputusan marketing Batik Organik: approval, campaign, konten, dan leads.",
};

export const viewport: Viewport = {
  themeColor: "#f8f5f1",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${newsreader.variable} ${karla.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}

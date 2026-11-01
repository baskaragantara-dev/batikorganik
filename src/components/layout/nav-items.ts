import type { ComponentType, SVGProps } from "react";
import { CheckCircleIcon, ChatIcon, HomeIcon, ImageIcon, MegaphoneIcon, PulseIcon } from "@/components/ui/icons";

export interface NavItem {
  href: "/" | "/approval" | "/campaign" | "/konten" | "/leads" | "/tracking";
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Shown in the phone bottom bar (max 5 for thumb reach). */
  mobile: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Ringkasan", icon: HomeIcon, mobile: true },
  { href: "/approval", label: "Approval", icon: CheckCircleIcon, mobile: true },
  { href: "/leads", label: "Leads", icon: ChatIcon, mobile: true },
  { href: "/konten", label: "Konten", icon: ImageIcon, mobile: true },
  { href: "/campaign", label: "Campaign", icon: MegaphoneIcon, mobile: true },
  { href: "/tracking", label: "Tracking", icon: PulseIcon, mobile: false },
];

export function isActive(pathname: string, href: NavItem["href"]): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

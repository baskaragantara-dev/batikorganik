import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function Base({ title, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export const HomeIcon = (p: IconProps) => (
  <Base {...p}><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" /></Base>
);
export const CheckCircleIcon = (p: IconProps) => (
  <Base {...p}><circle cx="12" cy="12" r="8.5" /><path d="m8.5 12.2 2.4 2.3 4.6-4.9" /></Base>
);
export const MegaphoneIcon = (p: IconProps) => (
  <Base {...p}><path d="M4 10v4a1 1 0 0 0 1 1h2l6 4V5L7 9H5a1 1 0 0 0-1 1Z" /><path d="M17 9.5a3.5 3.5 0 0 1 0 5" /></Base>
);
export const ImageIcon = (p: IconProps) => (
  <Base {...p}><rect x="3.5" y="4.5" width="17" height="15" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5" /></Base>
);
export const ChatIcon = (p: IconProps) => (
  <Base {...p}><path d="M5 18.5V7a2.5 2.5 0 0 1 2.5-2.5h9A2.5 2.5 0 0 1 19 7v6a2.5 2.5 0 0 1-2.5 2.5H9z" /></Base>
);
export const PulseIcon = (p: IconProps) => (
  <Base {...p}><path d="M3 12h4l2.5-6 5 12 2.5-6h4" /></Base>
);
export const WalletIcon = (p: IconProps) => (
  <Base {...p}><rect x="3.5" y="6" width="17" height="13" rx="2.5" /><path d="M16 12.5h2" /><path d="M6 6V5a1.5 1.5 0 0 1 1.8-1.5L17 5.5" /></Base>
);
export const UsersIcon = (p: IconProps) => (
  <Base {...p}><circle cx="9" cy="9" r="3.2" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0" /><path d="M15.5 6.2a3 3 0 0 1 0 5.6M17 14.2a5 5 0 0 1 3.5 4.8" /></Base>
);
export const TargetIcon = (p: IconProps) => (
  <Base {...p}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="0.8" /></Base>
);
export const BagIcon = (p: IconProps) => (
  <Base {...p}><path d="M5 8h14l-1 11.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19.5z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></Base>
);
export const AlertIcon = (p: IconProps) => (
  <Base {...p}><path d="M12 4 2.8 19.5h18.4z" /><path d="M12 10v4" /><path d="M12 17.2v.1" /></Base>
);
export const ArrowRightIcon = (p: IconProps) => (
  <Base {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Base>
);
export const ShieldIcon = (p: IconProps) => (
  <Base {...p}><path d="M12 3.5 5 6v5.5c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6z" /><path d="M12 8.5v4M12 15.5v.1" /></Base>
);
export const SparkIcon = (p: IconProps) => (
  <Base {...p}><path d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></Base>
);
export const RefreshIcon = (p: IconProps) => (
  <Base {...p}><path d="M19 12a7 7 0 1 1-2.1-5" /><path d="M19 4.5V8h-3.5" /></Base>
);

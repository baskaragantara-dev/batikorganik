import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Card({ className, ...props }: ComponentProps<'section'>) {
  return <section className={cn('rounded-xl bg-card p-6 text-card-foreground', className)} {...props} />;
}

export function CardTitle({ children, action, sub }: { children: ReactNode; action?: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-h3">{children}</h2>
        {sub ? <p className="mt-1 text-body-sm text-muted-foreground">{sub}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ title, sub, action }: { title: string; sub?: ReactNode; action?: ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-h2">{title}</h1>
        {sub ? <p className="mt-1 max-w-3xl text-body text-muted-foreground">{sub}</p> : null}
      </div>
      {action}
    </header>
  );
}

type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'dark';

const TONE: Record<Tone, string> = {
  neutral: 'bg-muted text-foreground',
  info: 'bg-accent text-accent-foreground',
  success: 'bg-success-soft text-success-text',
  warning: 'bg-warning-soft text-warning-text',
  danger: 'bg-danger-soft text-danger-text',
  dark: 'bg-inverse text-inverse-foreground',
};

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={cn('inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-micro', TONE[tone], className)}>{children}</span>;
}

export function AiTag({ label = 'AI' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-ai-soft px-2 py-0.5 text-micro text-ai-text">
      <Sparkles className="size-3" aria-hidden />
      {label}
    </span>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark';
const VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-primary-solid text-primary-foreground hover:bg-brand-600',
  secondary: 'bg-card text-foreground ring-1 ring-inset ring-input-border hover:bg-surface-2',
  ghost: 'text-foreground hover:bg-muted',
  danger: 'bg-danger-solid text-white hover:bg-danger-solid-hover',
  dark: 'bg-inverse text-inverse-foreground hover:opacity-90',
};

export function buttonClass(variant: ButtonVariant = 'primary', size: 'sm' | 'md' = 'md') {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-[120ms] disabled:cursor-not-allowed disabled:opacity-50',
    size === 'sm' ? 'h-8 px-3 text-body-sm' : 'h-10 px-4 text-body',
    VARIANT[variant],
  );
}

export function Button({ variant = 'primary', size = 'md', className, type = 'button', ...props }: ComponentProps<'button'> & { variant?: ButtonVariant; size?: 'sm' | 'md' }) {
  return <button type={type} className={cn(buttonClass(variant, size), className)} {...props} />;
}

export function LinkButton({ variant = 'primary', size = 'md', className, ...props }: ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: 'sm' | 'md' }) {
  return <Link className={cn(buttonClass(variant, size), className)} {...props} />;
}

export function Stat({ label, value, hint, tone }: { label: string; value: ReactNode; hint?: ReactNode; tone?: 'dark' }) {
  const dark = tone === 'dark';
  return (
    <div className={cn('rounded-xl p-5', dark ? 'bg-inverse text-inverse-foreground' : 'bg-card')}>
      <p className={cn('text-caption', dark ? 'text-inverse-subtle' : 'text-muted-foreground')}>{label}</p>
      <p className="mt-2 text-kpi-sm tabular">{value}</p>
      {hint ? <p className={cn('mt-1 text-body-sm', dark ? 'text-inverse-secondary' : 'text-muted-foreground')}>{hint}</p> : null}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border p-8 text-center">
      <p className="text-title">{title}</p>
      {children ? <div className="mt-1 text-body-sm text-muted-foreground">{children}</div> : null}
    </div>
  );
}

export function SimNote({ children }: { children?: ReactNode }) {
  return (
    <p className="rounded-note bg-highlight px-3 py-2 text-body-sm text-highlight-foreground">
      <strong>Data simulasi.</strong> {children ?? 'Angka dan nama di layar ini contoh untuk review, bukan data Batik Organik.'}
    </p>
  );
}

export function Field({ label, hint, error, children, htmlFor }: { label: string; hint?: string; error?: string; htmlFor: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-body-sm font-semibold">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="mt-1 text-body-sm text-danger-text">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-body-sm text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export const inputClass =
  'w-full rounded-md border border-input-border bg-card px-3 py-2 text-body text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring';

export function Table({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="-mx-6 overflow-x-auto px-6">
      <table className="w-full min-w-[640px] border-collapse text-left text-body" aria-label={label}>
        {children}
      </table>
    </div>
  );
}

export const th = 'border-b border-border pb-2 pr-4 text-caption text-muted-foreground font-medium';
export const td = 'border-b border-border py-3 pr-4 align-top';

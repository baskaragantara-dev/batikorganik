const idr = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

/** "Rp4.500.000" (no space after Rp, matching common Indonesian usage). */
export function formatIdr(amount: number): string {
  return idr.format(amount).replace(/\s/g, "");
}

const oneDecimal = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });

/** Short form for tiles: Rp2,8 jt, Rp450 rb, Rp1,2 M. */
export function formatIdrCompact(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}Rp${oneDecimal.format(abs / 1_000_000_000)} M`;
  if (abs >= 1_000_000) return `${sign}Rp${oneDecimal.format(abs / 1_000_000)} jt`;
  if (abs >= 1_000) return `${sign}Rp${oneDecimal.format(abs / 1_000)} rb`;
  return formatIdr(amount);
}

const timeFmt = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});

const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" });

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

/**
 * Human deadline relative to `now`, in WIB.
 * `overdue` lets the UI style it as urgent without parsing the text.
 */
export function describeDeadline(
  deadlineIso: string,
  now: Date,
): { text: string; overdue: boolean; dueToday: boolean } {
  const deadline = new Date(deadlineIso);
  const diff = deadline.getTime() - now.getTime();
  if (diff < 0) {
    const hours = Math.max(1, Math.round(-diff / HOUR));
    return {
      text: hours < 24 ? `Lewat ${hours} jam` : `Lewat ${Math.round(hours / 24)} hari`,
      overdue: true,
      dueToday: false,
    };
  }
  const sameDay = dayKey.format(deadline) === dayKey.format(now);
  if (sameDay) {
    return { text: `Hari ini ${timeFmt.format(deadline)}`, overdue: false, dueToday: true };
  }
  const tomorrow = dayKey.format(new Date(now.getTime() + DAY)) === dayKey.format(deadline);
  if (tomorrow) {
    return { text: `Besok ${timeFmt.format(deadline)}`, overdue: false, dueToday: false };
  }
  return { text: `${Math.ceil(diff / DAY)} hari lagi`, overdue: false, dueToday: false };
}

const longDate = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

export function formatLongDate(date: Date): string {
  return longDate.format(date);
}

export function greetingFor(date: Date): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Jakarta" }).format(date),
  );
  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 18) return "Selamat sore";
  return "Selamat malam";
}

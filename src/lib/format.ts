const idr = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
const num = new Intl.NumberFormat('id-ID');

export const rupiah = (n: number) => idr.format(n).replace(/ /g, ' ');
export const number = (n: number) => num.format(n);
export const percent = (n: number, digits = 0) => `${(n * 100).toFixed(digits).replace('.', ',')}%`;

/** Rp1,5 jt style for tight spaces. */
export function rupiahShort(n: number): string {
  if (n >= 1_000_000) return `Rp${(n / 1_000_000).toFixed(1).replace('.', ',').replace(',0', '')} jt`;
  if (n >= 1_000) return `Rp${Math.round(n / 1_000)} rb`;
  return `Rp${n}`;
}

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' });
const timeFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' });

export const date = (iso: string) => dateFmt.format(new Date(iso.length === 10 ? `${iso}T00:00:00+07:00` : iso));
export const dateTime = (iso: string) => timeFmt.format(new Date(iso));

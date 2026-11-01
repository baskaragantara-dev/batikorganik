import Link from "next/link";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-start justify-center gap-4 px-5">
      <h1 className="font-display text-4xl font-normal">Halaman tidak ditemukan</h1>
      <p className="text-ink-soft">Alamat ini tidak ada di Growth OS. Periksa tautannya atau kembali ke Ringkasan.</p>
      <Link href="/" className={buttonClass()}>
        Ke Ringkasan
      </Link>
    </main>
  );
}

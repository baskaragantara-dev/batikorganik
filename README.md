# Batik Organik Growth OS

Aplikasi sales dan marketing berbasis agent AI untuk Batik Organik: campaign, ads per campaign, content studio, approval, dan leads. Dibangun terpisah dari Naklasa dengan stack dan pola data yang sama, agar bisa diintegrasikan ke Naklasa setelah PRD disetujui.

Dokumen acuan: Konsep Awal Batik Organik Growth OS dan PRD Batik Organik Growth OS (Claude Docs).

## Status

R0 prototype front-end. Data masih mock (`src/data/mock/seed.ts`), belum ada backend. Supabase dengan RLS menyusul setelah alur UI disetujui.

| Slice | Isi | Status |
| --- | --- | --- |
| 1 | Ringkasan (DSH-01..03) dan antrean Approval (APR-01..04, APR-07) | Selesai di branch ini |
| 2+ | Leads inbox, Konten, Campaign, Tracking | Placeholder |

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit test domain (vitest)
npm run typecheck
npm run lint
npm run build
```

### Mode demo

Tambahkan `?demo=` di URL untuk melihat setiap state tanpa backend:

| Nilai | Efek |
| --- | --- |
| `empty` | Tidak ada draft menunggu dan tidak ada peringatan |
| `slow` | Data dimuat 2,5 detik, untuk melihat skeleton |
| `error` | Sumber data gagal, menampilkan error dan tombol Coba lagi |
| `action-error` | Setujui atau Tolak gagal disimpan, menampilkan pesan gagal |

## Struktur

```
src/
  app/(app)/            route: Ringkasan, Approval, placeholder modul lain
  components/           UI (approvals, dashboard, layout, ui)
  domain/               aturan bisnis murni + test (prioritas, izin, validasi)
  data/                 repository mock; versi Supabase memakai signature yang sama
  lib/format.ts         format rupiah dan tenggat (WIB)
```

Aturan bisnis ada di `src/domain`, bukan di komponen. Contoh: `checkCanDecide` menegakkan matriks izin PRD bagian 4 dan aturan pembuat tidak boleh menyetujui permintaannya sendiri (APR-07). Aturan yang sama nanti ditegakkan lagi di database lewat RLS dan RPC.

## Design token

Token ada di `src/app/globals.css` (Tailwind v4 `@theme`), gaya "Urbanist" pilihan Baskara.

- Palet: Alice Blue `#D8DFE9`, Honeydew `#CFDECA`, Vanilla `#EFF0A3` untuk permukaan pastel (tidak untuk teks), Eerie Black `#212121` untuk teks dan tombol utama, Ghost White `#F6F5FA` untuk latar. Huruf: Urbanist.
- Warna status (bahaya, peringatan, sukses) digelapkan agar kontras teksnya minimal 4,5:1 di atas latar pastel.
- Logo masih wordmark teks sementara (`src/components/layout/wordmark.tsx`). Ganti dengan file logo resmi Batik Organik di `public/brand/` bila sudah tersedia.

# Batik Organik Growth OS

Aplikasi sales dan marketing berbasis agent AI untuk Batik Organik: campaign, ads per campaign, content studio, approval, dan leads. Dibangun terpisah dari Naklasa dengan stack dan pola data yang sama, agar bisa diintegrasikan ke Naklasa setelah PRD disetujui.

Dokumen acuan: Konsep Awal Batik Organik Growth OS dan PRD Batik Organik Growth OS (Claude Docs).

## Status: R0 prototype front-end

Semua data simulasi dan agent belum memanggil AI. Layar yang sudah ada: Ringkasan, Campaign (daftar, wizard agent, detail), Ads, Content Studio dengan kalkulator kapasitas dan HPP, Approval, Leads, Agent. Tracking, Brand Hub, Paket dan harga, serta Pengaturan menyusul.

## Menjalankan

```bash
npm ci
npm run dev        # http://localhost:3000
npm run typecheck && npm run lint && npm test && npm run build
```

Logika bisnis yang diuji ada di `src/lib/domain`: harga paket dan margin (`pricing.ts`), kapasitas dan HPP konten (`capacity.ts`), UTM dan link WhatsApp (`utm.ts`), simulasi agent (`simulate.ts`).

import type {
  AdPlan,
  AgentDef,
  AgentRun,
  ApprovalItem,
  Campaign,
  ContentItem,
  DailyMetric,
  Lead,
  Market,
} from '@/lib/types';

// Simulated data for review. Brand facts come from the online research in the concept doc; every metric, lead and
// person below is invented and labelled as a simulation in the UI.

export const TODAY = '2026-10-31';
export const ORG = { name: 'Batik Organik', city: 'Bogor', plan: 'Growth' } as const;

export const MARKETS: Market[] = [
  { code: 'ID', country: 'Indonesia', language: 'Bahasa Indonesia', currency: 'IDR', score: 88, rationale: 'Pasar utama, B2B seragam korporat dan oleh-oleh Bogor.' },
  { code: 'MY', country: 'Malaysia', language: 'Bahasa Melayu', currency: 'MYR', score: 82, rationale: 'Modest fashion besar, bahasa dekat, ongkir murah, sudah pernah ekspor.' },
  { code: 'BN', country: 'Brunei', language: 'Bahasa Melayu', currency: 'BND', score: 71, rationale: 'Daya beli tinggi, modest fashion, pasar kecil.' },
  { code: 'SG', country: 'Singapura', language: 'English', currency: 'SGD', score: 74, rationale: 'Daya beli tinggi, peduli produk berkelanjutan, sudah pernah ekspor.' },
  { code: 'JP', country: 'Jepang', language: '日本語', currency: 'JPY', score: 69, rationale: 'Apresiasi kriya dan pewarna alami, buyer lama.' },
  { code: 'CH', country: 'Swiss', language: 'Deutsch / Français', currency: 'CHF', score: 63, rationale: 'Buyer lama, B2B kain berkelanjutan, regulasi data FADP.' },
  { code: 'DE', country: 'Jerman', language: 'Deutsch', currency: 'EUR', score: 58, rationale: 'Pasar kain berkelanjutan terbesar EU, butuh bukti sertifikasi.' },
  { code: 'AE', country: 'Uni Emirat Arab', language: 'العربية / English', currency: 'AED', score: 55, rationale: 'Modest fashion premium, belum ada buyer.' },
];

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp-seragam-q4',
    name: 'Seragam Batik Korporat Q4',
    goal: 'Leads B2B perusahaan yang butuh seragam batik ramah lingkungan untuk akhir tahun.',
    funnel: 'b2b',
    markets: ['ID'],
    status: 'aktif',
    budgetMonthly: 4_000_000,
    start: '2026-10-15',
    end: '2026-12-15',
    offer: 'Konsultasi desain gratis dan sampel kain untuk order di atas 50 pcs.',
    kpi: { leadsTarget: 40, cplTarget: 100_000 },
    createdBy: 'agent',
  },
  {
    id: 'cmp-modest-my',
    name: 'Modest Batik Malaysia dan Brunei',
    goal: 'Leads dan penjualan B2C koleksi modest ke Malaysia dan Brunei.',
    funnel: 'b2c',
    markets: ['MY', 'BN'],
    status: 'menunggu',
    budgetMonthly: 5_000_000,
    start: '2026-11-10',
    end: '2027-01-10',
    offer: 'Gratis ongkir untuk 2 pcs, katalog warna lewat WhatsApp.',
    kpi: { leadsTarget: 120, cplTarget: 40_000 },
    createdBy: 'agent',
  },
  {
    id: 'cmp-eu-fabric',
    name: 'Natural Dye Fabric untuk Butik Eropa',
    goal: 'Daftar buyer B2B kain pewarna alami di Swiss dan Jerman.',
    funnel: 'b2b',
    markets: ['CH', 'DE'],
    status: 'draft',
    budgetMonthly: 3_000_000,
    start: '2026-12-01',
    end: '2027-02-28',
    offer: 'Swatch book 20 motif dan harga grosir FOB.',
    kpi: { leadsTarget: 15, cplTarget: 200_000 },
    createdBy: 'agent',
  },
  {
    id: 'cmp-jp-craft',
    name: 'Craft Story Jepang',
    goal: 'Membangun audiens dan leads B2C di Jepang lewat cerita pengrajin.',
    funnel: 'b2c',
    markets: ['JP'],
    status: 'dijeda',
    budgetMonthly: 2_000_000,
    start: '2026-09-01',
    end: '2026-11-30',
    offer: 'Edisi terbatas kain shibori, pre-order.',
    kpi: { leadsTarget: 30, cplTarget: 70_000 },
    createdBy: 'manusia',
  },
];

const utm = (source: string, medium: string, campaign: string, content: string, term: string) => ({ source, medium, campaign, content, term });

export const ADS: AdPlan[] = [
  { id: 'ad-1', campaignId: 'cmp-seragam-q4', platform: 'meta', name: 'Lead form HR dan GA Jabodetabek', objective: 'Leads', audience: 'HR, GA, procurement, perusahaan 50+ karyawan', market: 'ID', dailyBudget: 70_000, destination: 'Instant form + WA', status: 'live', utm: utm('facebook', 'paid_social', 'bo-seragam-q4', 'carousel-katalog', 'hr-ga-jabodetabek'), creativeIds: ['ct-1', 'ct-2'], spend: 1_120_000, leads: 14 },
  { id: 'ad-2', campaignId: 'cmp-seragam-q4', platform: 'google', name: 'Search: seragam batik kantor', objective: 'Leads', audience: 'Kata kunci seragam batik, batik kantor custom', market: 'ID', dailyBudget: 50_000, destination: 'Landing seragam + form', status: 'live', utm: utm('google', 'cpc', 'bo-seragam-q4', 'rsa-seragam', 'seragam-batik-kantor'), creativeIds: ['ct-3'], spend: 760_000, leads: 9 },
  { id: 'ad-3', campaignId: 'cmp-seragam-q4', platform: 'email', name: 'Outreach 120 perusahaan (B2B Prospector)', objective: 'Leads', audience: 'Daftar prospek hasil agent, sudah diverifikasi', market: 'ID', dailyBudget: 0, destination: 'Email + jadwal call', status: 'menunggu', utm: utm('email', 'outreach', 'bo-seragam-q4', 'email-sekuens-1', 'prospek-q4'), creativeIds: ['ct-4'], spend: 0, leads: 0 },
  { id: 'ad-4', campaignId: 'cmp-modest-my', platform: 'meta', name: 'Click-to-WhatsApp modest MY', objective: 'Messages', audience: 'Wanita 25 sampai 44, minat modest fashion, Malaysia', market: 'MY', dailyBudget: 90_000, destination: 'WhatsApp + kode MY1123', status: 'menunggu', utm: utm('instagram', 'paid_social', 'bo-modest-my', 'reels-hook-3', 'my-25-44-modest'), creativeIds: ['ct-5', 'ct-6'], spend: 0, leads: 0 },
  { id: 'ad-5', campaignId: 'cmp-modest-my', platform: 'tiktok', name: 'Spark ads tutorial lilit', objective: 'Sales', audience: 'Lookalike pembeli, Malaysia dan Brunei', market: 'MY', dailyBudget: 60_000, destination: 'Halaman produk', status: 'menunggu', utm: utm('tiktok', 'paid_social', 'bo-modest-my', 'spark-tutorial-lilit', 'lookalike-buyer'), creativeIds: ['ct-7'], spend: 0, leads: 0 },
  { id: 'ad-6', campaignId: 'cmp-modest-my', platform: 'meta', name: 'Click-to-WhatsApp Brunei', objective: 'Messages', audience: 'Wanita 25 sampai 50, Brunei', market: 'BN', dailyBudget: 30_000, destination: 'WhatsApp + kode BN1123', status: 'draft', utm: utm('instagram', 'paid_social', 'bo-modest-bn', 'reels-hook-1', 'bn-25-50'), creativeIds: ['ct-5'], spend: 0, leads: 0 },
  { id: 'ad-7', campaignId: 'cmp-eu-fabric', platform: 'google', name: 'Search: natural dye fabric wholesale', objective: 'Leads', audience: 'Kata kunci natural dye fabric, sustainable batik wholesale', market: 'DE', dailyBudget: 60_000, destination: 'Landing B2B EN/DE + form', status: 'draft', utm: utm('google', 'cpc', 'bo-eu-fabric', 'rsa-wholesale', 'natural-dye-fabric'), creativeIds: [], spend: 0, leads: 0 },
  { id: 'ad-8', campaignId: 'cmp-jp-craft', platform: 'meta', name: 'Video pengrajin shibori', objective: 'Traffic', audience: 'Minat kriya dan tekstil, Jepang', market: 'JP', dailyBudget: 40_000, destination: 'Halaman cerita brand', status: 'dijeda', utm: utm('instagram', 'paid_social', 'bo-jp-craft', 'video-pengrajin', 'jp-craft'), creativeIds: ['ct-9'], spend: 640_000, leads: 2 },
];

export const CONTENT: ContentItem[] = [
  { id: 'ct-1', campaignId: 'cmp-seragam-q4', title: 'Katalog 6 motif seragam', format: 'Carousel', language: 'ID', stage: 'tayang', owner: 'Rina (kreator)', hook: 'Seragam kantor yang dipakai dengan bangga, bukan terpaksa.', variants: 4, dueDate: '2026-10-14', aiAssisted: true },
  { id: 'ct-2', campaignId: 'cmp-seragam-q4', title: 'Proses pewarna alami 30 detik', format: 'Video ads', language: 'ID', stage: 'tayang', owner: 'Dimas (kreator)', hook: 'Warna ini berasal dari kulit kayu, bukan pabrik kimia.', variants: 6, dueDate: '2026-10-14', aiAssisted: true },
  { id: 'ct-4', campaignId: 'cmp-seragam-q4', title: 'Sekuens email outreach 3 langkah', format: 'Email', language: 'ID', stage: 'review', owner: 'Script Writer', hook: 'Seragam akhir tahun Anda sudah ramah lingkungan?', variants: 3, dueDate: '2026-11-02', aiAssisted: true },
  { id: 'ct-5', campaignId: 'cmp-modest-my', title: '3 cara lilit kain batik untuk hari raya', format: 'Reels/TikTok', language: 'MS', stage: 'review', owner: 'Rina (kreator)', hook: 'Satu kain, tiga gaya, tanpa jahit.', variants: 8, dueDate: '2026-11-03', aiAssisted: true },
  { id: 'ct-6', campaignId: 'cmp-modest-my', title: 'Foto lookbook modest warna cerah', format: 'Statis ads', language: 'MS', stage: 'produksi', owner: 'Dimas (kreator)', hook: 'Batik yang tidak terlihat seperti batik ibu kita.', variants: 6, dueDate: '2026-11-05', aiAssisted: false },
  { id: 'ct-7', campaignId: 'cmp-modest-my', title: 'Tutorial lilit versi TikTok', format: 'Reels/TikTok', language: 'MS', stage: 'script', owner: 'Script Writer', hook: 'Kalau tak pandai lilit, tonton ini.', variants: 0, dueDate: '2026-11-06', aiAssisted: true },
  { id: 'ct-8', campaignId: 'cmp-eu-fabric', title: 'Swatch book digital 20 motif', format: 'Katalog B2B', language: 'EN', stage: 'brief', owner: 'Content Planner', hook: 'Plant-dyed batik fabric, traceable to the farm.', variants: 0, dueDate: '2026-11-20', aiAssisted: true },
  { id: 'ct-9', campaignId: 'cmp-jp-craft', title: 'Cerita pengrajin shibori', format: 'Video ads', language: 'JA', stage: 'siap', owner: 'Dimas (kreator)', hook: '手で染める、ボゴールの色。', variants: 3, dueDate: '2026-10-20', aiAssisted: true },
  { id: 'ct-10', campaignId: 'cmp-modest-my', title: 'Broadcast katalog warna MY', format: 'Broadcast WA', language: 'MS', stage: 'brief', owner: 'Content Planner', hook: 'Katalog warna terbaru, khas untuk anda.', variants: 0, dueDate: '2026-11-12', aiAssisted: true },
  { id: 'ct-11', campaignId: 'cmp-eu-fabric', title: 'Artikel: natural dye vs synthetic dye', format: 'Artikel SEO', language: 'EN', stage: 'script', owner: 'Script Writer', hook: 'What “natural dye” really means for batik.', variants: 0, dueDate: '2026-11-25', aiAssisted: true },
];

export const APPROVALS: ApprovalItem[] = [
  { id: 'ap-1', kind: 'campaign', campaignId: 'cmp-modest-my', title: 'Campaign: Modest Batik Malaysia dan Brunei', summary: '2 pasar, budget Rp5 juta per bulan, target 120 leads dengan CPL Rp40 ribu.', requestedBy: 'Campaign Strategist', createdAt: '2026-10-31T08:12:00+07:00', status: 'menunggu', risk: 'sedang', brandScore: 91, complianceNote: null },
  { id: 'ap-2', kind: 'ads', campaignId: 'cmp-modest-my', title: 'Ads: Click-to-WhatsApp modest MY', summary: 'Meta, objective Messages, Rp90 ribu per hari, 2 kreatif.', requestedBy: 'Media Buyer', createdAt: '2026-10-31T08:20:00+07:00', status: 'menunggu', risk: 'sedang', brandScore: 88, complianceNote: null },
  { id: 'ap-3', kind: 'ads', campaignId: 'cmp-modest-my', title: 'Ads: Spark ads tutorial lilit', summary: 'TikTok, objective Sales, Rp60 ribu per hari.', requestedBy: 'Media Buyer', createdAt: '2026-10-31T08:21:00+07:00', status: 'menunggu', risk: 'sedang', brandScore: 86, complianceNote: 'Pastikan halaman produk menampilkan harga dalam MYR.' },
  { id: 'ap-4', kind: 'konten', campaignId: 'cmp-modest-my', title: 'Konten: 3 cara lilit kain (8 varian)', summary: 'Potongan 6, 15, 30 detik, rasio 9:16 dan 4:5, caption Melayu.', requestedBy: 'Editor / QA', createdAt: '2026-10-31T09:02:00+07:00', status: 'menunggu', risk: 'rendah', brandScore: 93, complianceNote: null, preview: 'Hook: "Satu kain, tiga gaya, tanpa jahit." CTA: "Tanya warna di WhatsApp".' },
  { id: 'ap-5', kind: 'konten', campaignId: 'cmp-seragam-q4', title: 'Konten: sekuens email outreach (3 email)', summary: 'Untuk 120 prospek hasil B2B Export Prospector.', requestedBy: 'Script Writer', createdAt: '2026-10-31T09:15:00+07:00', status: 'menunggu', risk: 'rendah', brandScore: 89, complianceNote: 'Wajib ada tautan berhenti berlangganan dan identitas pengirim.' },
  { id: 'ap-6', kind: 'konten', campaignId: 'cmp-eu-fabric', title: 'Konten: copy landing B2B (EN dan DE)', summary: 'Klaim "certified organic" ditandai Compliance Guard.', requestedBy: 'Localization', createdAt: '2026-10-31T09:40:00+07:00', status: 'menunggu', risk: 'tinggi', brandScore: 78, complianceNote: 'Klaim "certified organic" belum didukung sertifikat di Brand Hub. Usulan: "plant-dyed, eco-certified fabric".' },
  { id: 'ap-7', kind: 'balasan', title: 'Balasan: PT Sinar Logistik (seragam 180 pcs)', summary: 'Draft balasan dengan tawaran konsultasi dan sampel.', requestedBy: 'Lead Qualifier', createdAt: '2026-10-31T10:05:00+07:00', status: 'menunggu', risk: 'rendah', brandScore: 95, complianceNote: null },
  { id: 'ap-8', kind: 'budget', campaignId: 'cmp-seragam-q4', title: 'Budget: naikkan Search seragam ke Rp80 ribu per hari', summary: 'CPL Search Rp84 ribu, di bawah target Rp100 ribu selama 7 hari.', requestedBy: 'Performance Analyst', createdAt: '2026-10-31T07:30:00+07:00', status: 'menunggu', risk: 'sedang', brandScore: 100, complianceNote: null },
];

export const LEADS: Lead[] = [
  { id: 'ld-1', name: 'Andini Prasetyo', company: 'PT Sinar Logistik', country: 'Indonesia', channel: 'Form website', campaignId: 'cmp-seragam-q4', adId: 'ad-2', segment: 'b2b', score: 92, status: 'baru', language: 'ID', receivedAt: '2026-10-31T09:48:00+07:00', message: 'Kami butuh seragam batik untuk 180 karyawan, deadline 10 Desember. Bisa minta katalog dan harga?', draftReply: 'Halo Bu Andini, terima kasih sudah menghubungi Batik Organik. Untuk 180 pcs dengan tenggat 10 Desember masih bisa kami kerjakan. Kami kirimkan katalog 6 motif seragam dan bisa jadwalkan konsultasi desain gratis minggu ini. Kapan waktu yang nyaman untuk panggilan 15 menit?', valueEstimate: 32_400_000 },
  { id: 'ld-2', name: 'Nur Aisyah', country: 'Malaysia', channel: 'WhatsApp', campaignId: 'cmp-modest-my', adId: 'ad-4', segment: 'b2c', score: 74, status: 'baru', language: 'MS', receivedAt: '2026-10-31T09:31:00+07:00', message: 'Salam, kain lilit warna hijau ada lagi? [MY1123]', draftReply: 'Waalaikumsalam Puan Nur Aisyah, terima kasih. Kain lilit hijau zaitun dan hijau pucuk masih ada. Kami kirimkan foto warna sekarang. Untuk 2 helai, penghantaran ke Malaysia percuma.', valueEstimate: 650_000 },
  { id: 'ld-3', name: 'Rizal Hakim', company: 'Bank Daerah (cabang Bogor)', country: 'Indonesia', channel: 'WhatsApp', campaignId: 'cmp-seragam-q4', adId: 'ad-1', segment: 'b2b', score: 81, status: 'dibalas', language: 'ID', receivedAt: '2026-10-30T15:20:00+07:00', message: 'Bisa custom logo di motif? Untuk 60 orang.', draftReply: 'Bisa, Pak Rizal. Logo bisa diolah menjadi motif cap. Kami siapkan 2 alternatif desain dalam 3 hari kerja.', valueEstimate: 10_800_000 },
  { id: 'ld-4', name: 'Keiko Tanaka', country: 'Jepang', channel: 'Instagram DM', campaignId: 'cmp-jp-craft', adId: 'ad-8', segment: 'b2c', score: 58, status: 'kualifikasi', language: 'JA', receivedAt: '2026-10-29T11:02:00+07:00', message: 'この布は日本に発送できますか？', draftReply: 'お問い合わせありがとうございます。日本への発送は可能です。送料と納期をご案内しますので、ご希望の柄を教えてください。', valueEstimate: 1_200_000 },
  { id: 'ld-5', name: 'Lukas Meier', company: 'Atelier Grün GmbH', country: 'Swiss', channel: 'Email', campaignId: 'cmp-eu-fabric', segment: 'b2b', score: 77, status: 'penawaran', language: 'DE', receivedAt: '2026-10-27T16:40:00+07:00', message: 'We are interested in plant-dyed fabric for a capsule collection, around 400 m. Please send swatches.', draftReply: 'Thank you, Mr Meier. We will ship a swatch book with 20 motifs this week, with FOB wholesale prices for 400 m.', valueEstimate: 48_000_000 },
  { id: 'ld-6', name: 'Siti Hajar', country: 'Brunei', channel: 'TikTok', campaignId: 'cmp-modest-my', segment: 'b2c', score: 41, status: 'baru', language: 'MS', receivedAt: '2026-10-31T07:12:00+07:00', message: 'Berapa harga?', draftReply: 'Hai Siti, harga kain lilit bermula BND 25. Boleh kami hantar katalog melalui WhatsApp?', valueEstimate: 300_000 },
  { id: 'ld-7', name: 'Hendra Wijaya', company: 'Hotel di Bogor (contoh)', country: 'Indonesia', channel: 'Shopee chat', segment: 'b2b', score: 66, status: 'menang', language: 'ID', receivedAt: '2026-10-22T13:00:00+07:00', message: 'Order kain 40 lembar untuk seragam staf front office.', draftReply: 'Terima kasih, Pak Hendra. Pesanan sudah kami proses.', valueEstimate: 3_800_000 },
  { id: 'ld-8', name: 'Farah Lim', country: 'Singapura', channel: 'Instagram DM', segment: 'b2c', score: 35, status: 'kalah', language: 'EN', receivedAt: '2026-10-20T19:15:00+07:00', message: 'Shipping to SG is too expensive for 1 piece.', draftReply: 'Understood, Farah. We offer free shipping for 2 pieces, would that help?', valueEstimate: 400_000 },
];

export const AGENTS: AgentDef[] = [
  { id: 'strategist', name: 'Campaign Strategist', status: 'disepakati', role: 'Orkestrator: tujuan, pasar, offer, budget, timeline', gate: 'approval', runsToday: 3, costTodayIdr: 4_200 },
  { id: 'research', name: 'Market Research', status: 'disepakati', role: 'Skor pasar, persona, kompetitor, tren', gate: 'baca', runsToday: 2, costTodayIdr: 6_100 },
  { id: 'media-buyer', name: 'Media Buyer', status: 'disepakati', role: 'Ad set, audience, objective, budget, aturan stop dan scale', gate: 'approval', runsToday: 5, costTodayIdr: 3_300 },
  { id: 'brand', name: 'Brand Manager', status: 'disepakati', role: 'Menjaga tone, visual, dan klaim', gate: 'otomatis', runsToday: 21, costTodayIdr: 2_900 },
  { id: 'script', name: 'Script Writer', status: 'disepakati', role: 'Hook, script, caption, copy ads', gate: 'approval', runsToday: 14, costTodayIdr: 5_600 },
  { id: 'editor', name: 'Editor / QA', status: 'disepakati', role: 'Ejaan, fakta, durasi, spesifikasi platform', gate: 'otomatis', runsToday: 19, costTodayIdr: 1_800 },
  { id: 'localization', name: 'Localization', status: 'disepakati', role: 'Terjemah dan adaptasi budaya per negara', gate: 'approval', runsToday: 9, costTodayIdr: 2_400 },
  { id: 'lead-qualifier', name: 'Lead Qualifier', status: 'disepakati', role: 'Skor lead, draft balasan, routing ke sales', gate: 'approval', runsToday: 12, costTodayIdr: 1_500 },
  { id: 'analyst', name: 'Performance Analyst', status: 'disepakati', role: 'Laporan, anomali, rekomendasi KPI', gate: 'baca', runsToday: 2, costTodayIdr: 3_900 },
  { id: 'prospector', name: 'B2B Export Prospector', status: 'tambahan', role: 'Daftar buyer dan draft email outreach', gate: 'approval', runsToday: 1, costTodayIdr: 7_800 },
  { id: 'creative', name: 'Creative Producer', status: 'tambahan', role: 'Aset pendukung Higgsfield, motif asli tidak diubah', gate: 'approval', runsToday: 4, costTodayIdr: 18_500 },
  { id: 'planner', name: 'Content Planner', status: 'tambahan', role: 'Kalender konten dan shot list kreator', gate: 'approval', runsToday: 1, costTodayIdr: 900 },
  { id: 'compliance', name: 'Compliance Guard', status: 'tambahan', role: 'Kebijakan iklan, klaim, label AI, consent', gate: 'otomatis', runsToday: 21, costTodayIdr: 2_100 },
  { id: 'community', name: 'Community Manager', status: 'tambahan', role: 'Draft balasan komentar dan DM publik', gate: 'approval', runsToday: 6, costTodayIdr: 1_100 },
];

export const AGENT_RUNS: AgentRun[] = [
  { id: 'run-1', agentId: 'compliance', task: 'Cek copy landing B2B EN/DE', at: '2026-10-31T09:41:00+07:00', durationSec: 6, costIdr: 120, status: 'ditolak' },
  { id: 'run-2', agentId: 'localization', task: 'Terjemah landing B2B ke Deutsch', at: '2026-10-31T09:38:00+07:00', durationSec: 18, costIdr: 340, status: 'selesai' },
  { id: 'run-3', agentId: 'lead-qualifier', task: 'Skor dan draft balasan PT Sinar Logistik', at: '2026-10-31T09:49:00+07:00', durationSec: 9, costIdr: 150, status: 'selesai' },
  { id: 'run-4', agentId: 'creative', task: 'Latar studio untuk foto lookbook (4 gambar)', at: '2026-10-31T09:10:00+07:00', durationSec: 74, costIdr: 2_100, status: 'selesai' },
  { id: 'run-5', agentId: 'editor', task: 'QA 8 varian 3 cara lilit', at: '2026-10-31T09:01:00+07:00', durationSec: 22, costIdr: 210, status: 'selesai' },
  { id: 'run-6', agentId: 'media-buyer', task: 'Ads plan Modest MY dan BN', at: '2026-10-31T08:19:00+07:00', durationSec: 31, costIdr: 680, status: 'selesai' },
  { id: 'run-7', agentId: 'strategist', task: 'Draft campaign Modest MY dan BN', at: '2026-10-31T08:11:00+07:00', durationSec: 44, costIdr: 1_400, status: 'selesai' },
  { id: 'run-8', agentId: 'analyst', task: 'Laporan harian dan usulan budget Search', at: '2026-10-31T07:30:00+07:00', durationSec: 27, costIdr: 1_300, status: 'selesai' },
  { id: 'run-9', agentId: 'creative', task: 'Video pendukung 5 detik (render ulang ke-2)', at: '2026-10-30T16:02:00+07:00', durationSec: 210, costIdr: 3_500, status: 'gagal' },
];

// 14 days of simulated performance for the active campaigns.
export const DAILY: DailyMetric[] = [
  { date: '2026-10-18', spend: 120_000, leads: 1, orders: 0 },
  { date: '2026-10-19', spend: 120_000, leads: 0, orders: 0 },
  { date: '2026-10-20', spend: 125_000, leads: 2, orders: 0 },
  { date: '2026-10-21', spend: 130_000, leads: 1, orders: 1 },
  { date: '2026-10-22', spend: 130_000, leads: 2, orders: 1 },
  { date: '2026-10-23', spend: 128_000, leads: 2, orders: 0 },
  { date: '2026-10-24', spend: 132_000, leads: 1, orders: 0 },
  { date: '2026-10-25', spend: 135_000, leads: 3, orders: 1 },
  { date: '2026-10-26', spend: 140_000, leads: 2, orders: 0 },
  { date: '2026-10-27', spend: 140_000, leads: 3, orders: 1 },
  { date: '2026-10-28', spend: 142_000, leads: 2, orders: 0 },
  { date: '2026-10-29', spend: 145_000, leads: 4, orders: 1 },
  { date: '2026-10-30', spend: 150_000, leads: 3, orders: 1 },
  { date: '2026-10-31', spend: 150_000, leads: 4, orders: 0 },
];

export const TRACKING = [
  { key: 'gtm', label: 'Google Tag Manager', status: 'belum' as const, note: 'Wadah semua tag. Butuh akses admin website.' },
  { key: 'pixel', label: 'Meta Pixel', status: 'belum' as const, note: 'Event: PageView, ViewContent, AddToCart, Purchase, Lead, Contact.' },
  { key: 'capi', label: 'Meta Conversions API', status: 'belum' as const, note: 'Lewat plugin partner atau Gateway dulu, lalu dari server ERP.' },
  { key: 'ga4', label: 'GA4 + Consent Mode v2', status: 'belum' as const, note: 'Key events: generate_lead, purchase, klik WA.' },
  { key: 'tiktok', label: 'TikTok Pixel + Events API', status: 'belum' as const, note: 'Pola sama dengan Meta.' },
  { key: 'utm', label: 'Konvensi UTM', status: 'siap' as const, note: 'Dibuat otomatis untuk setiap ad di sistem ini.' },
  { key: 'wa-code', label: 'Kode campaign di WhatsApp', status: 'siap' as const, note: 'Pesan otomatis berisi kode, misalnya [MY1123].' },
  { key: 'shopee', label: 'Voucher per campaign di Shopee', status: 'belum' as const, note: 'UTM tidak terbawa ke order Shopee.' },
];

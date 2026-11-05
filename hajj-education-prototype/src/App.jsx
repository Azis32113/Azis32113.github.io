import React, { useEffect, useReducer, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeftRight,
  ArrowRight,
  BadgeCheck,
  Ban,
  BookMarked,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDot,
  CircleHelp,
  CircleSlash2,
  Clock3,
  Compass,
  Download,
  Droplets,
  Eye,
  EyeOff,
  Flag,
  Footprints,
  GraduationCap,
  HandHeart,
  Heart,
  HeartHandshake,
  History,
  Info,
  Landmark,
  ListChecks,
  LockKeyhole,
  LogOut,
  MapPin,
  Menu,
  Milestone,
  MoonStar,
  Mountain,
  Navigation,
  PlaneLanding,
  RefreshCcw,
  RotateCcw,
  Route,
  Scale,
  Scissors,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  Shirt,
  Sparkles,
  Sunrise,
  Tent,
  Timer,
  Trash2,
  TriangleAlert,
  Trophy,
  User,
  UserRound,
  Volume2,
  Wind,
  X,
  XCircle,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  DATA — satu sumber aturan, konten prototipe                         */
/* ------------------------------------------------------------------ */

const SAVE_KEY = 'hajj-tamattu-prototype-v1';
const SAVE_VERSION = 1;

const RULE_SOURCE = {
  id: 'kemenag-2023',
  label: 'Tuntunan Manasik Haji dan Umrah',
  publisher: 'Kemenag RI',
  edition: '1444 H / 2023 M',
  isbn: '978-602-9127-46-1',
  short: 'Kemenag 2023',
};

const MODES = {
  latihan: {
    id: 'latihan',
    label: 'Latihan',
    tagline: 'Belajar dari kesalahan',
    description:
      'Checkpoint tiap fase, kuis bisa dicoba ulang, dan pelanggaran bisa dipelajari tanpa mengunci sesi.',
    Icon: GraduationCap,
    tone: 'sky',
    canRestore: true,
    hint: 'Hint aktif setelah jawaban pertama.',
  },
  simulasi: {
    id: 'simulasi',
    label: 'Simulasi',
    tagline: 'Satu percobaan, tanpa rollback',
    description:
      'Skor kuis memakai percobaan pertama. Tidak ada checkpoint. Konsekuensi tercatat permanen.',
    Icon: ShieldCheck,
    tone: 'violet',
    canRestore: false,
    hint: 'Percobaan pertama menentukan skor.',
  },
};

const GENDERS = {
  male: {
    id: 'male',
    label: 'Laki-laki',
    short: 'Laki-laki',
    Icon: User,
    note: 'Pakaian ihram tanpa jahitan; larangan menutup kepala dan memakai pakaian berjahit.',
  },
  female: {
    id: 'female',
    label: 'Perempuan',
    short: 'Perempuan',
    Icon: UserRound,
    note: 'Seluruh tubuh tertutup kecuali wajah dan telapak tangan (RD-03).',
  },
};

const CLASSIFICATIONS = {
  rukn: {
    label: 'Rukun',
    tone: 'rose',
    short: 'R',
    description: 'Tidak tergantikan. Jika tertinggal, outcome menjadi HajjTidakSah.',
  },
  wajib: {
    label: 'Wajib',
    tone: 'amber',
    short: 'W',
    description: 'Jika tertinggal, tercatat satu dam tertunda.',
  },
  sunnah: {
    label: 'Sunnah',
    tone: 'sky',
    short: 'S',
    description: 'Jika tertinggal, tidak ada konsekuensi hukum di model ini.',
  },
};

const PHASES = [
  {
    id: 'miqat',
    order: 0,
    label: 'Miqat & Ihram Umrah',
    short: 'Miqat',
    dayLabel: 'Pra-Haji',
    timeLabel: 'Fajar',
    momentLabel: 'Pra-Haji · Fajar',
    zoneLabel: 'Miqat · batas tanah haram',
    Icon: PlaneLanding,
    tone: 'sky',
    eyebrow: 'Langkah 01 · Niat',
    headline: 'Dari miqat, perjalanan dimulai.',
    narrative:
      'Anda tiba di miqat. Niat ihram umrah adalah rukun; jangan melewati batas miqat sebelum berniat. Kenakan pakaian ihram, lalu ucapkan talbiyah.',
    restPoint: { id: 'berangkat-makkah', label: 'Berangkat menuju Makkah' },
    focus: ['Niat ihram', 'Pakaian ihram', 'Talbiyah'],
    dua: 'miqat',
    tip: 'Ihram bukan hanya kain. Ia adalah niat yang mengikat sejak miqat hingga tahallul.',
  },
  {
    id: 'umrah',
    order: 1,
    label: 'Umrah — Tawaf, Sa’i, Tahallul',
    short: 'Umrah',
    dayLabel: 'Pra-Haji',
    timeLabel: 'Ashar',
    momentLabel: 'Pra-Haji · Ashar',
    zoneLabel: 'Masjidil Haram · Mataf',
    Icon: Compass,
    tone: 'emerald',
    eyebrow: 'Langkah 02 · Umrah',
    headline: 'Tujuh putaran, tujuh leg, lalu tahallul.',
    narrative:
      'Tawaf dimulai dari garis Hajar Aswad dengan Ka’bah di sisi kiri. Setelah tujuh putaran, lakukan Sa’i dari Safa ke Marwah. Tahallul menutup ihram episode pertama.',
    restPoint: { id: 'selesai-umrah', label: 'Selesai umrah, bersiap ke Mina' },
    focus: ['Tawaf 7', 'Sa’i 7', 'Tahallul'],
    dua: 'umrah',
    tip: 'Tawaf tanpa wudu tidak sah menurut sumber ini (RD-02). Perbaiki wudu, lalu ulangi.',
  },
  {
    id: 'haji8',
    order: 2,
    label: '8 Dzulhijjah — Ihram Haji',
    short: '8 Dzul.',
    dayLabel: '8 Dzulhijjah',
    timeLabel: 'Fajar',
    momentLabel: '8 Dzulhijjah · Fajar',
    zoneLabel: 'Mina · tenda jamaah',
    Icon: Tent,
    tone: 'emerald',
    eyebrow: 'Langkah 03 · Ihram kedua',
    headline: 'Ihram haji dimulai setelah tahallul umrah.',
    narrative:
      'Hari Tarwiyah. Setelah tahallul umrah, Anda memasuki ihram episode kedua untuk haji, lalu berangkat ke Mina. Mabit malam ini sunnah, bukan wajib.',
    restPoint: { id: 'malam-8', label: 'Mabit di Mina malam ke-8' },
    focus: ['Niat ihram haji', 'Berangkat ke Mina', 'Mabit 8'],
    dua: 'haji8',
    tip: 'Episode 2 tidak boleh dimulai sebelum tahallul episode 1 selesai (INV-9).',
  },
  {
    id: 'arafah',
    order: 3,
    label: '9 Dzulhijjah — Wuquf Arafah',
    short: 'Arafah',
    dayLabel: '9 Dzulhijjah',
    timeLabel: 'Zawal',
    momentLabel: '9 Dzulhijjah · Zawal',
    zoneLabel: 'Arafah · Jabal Rahmah',
    Icon: Mountain,
    tone: 'amber',
    eyebrow: 'Langkah 04 · Puncak haji',
    headline: 'Wuquf: satu-satunya rukun tanpa pengganti.',
    narrative:
      'Berdiri di Arafah sejak zawal 9 Dzulhijjah hingga fajar 10 Dzulhijjah. Jika jendela ini lewat tanpa wuquf, haji tidak sah dan tidak bisa dibeli kembali.',
    restPoint: { id: 'meninggalkan-arafah', label: 'Meninggalkan Arafah menuju Muzdalifah' },
    focus: ['Wuquf', 'Doa Arafah', 'Jendela waktu'],
    dua: 'arafah',
    tip: 'Wudu bukan syarat wuquf (RD-04), tetapi tetap jaga adab dan kebersihan.',
  },
  {
    id: 'muzdalifah',
    order: 4,
    label: 'Malam 10 — Mabit Muzdalifah',
    short: 'Muzdalifah',
    dayLabel: 'Malam 10 Dzulhijjah',
    timeLabel: 'Malam',
    momentLabel: 'Malam 10 Dzulhijjah',
    zoneLabel: 'Muzdalifah · langit terbuka',
    Icon: MoonStar,
    tone: 'violet',
    eyebrow: 'Langkah 05 · Malam',
    headline: 'Beristirahat, lalu mengambil kerikil.',
    narrative:
      'Mabit di Muzdalifah setelah meninggalkan Arafah. Ambil kerikil untuk melontar: 49 butir cukup untuk nafar awal (7 + 21 + 21).',
    restPoint: { id: 'fajar-muzdalifah', label: 'Menunggu fajar di Muzdalifah' },
    focus: ['Mabit', 'Ambil kerikil', 'Fajar'],
    dua: 'muzdalifah',
    tip: 'Mabit di Muzdalifah dimodelkan wajib; meninggalkannya menimbulkan dam.',
  },
  {
    id: 'haji10',
    order: 5,
    label: '10 Dzulhijjah — Lontar, Hady, Halq, Ifadah',
    short: '10 Dzul.',
    dayLabel: '10 Dzulhijjah',
    timeLabel: 'Pagi',
    momentLabel: '10 Dzulhijjah · Pagi',
    zoneLabel: 'Mina & Masjidil Haram',
    Icon: Sunrise,
    tone: 'amber',
    eyebrow: 'Langkah 06 · Hari Nahr',
    headline: 'Empat amalan besar dalam satu hari.',
    narrative:
      'Lontar Jumrah Aqabah, sembelih hady tamattu, halq, lalu Tawaf Ifadah. Tahallul episode kedua hanya terbuka setelah lontar dan hady.',
    restPoint: { id: 'malam-10', label: 'Mabit di Mina malam ke-10' },
    focus: ['Lontar Aqabah', 'Hady', 'Halq', 'Tawaf Ifadah'],
    dua: 'jamarat',
    tip: 'Tahallul kedua adalah gerbang, bukan hadiah otomatis. Model memakai urutan lontar → hady → halq → tawaf; RD-07 tentang urutan masih terbuka.',
  },
  {
    id: 'mina11',
    order: 6,
    label: '11 Dzulhijjah — Mabit & Lontar',
    short: '11 Dzul.',
    dayLabel: '11 Dzulhijjah',
    timeLabel: 'Ashar',
    momentLabel: '11 Dzulhijjah · Ashar',
    zoneLabel: 'Mina · Jamarat',
    Icon: Milestone,
    tone: 'amber',
    eyebrow: 'Langkah 07 · Hari Tasyrik',
    headline: 'Mabit di Mina, lalu lontar tiga jumrah.',
    narrative:
      'Mabit di Mina malam ke-11 adalah wajib. Setelah zawal, lontar Jumrah Ula, Wusta, dan Aqabah masing-masing tujuh kerikil.',
    restPoint: { id: 'malam-11', label: 'Mabit di Mina malam ke-11' },
    focus: ['Mabit wajib', '3 × 7 kerikil', 'Tertib'],
    dua: 'jamarat',
    tip: 'Meninggalkan mabit Mina menimbulkan dam (RD-01), bukan haji tidak sah.',
  },
  {
    id: 'mina12',
    order: 7,
    label: '12 Dzulhijjah — Nafar Awal',
    short: '12 Dzul.',
    dayLabel: '12 Dzulhijjah',
    timeLabel: 'Ashar',
    momentLabel: '12 Dzulhijjah · Ashar',
    zoneLabel: 'Mina · Jamarat',
    Icon: Milestone,
    tone: 'amber',
    eyebrow: 'Langkah 08 · Nafar',
    headline: 'Lontar terakhir, lalu keluar sebelum maghrib.',
    narrative:
      'Mabit malam ke-12 dan lontar tiga jumrah. Nafar awal berarti meninggalkan Mina sebelum maghrib 12 Dzulhijjah; jika tertinggal, lanjut ke 13.',
    restPoint: { id: 'meninggalkan-mina', label: 'Meninggalkan Mina menuju Makkah' },
    focus: ['Mabit wajib', 'Lontar 3 jumrah', 'Nafar awal'],
    dua: 'jamarat',
    tip: 'Nafar awal adalah pilihan, bukan kewajiban. Model ini mencatatnya sebagai sunnah.',
  },
  {
    id: 'wada',
    order: 8,
    label: 'Tawaf Wada — Perpisahan',
    short: 'Wada',
    dayLabel: '12 Dzulhijjah',
    timeLabel: 'Maghrib',
    momentLabel: '12 Dzulhijjah · Maghrib',
    zoneLabel: 'Masjidil Haram · Mataf',
    Icon: Landmark,
    tone: 'sky',
    eyebrow: 'Langkah 09 · Penutup',
    headline: 'Tujuh putaran terakhir, lalu laporan.',
    narrative:
      'Tawaf perpisahan dilakukan saat akan meninggalkan Makkah. Setelah audit fase terakhir, sesi ditutup dan laporan belajar disusun.',
    restPoint: { id: 'tutup-sesi', label: 'Menutup sesi & menyusun laporan' },
    focus: ['Tawaf Wada', 'Wudu', 'Laporan'],
    dua: 'wada',
    tip: 'Tawaf Wada yang tertinggal termasuk wajib; model mencatatnya sebagai dam tertunda.',
  },
];

const RITUALS = [
  {
    id: 'niatUmrah',
    phase: 'miqat',
    name: 'Niat ihram umrah',
    classification: 'rukn',
    kind: 'simple',
    effect: 'ihram1',
    Icon: HeartHandshake,
    citation: 'Kemenag 2023 · p.75',
    desc: 'Berniat ihram umrah di miqat, sebelum melewati batas miqat.',
    prerequisites: [],
  },
  {
    id: 'talbiyahUmrah',
    phase: 'miqat',
    name: 'Membaca talbiyah',
    classification: 'sunnah',
    kind: 'simple',
    Icon: Volume2,
    citation: 'Kemenag 2023 · p.76',
    desc: 'Mengucapkan talbiyah setelah niat ihram, sepanjang perjalanan menuju Makkah.',
    prerequisites: ['niatUmrah'],
  },
  {
    id: 'tawafUmrah',
    phase: 'umrah',
    name: 'Tawaf umrah — 7 putaran',
    classification: 'rukn',
    kind: 'tawaf',
    Icon: Compass,
    citation: 'Kemenag 2023 · p.82',
    desc: 'Tujuh putaran mengelilingi Ka’bah, berlawanan arah jarum jam, tanpa memotong Mataf.',
    prerequisites: ['niatUmrah'],
    requiresIhram: 1,
    requiresPurity: true,
  },
  {
    id: 'saiUmrah',
    phase: 'umrah',
    name: 'Sa’i — 7 leg Safa–Marwah',
    classification: 'rukn',
    kind: 'sai',
    Icon: Footprints,
    citation: 'Kemenag 2023 · p.88 · RD-05',
    desc: 'Tujuh leg dari Safa ke Marwah, arah bergantian, leg ke-7 berakhir di Marwah.',
    prerequisites: ['tawafUmrah'],
    requiresIhram: 1,
  },
  {
    id: 'tahallulUmrah',
    phase: 'umrah',
    name: 'Tahallul umrah',
    classification: 'wajib',
    kind: 'simple',
    effect: 'tahallul1',
    Icon: Scissors,
    citation: 'Kemenag 2023 · p.88',
    desc: 'Mencukur atau memendekkan rambut setelah Sa’i; menutup ihram episode pertama.',
    prerequisites: ['saiUmrah'],
  },
  {
    id: 'ihramHaji',
    phase: 'haji8',
    name: 'Niat ihram haji',
    classification: 'rukn',
    kind: 'simple',
    effect: 'ihram2',
    Icon: HeartHandshake,
    citation: 'Kemenag 2023 · p.75',
    desc: 'Memasuki ihram episode kedua pada 8 Dzulhijjah, setelah tahallul umrah.',
    prerequisites: ['tahallulUmrah'],
  },
  {
    id: 'mabitMina8',
    phase: 'haji8',
    name: 'Mabit di Mina malam ke-8',
    classification: 'sunnah',
    kind: 'simple',
    Icon: Tent,
    citation: 'Kemenag 2023 · p.94',
    desc: 'Bermalam di Mina pada malam 8 Dzulhijjah sebelum berangkat ke Arafah.',
    prerequisites: ['ihramHaji'],
  },
  {
    id: 'talbiyahHaji',
    phase: 'haji8',
    name: 'Talbiyah ihram haji',
    classification: 'sunnah',
    kind: 'simple',
    Icon: Volume2,
    citation: 'Kemenag 2023 · p.76',
    desc: 'Mengucapkan talbiyah selama ihram haji, terutama menuju Arafah.',
    prerequisites: ['ihramHaji'],
  },
  {
    id: 'wuquf',
    phase: 'arafah',
    name: 'Wuquf di Arafah',
    classification: 'rukn',
    kind: 'simple',
    effect: 'wuquf',
    Icon: Mountain,
    citation: 'Kemenag 2023 · p.93',
    desc: 'Hadir dan berdoa di Arafah antara zawal 9 Dzulhijjah dan fajar 10 Dzulhijjah.',
    prerequisites: ['ihramHaji'],
  },
  {
    id: 'doaArafah',
    phase: 'arafah',
    name: 'Memperbanyak doa Arafah',
    classification: 'sunnah',
    kind: 'simple',
    Icon: Sparkles,
    citation: 'Kemenag 2023 · p.93',
    desc: 'Memanfaatkan waktu wuquf untuk doa, dzikir, dan istighfar.',
    prerequisites: ['wuquf'],
  },
  {
    id: 'mabitMuzdalifah',
    phase: 'muzdalifah',
    name: 'Mabit di Muzdalifah',
    classification: 'wajib',
    kind: 'simple',
    Icon: MoonStar,
    citation: 'Kemenag 2023 · p.67',
    desc: 'Bermalam di Muzdalifah setelah meninggalkan Arafah, sampai fajar 10 Dzulhijjah.',
    prerequisites: ['wuquf'],
  },
  {
    id: 'ambilKerikil',
    phase: 'muzdalifah',
    name: 'Mengambil 49 kerikil',
    classification: 'sunnah',
    kind: 'simple',
    effect: 'pebbles49',
    Icon: CircleDot,
    citation: 'Kemenag 2023 · p.97',
    desc: 'Mengumpulkan kerikil untuk lontar Jumrah: 7 + 21 + 21 untuk nafar awal.',
    prerequisites: ['wuquf'],
  },
  {
    id: 'jamaratAqabah',
    phase: 'haji10',
    name: 'Lontar Jumrah Aqabah',
    classification: 'wajib',
    kind: 'jamarat',
    pillars: ['aqabah'],
    Icon: Milestone,
    citation: 'Kemenag 2023 · p.97',
    desc: 'Melontar Jumrah Aqabah dengan tujuh kerikil pada 10 Dzulhijjah.',
    prerequisites: ['wuquf'],
  },
  {
    id: 'hady',
    phase: 'haji10',
    name: 'Menyembelih hady tamattu',
    classification: 'wajib',
    kind: 'simple',
    effect: 'hady',
    Icon: Heart,
    citation: 'Kemenag 2023 · p.103',
    desc: 'Hady wajib bagi haji Tamattu; dilakukan pada 10 Dzulhijjah atau hari tasyrik.',
    prerequisites: ['wuquf'],
  },
  {
    id: 'tahallulHaji',
    phase: 'haji10',
    name: 'Tahallul haji — halq',
    classification: 'wajib',
    kind: 'simple',
    effect: 'tahallul2',
    Icon: Scissors,
    citation: 'Kemenag 2023 · p.99 · INV-11',
    desc: 'Mencukur rambut setelah lontar Aqabah dan hady; menutup ihram episode kedua.',
    prerequisites: ['jamaratAqabah', 'hady'],
  },
  {
    id: 'tawafIfadah',
    phase: 'haji10',
    name: 'Tawaf Ifadah — 7 putaran',
    classification: 'rukn',
    kind: 'tawaf',
    Icon: Compass,
    citation: 'Kemenag 2023 · p.82',
    desc: 'Tawaf rukun haji; tujuh putaran dengan wudu. Model menempatkannya setelah halq (RD-07 terbuka).',
    prerequisites: ['tahallulHaji'],
    requiresPurity: true,
  },
  {
    id: 'mabitMina11',
    phase: 'mina11',
    name: 'Mabit di Mina malam ke-11',
    classification: 'wajib',
    kind: 'simple',
    Icon: Tent,
    citation: 'Kemenag 2023 · p.67 · RD-01',
    desc: 'Bermalam di Mina pada malam 11 Dzulhijjah; meninggalkannya menimbulkan dam.',
    prerequisites: ['tawafIfadah'],
  },
  {
    id: 'jamarat11',
    phase: 'mina11',
    name: 'Lontar 3 jumrah — 11 Dzulhijjah',
    classification: 'wajib',
    kind: 'jamarat',
    pillars: ['ula', 'wusta', 'aqabah'],
    Icon: Milestone,
    citation: 'Kemenag 2023 · p.98',
    desc: 'Melontar Jumrah Ula, Wusta, dan Aqabah masing-masing tujuh kerikil setelah zawal.',
    prerequisites: ['tawafIfadah'],
  },
  {
    id: 'mabitMina12',
    phase: 'mina12',
    name: 'Mabit di Mina malam ke-12',
    classification: 'wajib',
    kind: 'simple',
    Icon: Tent,
    citation: 'Kemenag 2023 · p.67 · RD-01',
    desc: 'Bermalam di Mina pada malam 12 Dzulhijjah sebelum nafar awal.',
    prerequisites: ['jamarat11'],
  },
  {
    id: 'jamarat12',
    phase: 'mina12',
    name: 'Lontar 3 jumrah — 12 Dzulhijjah',
    classification: 'wajib',
    kind: 'jamarat',
    pillars: ['ula', 'wusta', 'aqabah'],
    Icon: Milestone,
    citation: 'Kemenag 2023 · p.98',
    desc: 'Melontar tiga jumrah masing-masing tujuh kerikil pada 12 Dzulhijjah.',
    prerequisites: ['jamarat11'],
  },
  {
    id: 'nafarAwal',
    phase: 'mina12',
    name: 'Nafar awal — keluar Mina',
    classification: 'sunnah',
    kind: 'simple',
    Icon: LogOut,
    citation: 'Kemenag 2023 · p.100',
    desc: 'Meninggalkan Mina sebelum maghrib 12 Dzulhijjah; tidak wajib, tetapi mengakhiri hari tasyrik.',
    prerequisites: ['jamarat12'],
  },
  {
    id: 'tawafWada',
    phase: 'wada',
    name: 'Tawaf Wada — 7 putaran',
    classification: 'wajib',
    kind: 'tawaf',
    Icon: Landmark,
    citation: 'Kemenag 2023 · p.102',
    desc: 'Tawaf perpisahan saat akan meninggalkan Makkah; tujuh putaran dengan wudu.',
    prerequisites: ['jamarat12'],
    requiresPurity: true,
  },
];

const PROMPTS = [
  {
    id: 'q-miqat-niat',
    phase: 'miqat',
    title: 'Kuis Miqat',
    Icon: MapPin,
    question: 'Kapan niat ihram umrah dilakukan?',
    options: [
      'Di rumah, sebelum berangkat dari Indonesia',
      'Di miqat, sebelum melewati batas miqat',
      'Setelah tiba dan melihat Ka’bah',
      'Saat memulai tawaf pertama',
    ],
    correct: 1,
    hint: 'Batas miqat adalah garis, bukan bangunan Masjidil Haram.',
    explanation:
      'Niat ihram dilakukan di miqat sebelum melewati batasnya. Melewati miqat tanpa ihram tercatat sebagai pelanggaran.',
    citation: 'Kemenag 2023 · p.75 · INV-10',
  },
  {
    id: 'q-ihram-larangan',
    phase: 'miqat',
    title: 'Kuis Larangan Ihram',
    Icon: Shirt,
    variants: {
      male: {
        question: 'Pakaian apa yang dilarang saat ihram bagi laki-laki?',
        options: [
          'Kain ihram tanpa jahitan',
          'Pakaian berjahit yang membentuk badan',
          'Sandal terbuka',
          'Ikat pinggang kain',
        ],
        correct: 1,
        explanation:
          'Laki-laki dalam ihram tidak memakai pakaian berjahit yang membentuk badan, tidak menutup kepala, dan tidak memakai wewangian.',
        citation: 'Kemenag 2023 · p.76',
      },
      female: {
        question:
          'Bagian tubuh mana yang tidak boleh tertutup saat ihram bagi perempuan menurut sumber ini?',
        options: [
          'Seluruh tubuh kecuali mata',
          'Wajah dan telapak tangan',
          'Rambut dan leher',
          'Kaki dan pergelangan tangan',
        ],
        correct: 1,
        explanation:
          'Perempuan menutup seluruh tubuh kecuali wajah dan telapak tangan. Menutup wajah saat ihram termasuk larangan pada model ini (RD-03).',
        citation: 'Kemenag 2023 · p.75 · RD-03',
      },
    },
    hint: 'Sumber ini memakai posisi yang tegas: wajah dan telapak tangan terbuka.',
    explanation: 'Pilih posisi yang dipakai sumber aturan sesi ini.',
    citation: 'Kemenag 2023 · p.75',
  },
  {
    id: 'q-umrah-wudu',
    phase: 'umrah',
    title: 'Kuis Purity Tawaf',
    Icon: Droplets,
    question: 'Anda belum berwudu dan akan memulai tawaf. Apa yang benar?',
    options: [
      'Tawaf dulu, wudu menyusul setelah putaran ketiga',
      'Ambil wudu; tawaf tanpa wudu tidak sah (RD-02)',
      'Cukup berwudu setelah tawaf selesai',
      'Tawaf sah, tetapi harus membayar dam',
    ],
    correct: 1,
    hint: 'Pada sumber ini, purity adalah syarat sah, bukan wajib yang bisa diganti dam.',
    explanation:
      'Kemenag 2023 menempatkan purity sebagai syarat sah tawaf. Tawaf yang dikerjakan tanpa wudu tidak dihitung; perbaiki wudu lalu ulangi.',
    citation: 'Kemenag 2023 · p.82 · RD-02',
  },
  {
    id: 'q-umrah-sai',
    phase: 'umrah',
    title: 'Kuis Sa’i',
    Icon: Footprints,
    question: 'Bagaimana hitungan Sa’i yang benar?',
    options: [
      'Mulai dari Marwah, berakhir di Safa, 7 leg',
      'Mulai dari Safa, berakhir di Marwah, 7 leg',
      'Mulai dari mana saja, 7 putaran lingkaran',
      'Mulai dari Safa, berakhir di Safa, 8 leg',
    ],
    correct: 1,
    hint: 'Sa’i bukan lingkaran. Leg pertama Safa → Marwah, leg ketujuh juga berakhir di Marwah.',
    explanation:
      'Sa’i adalah perjalanan bolak-balik Safa–Marwah. Leg 1 harus Safa → Marwah; dengan tujuh leg, leg terakhir berakhir di Marwah.',
    citation: 'Kemenag 2023 · p.88 · RD-05',
  },
  {
    id: 'q-haji-niat',
    phase: 'haji8',
    title: 'Kuis Ihram Haji',
    Icon: HeartHandshake,
    question: 'Kapan ihram haji untuk Tamattu dimulai?',
    options: [
      'Sejak keberangkatan dari Indonesia, bersamaan dengan ihram umrah',
      'Setelah tahallul umrah, pada 8 Dzulhijjah',
      'Setelah wuquf di Arafah',
      'Saat tawaf ifadah',
    ],
    correct: 1,
    hint: 'Tamattu memisahkan dua episode ihram dengan tahallul.',
    explanation:
      'Haji Tamattu memakai dua episode ihram: umrah, tahallul, lalu ihram haji pada 8 Dzulhijjah. Episode 2 tidak boleh dimulai sebelum tahallul episode 1.',
    citation: 'Kemenag 2023 · p.75 · INV-9',
  },
  {
    id: 'q-arafah-waktu',
    phase: 'arafah',
    title: 'Kuis Wuquf',
    Icon: Timer,
    question: 'Apa batas waktu wuquf yang benar?',
    options: [
      'Sejak fajar 8 Dzulhijjah sampai maghrib 9 Dzulhijjah',
      'Sejak zawal 9 Dzulhijjah sampai fajar 10 Dzulhijjah',
      'Hanya pada siang 9 Dzulhijjah',
      'Sejak maghrib 9 Dzulhijjah sampai maghrib 10 Dzulhijjah',
    ],
    correct: 1,
    hint: 'Jendela dibuka saat matahari tergelincir pada 9 Dzulhijjah dan ditutup saat fajar 10.',
    explanation:
      'Wuquf hanya tercatat di dalam jendela zawal 9 Dzulhijjah hingga fajar 10 Dzulhijjah. Jika jendela lewat tanpa wuquf, outcome menjadi HajjTidakSah dan terminal.',
    citation: 'Kemenag 2023 · p.93 · INV-8',
  },
  {
    id: 'q-muzdalifah-kerikil',
    phase: 'muzdalifah',
    title: 'Kuis Kerikil',
    Icon: CircleDot,
    question: 'Berapa kerikil yang cukup untuk nafar awal?',
    options: ['21 butir', '49 butir', '70 butir', '7 butir'],
    correct: 1,
    hint: 'Tujuh untuk Aqabah pada 10 Dzulhijjah, lalu 21 + 21 pada 11 dan 12.',
    explanation:
      'Nafar awal memerlukan 49 kerikil: 7 untuk Jumrah Aqabah, 21 untuk 11 Dzulhijjah, dan 21 untuk 12 Dzulhijjah.',
    citation: 'Kemenag 2023 · p.97',
  },
  {
    id: 'q-mina-mabit',
    phase: 'mina11',
    title: 'Kuis Mabit Mina',
    Icon: Tent,
    question: 'Apa konsekuensi meninggalkan mabit di Mina pada malam 11–12 Dzulhijjah?',
    options: [
      'Tidak ada konsekuensi karena mabit hanya sunnah',
      'Haji langsung tidak sah',
      'Tercatat satu dam tertunda; haji tetap berlanjut',
      'Harus mengulang tawaf ifadah',
    ],
    correct: 2,
    hint: 'Sumber menempatkan mabit Mina sebagai wajib, dan wajib yang tertinggal menghasilkan dam.',
    explanation:
      'Mabit Mina adalah wajib (RD-01). Meninggalkannya tidak membatalkan haji, tetapi mencatat satu dam tertunda. Ini berbeda dari rukun yang hilang.',
    citation: 'Kemenag 2023 · p.67, p.94 · RD-01',
  },
  {
    id: 'q-mina-nafar',
    phase: 'mina12',
    title: 'Kuis Nafar',
    Icon: LogOut,
    question: 'Apa arti nafar awal?',
    options: [
      'Meninggalkan Mina sebelum maghrib 12 Dzulhijjah',
      'Meninggalkan Arafah sebelum maghrib 9 Dzulhijjah',
      'Mabit di Mina selama tiga malam',
      'Melontar hanya Jumrah Aqabah',
    ],
    correct: 0,
    hint: 'Nafar awal adalah pilihan pulang lebih cepat dari Mina.',
    explanation:
      'Nafar awal berarti meninggalkan Mina sebelum maghrib 12 Dzulhijjah. Jika masih berada di Mina saat maghrib, jamaah melanjutkan ke 13 Dzulhijjah.',
    citation: 'Kemenag 2023 · p.100',
  },
  {
    id: 'q-wada',
    phase: 'wada',
    title: 'Kuis Tawaf Wada',
    Icon: Landmark,
    question: 'Kapan Tawaf Wada dilakukan?',
    options: [
      'Sebelum berangkat ke Arafah',
      'Saat akan meninggalkan Makkah, setelah rangkaian haji',
      'Setelah lontar Jumrah Aqabah saja',
      'Sebelum ihram haji dimulai',
    ],
    correct: 1,
    hint: 'Wada berarti perpisahan dengan Ka’bah.',
    explanation:
      'Tawaf Wada adalah tawaf perpisahan yang dilakukan saat akan meninggalkan Makkah. Dalam model ini ia termasuk wajib; jika tertinggal, tercatat dam tertunda.',
    citation: 'Kemenag 2023 · p.102',
  },
];

const DUAS = {
  miqat: {
    title: 'Talbiyah',
    arabic:
      'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
    latin:
      'Labbaik Allahumma labbaik, labbaika laa syariika laka labbaik, innal-hamda wan-ni‘mata laka wal-mulk, laa syariika lak.',
    translation:
      'Aku datang memenuhi panggilan-Mu, ya Allah, aku datang. Tidak ada sekutu bagi-Mu, aku datang. Sesungguhnya pujian, nikmat, dan kerajaan adalah milik-Mu, tidak ada sekutu bagi-Mu.',
    source: 'HR. Bukhari & Muslim',
  },
  umrah: {
    title: 'Doa di sekitar tawaf',
    arabic:
      'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    latin:
      'Subhanallah, walhamdulillah, wa laa ilaaha illallah, wallahu akbar, wa laa haula wa laa quwwata illaa billah.',
    translation:
      'Mahasuci Allah, segala pujian bagi Allah, tidak ada tuhan selain Allah, dan Allah Mahabesar. Tidak ada daya dan kekuatan kecuali dengan Allah.',
    source: 'Dzikir tawaf · Kemenag 2023',
  },
  haji8: {
    title: 'Talbiyah ihram haji',
    arabic:
      'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
    latin:
      'Labbaik Allahumma labbaik, labbaika laa syariika laka labbaik, innal-hamda wan-ni‘mata laka wal-mulk, laa syariika lak.',
    translation:
      'Aku datang memenuhi panggilan-Mu, ya Allah, aku datang. Pujian, nikmat, dan kerajaan adalah milik-Mu, tanpa sekutu.',
    source: 'HR. Bukhari & Muslim',
  },
  arafah: {
    title: 'Doa terbaik di Arafah',
    arabic:
      'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    latin:
      'Laa ilaaha illallah wahdahu laa syariika lah, lahul-mulku wa lahul-hamdu, wa huwa ‘alaa kulli syai’in qadiir.',
    translation:
      'Tidak ada tuhan selain Allah, Yang Maha Esa, tidak ada sekutu bagi-Nya. Milik-Nya kerajaan dan pujian, dan Dia Mahakuasa atas segala sesuatu.',
    source: 'HR. Tirmidzi · doa Arafah',
  },
  muzdalifah: {
    title: 'Doa malam Muzdalifah',
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدِّينِ وَالدُّنْيَا وَالْآخِرَةِ',
    latin:
      'Allahumma inni as’alukal-‘afwa wal-‘aafiyata fid-diini wad-dunyaa wal-aakhirah.',
    translation:
      'Ya Allah, aku memohon ampunan dan keselamatan dalam agama, dunia, dan akhirat.',
    source: 'Doa ma’tsur · Kemenag 2023',
  },
  jamarat: {
    title: 'Doa saat melontar',
    arabic: 'بِسْمِ اللَّهِ، وَاللَّهُ أَكْبَرُ، رَجْمًا لِلشَّيْطَانِ وَرِضًا لِلرَّحْمَنِ',
    latin: 'Bismillah, wallahu akbar, rajman lisy-syaithani wa ridhan lir-rahman.',
    translation:
      'Dengan nama Allah, Allah Mahabesar. Aku melontar sebagai penolakan terhadap syaitan dan mencari ridha Allah Yang Maha Pengasih.',
    source: 'Dzikir melontar jumrah · Kemenag 2023',
  },
  wada: {
    title: 'Doa Tawaf Wada',
    arabic:
      'اللَّهُمَّ لَا تَجْعَلْهُ آخِرَ الْعَهْدِ بِبَيْتِكَ الْحَرَامِ، وَارْزُقْنِي الْعَوْدَةَ إِلَيْهِ',
    latin:
      'Allahumma laa taj‘alhu aakhiral-‘ahdi bibaitikal-haraam, warzuqnii al-‘audata ilaih.',
    translation:
      'Ya Allah, jangan jadikan ini perjumpaan terakhir dengan rumah-Mu yang suci, dan karuniakanlah kepadaku kesempatan kembali kepadanya.',
    source: 'Doa tawaf wada · Kemenag 2023',
  },
};

// Bacaan pilihan per putaran/leg. Tidak ada kewajiban doa yang berbeda tiap
// putaran; daftar ini dipakai untuk latihan agar jemaah terbiasa berdzikir
// sepanjang tawaf dan sa'i, bukan hanya di satu titik.
const ROUTE_DUAS = {
  tawaf: [
    {
      title: 'Putaran 1 · iman dan mengikuti sunnah',
      arabic:
        'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ، اللَّهُمَّ إِيمَانًا بِكَ وَتَصْدِيقًا بِكِتَابِكَ وَوَفَاءً بِعَهْدِكَ وَاتِّبَاعًا لِسُنَّةِ نَبِيِّكَ مُحَمَّدٍ',
      latin:
        'Subhanallah, walhamdulillah, wa laa ilaaha illallah, wallahu akbar. Allahumma iimaanan bika wa tashdiiqan bikitaabika wa wafaa’an bi‘ahdika wattibaa‘an lisunnati nabiyyika Muhammad.',
      translation:
        'Mahasuci Allah, segala puji bagi Allah, tidak ada tuhan selain Allah, dan Allah Mahabesar. Ya Allah, aku bertawaf karena iman kepada-Mu, membenarkan kitab-Mu, menepati janji-Mu, dan mengikuti sunnah Nabi-Mu Muhammad.',
      source: 'Doa tawaf putaran 1 · Kemenag 2023',
    },
    {
      title: 'Putaran 2 · rumah dan perlindungan',
      arabic:
        'اللَّهُمَّ إِنَّ هَذَا الْبَيْتَ بَيْتُكَ، وَالْحَرَمَ حَرَمُكَ، وَالْأَمْنَ أَمْنُكَ، وَالْعَبْدَ عَبْدُكَ، وَأَنَا عَبْدُكَ وَابْنُ عَبْدِكَ، فَحَرِّمْ لَحْمِي وَدَمِي عَلَى النَّارِ',
      latin:
        'Allahumma inna haadzal baita baituka, wal harama haramuka, wal amna amnuka, wal ‘abda ‘abduka, wa ana ‘abduka wabnu ‘abdika, faharrim lahmii wa damii ‘alan naar.',
      translation:
        'Ya Allah, sesungguhnya Bait ini rumah-Mu, tanah suci ini tanah-Mu, negeri aman ini negeri-Mu, dan hamba ini hamba-Mu. Aku adalah hamba-Mu dan anak dari hamba-Mu, maka haramkanlah daging dan darahku dari siksa neraka.',
      source: 'Doa tawaf putaran 2 · Kemenag 2023',
    },
    {
      title: 'Putaran 3 · berlindung dari keburukan',
      arabic:
        'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الشَّكِّ وَالشِّرْكِ وَالشِّقَاقِ وَالنِّفَاقِ وَسُوءِ الْأَخْلَاقِ وَسُوءِ الْمَنْظَرِ وَالْمُنْقَلَبِ فِي الْمَالِ وَالْأَهْلِ وَالْوَلَدِ',
      latin:
        'Allahumma innii a‘uudzu bika minasy syakki wasy syirki wasy syiqaaqi wan nifaaqi wa suu’il akhlaaqi wa suu’il mandzari wal munqalabi fil maali wal ahli wal walad.',
      translation:
        'Ya Allah, aku berlindung kepada-Mu dari keraguan, syirik, perpecahan, kemunafikan, akhlak yang buruk, penampilan yang buruk, serta perubahan yang buruk pada harta, keluarga, dan anak.',
      source: 'Doa tawaf putaran 3 · Kemenag 2023',
    },
    {
      title: 'Putaran 4 · umrah yang diterima',
      arabic:
        'اللَّهُمَّ اجْعَلْهَا عُمْرَةً مَقْبُولَةً وَسَعْيًا مَشْكُورًا وَذَنْبًا مَغْفُورًا وَعَمَلًا صَالِحًا مَقْبُولًا وَتِجَارَةً لَنْ تَبُورَ',
      latin:
        'Allahummaj‘alhaa ‘umratan maqbuulatan wa sa‘yan masykuuran wa dzanban maghfuuran wa ‘amalan shaalihan maqbuulan wa tijaaratan lan tabuur.',
      translation:
        'Ya Allah, jadikanlah ini umrah yang diterima, sa’i yang disyukuri, dosa yang diampuni, amal saleh yang diterima, dan perniagaan yang tidak akan merugi.',
      source: 'Doa tawaf putaran 4 · Kemenag 2023',
    },
    {
      title: 'Putaran 5 · naungan dan telaga',
      arabic:
        'اللَّهُمَّ أَظِلَّنِي تَحْتَ ظِلِّ عَرْشِكَ يَوْمَ لَا ظِلَّ إِلَّا ظِلُّكَ، وَأَسْقِنِي مِنْ حَوْضِ نَبِيِّكَ مُحَمَّدٍ شُرْبَةً هَنِيئَةً لَا أَظْمَأُ بَعْدَهَا أَبَدًا',
      latin:
        'Allahumma azhillanii tahta zhilli ‘arsyika yauma laa zhilla illaa zhilluka, wa asqinii min haudhi nabiyyika Muhammadin syurbatan hanii’atan laa azhma’u ba‘dahaa abadaa.',
      translation:
        'Ya Allah, naungilah aku di bawah naungan Arsy-Mu pada hari yang tidak ada naungan selain naungan-Mu, dan berilah aku minum dari telaga Nabi-Mu Muhammad dengan minuman yang menyenangkan, sehingga aku tidak akan haus lagi selamanya.',
      source: 'Doa tawaf putaran 5 · Kemenag 2023',
    },
    {
      title: 'Putaran 6 · hak dan ampunan',
      arabic:
        'اللَّهُمَّ إِنَّ لَكَ عَلَيَّ حُقُوقًا كَثِيرَةً فِيمَا بَيْنِي وَبَيْنَكَ، وَحُقُوقًا كَثِيرَةً فِيمَا بَيْنِي وَبَيْنَ خَلْقِكَ، فَمَا كَانَ لَكَ مِنْهَا فَاغْفِرْهُ لِي، وَمَا كَانَ لِخَلْقِكَ فَتَحَمَّلْهُ عَنِّي',
      latin:
        'Allahumma inna laka ‘alayya huquuqan katsiiratan fiimaa bainii wa bainaka, wa huquuqan katsiiratan fiimaa bainii wa baina khalqika. Famaa kaana laka minhaa faghfirhu lii, wa maa kaana likhalqika fatahammalhu ‘annii.',
      translation:
        'Ya Allah, sesungguhnya Engkau memiliki banyak hak atasku dalam hubunganku dengan-Mu, dan banyak hak dalam hubunganku dengan makhluk-Mu. Apa yang menjadi hak-Mu, ampunilah aku; apa yang menjadi hak makhluk-Mu, tanggunglah itu dariku.',
      source: 'Doa tawaf putaran 6 · Kemenag 2023',
    },
    {
      title: 'Putaran 7 · iman yang sempurna',
      arabic:
        'اللَّهُمَّ إِنِّي أَسْأَلُكَ إِيمَانًا كَامِلًا وَيَقِينًا صَادِقًا وَرِزْقًا وَاسِعًا وَحَلَالًا طَيِّبًا وَقَلْبًا خَاشِعًا وَلِسَانًا ذَاكِرًا وَتَوْبَةً نَصُوحًا',
      latin:
        'Allahumma innii as’aluka iimaanan kaamilan wa yaqiinan shaadiqan wa rizqan waasi‘an wa halaalan thayyiban wa qalban khaasyi‘an wa lisaanan dzaakiran wa taubatan nashuuhan.',
      translation:
        'Ya Allah, aku memohon kepada-Mu iman yang sempurna, keyakinan yang benar, rezeki yang luas, halal lagi baik, hati yang khusyuk, lisan yang selalu berzikir, dan tobat yang tulus.',
      source: 'Doa tawaf putaran 7 · Kemenag 2023',
    },
  ],
  sai: [
    {
      title: 'Leg 1 · Safa → Marwah',
      arabic:
        'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ كَبِيرًا وَالْحَمْدُ لِلَّهِ كَثِيرًا وَسُبْحَانَ اللَّهِ الْعَظِيمِ وَبِحَمْدِهِ بُكْرَةً وَأَصِيلًا',
      latin:
        'Allahu akbar, Allahu akbar, Allahu akbar. Allahu akbar kabiira, walhamdulillahi katsiira, wa subhanallahil ‘azhiimi wa bihamdihi bukratan wa ashiilaa.',
      translation:
        'Allah Mahabesar, Allah Mahabesar, Allah Mahabesar. Allah Mahabesar dengan segala kebesaran-Nya, segala puji bagi Allah dengan pujian yang banyak, dan Mahasuci Allah Yang Mahaagung serta pujian bagi-Nya di waktu pagi dan petang.',
      source: 'Dzikir sa’i leg 1 · Kemenag 2023',
    },
    {
      title: 'Leg 2 · Marwah → Safa',
      arabic:
        'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ، لَا إِلَهَ إِلَّا اللَّهُ الْوَاحِدُ الْفَرْدُ الصَّمَدُ',
      latin:
        'Allahu akbar, Allahu akbar, Allahu akbar wa lillahil hamd. Laa ilaaha illallahul waahidul fardush shamad.',
      translation:
        'Allah Mahabesar, Allah Mahabesar, Allah Mahabesar, dan segala puji bagi Allah. Tidak ada tuhan selain Allah Yang Maha Esa, Yang Maha Tunggal, dan tempat bergantung segala sesuatu.',
      source: 'Dzikir sa’i leg 2 · Kemenag 2023',
    },
    {
      title: 'Leg 3 · Safa → Marwah',
      arabic:
        'رَبَّنَا أَتْمِمْ لَنَا نُورَنَا وَاغْفِرْ لَنَا إِنَّكَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنَ الْخَيْرِ كُلِّهِ عَاجِلِهِ وَآجِلِهِ',
      latin:
        'Rabbanaa atmim lanaa nuuranaa waghfir lanaa innaka ‘alaa kulli syai’in qadiir. Allahumma innii as’aluka minal khairi kullihi ‘aajilihi wa aajilih.',
      translation:
        'Ya Tuhan kami, sempurnakanlah cahaya kami dan ampunilah kami; sesungguhnya Engkau Mahakuasa atas segala sesuatu. Ya Allah, aku memohon kepada-Mu segala kebaikan, yang segera maupun yang ditunda.',
      source: 'Dzikir sa’i leg 3 · Kemenag 2023',
    },
    {
      title: 'Leg 4 · Marwah → Safa',
      arabic:
        'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ خَيْرِ مَا تَعْلَمُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا تَعْلَمُ، وَأَسْتَغْفِرُكَ مِنْ كُلِّ مَا تَعْلَمُ، إِنَّكَ أَنْتَ عَلَّامُ الْغُيُوبِ',
      latin:
        'Allahumma innii as’aluka min khairi maa ta‘lamu, wa a‘uudzu bika min syarri maa ta‘lamu, wa astaghfiruka min kulli maa ta‘lamu, innaka anta ‘allaamul ghuyuub.',
      translation:
        'Ya Allah, aku memohon kepada-Mu kebaikan yang Engkau ketahui, aku berlindung kepada-Mu dari keburukan yang Engkau ketahui, dan aku memohon ampun kepada-Mu dari segala yang Engkau ketahui. Sesungguhnya Engkau Maha Mengetahui segala yang gaib.',
      source: 'Dzikir sa’i leg 4 · Kemenag 2023',
    },
    {
      title: 'Leg 5 · Safa → Marwah',
      arabic:
        'سُبْحَانَكَ مَا شَكَرْنَاكَ حَقَّ شُكْرِكَ يَا اللَّهُ، سُبْحَانَكَ مَا أَعْلَى شَأْنَكَ يَا اللَّهُ، اللَّهُمَّ حَبِّبْ إِلَيْنَا الْإِيمَانَ وَزَيِّنْهُ فِي قُلُوبِنَا',
      latin:
        'Subhaanaka maa syakarnaaka haqqa syukrika yaa Allah, subhaanaka maa a‘laa sya’naka yaa Allah. Allahumma habbib ilainal iimaana wa zayyinhu fii quluubinaa.',
      translation:
        'Mahasuci Engkau, kami belum mampu mensyukuri-Mu dengan syukur yang semestinya, ya Allah. Mahasuci Engkau, betapa agung kedudukan-Mu, ya Allah. Ya Allah, cintakanlah iman kepada kami dan hiasilah ia di dalam hati kami.',
      source: 'Dzikir sa’i leg 5 · Kemenag 2023',
    },
    {
      title: 'Leg 6 · Marwah → Safa',
      arabic:
        'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتَّقَى وَالْعَفَافَ وَالْغِنَى وَالْعَمَلَ لِمَا تُحِبُّ وَتَرْضَى',
      latin:
        'Allahumma innii as’alukal hudaa wat tuqaa wal ‘afaafa wal ghinaa wal ‘amala limaa tuhibbu wa tardaa.',
      translation:
        'Ya Allah, aku memohon kepada-Mu petunjuk, ketakwaan, kesucian diri, kecukupan, dan amal yang Engkau cintai dan ridai.',
      source: 'Dzikir sa’i leg 6 · Kemenag 2023',
    },
    {
      title: 'Leg 7 · Safa → Marwah',
      arabic:
        'اللَّهُمَّ حَبِّبْ إِلَيَّ الْإِيمَانَ وَزَيِّنْهُ فِي قَلْبِي، وَكَرِّهْ إِلَيَّ الْكُفْرَ وَالْفُسُوقَ وَالْعِصْيَانَ، وَاجْعَلْنِي مِنَ الرَّاشِدِينَ',
      latin:
        'Allahumma habbib ilayyal iimaana wa zayyinhu fii qalbii, wa karrih ilayyal kufra wal fusuuqa wal ‘ishyaana, waj‘alnii minar raasyidiin.',
      translation:
        'Ya Allah, cintakanlah iman kepadaku dan hiasilah ia di dalam hatiku, bencikanlah kepadaku kekufuran, kefasikan, dan kemaksiatan, dan jadikanlah aku termasuk orang-orang yang mendapat petunjuk.',
      source: 'Dzikir sa’i leg 7 · Kemenag 2023',
    },
  ],
};

function getRouteDua(kind, completed = 0, done = false) {
  const list = ROUTE_DUAS[kind] || [];
  if (!list.length) return null;
  const index = done ? list.length - 1 : Math.min(list.length - 1, Math.max(0, completed));
  return { ...list[index], index };
}

function getPhaseRouteDua(state, phase) {
  if (!['umrah', 'haji10'].includes(phase.id)) return null;
  const rituals = RITUALS.filter(
    (ritual) => ritual.phase === phase.id && (ritual.kind === 'tawaf' || ritual.kind === 'sai'),
  );
  if (!rituals.length) return null;
  const ritual = rituals.find((item) => !isComplete(state, item.id)) || rituals[rituals.length - 1];
  const route = state.routes?.[ritual.id] || { completed: 0 };
  const dua = getRouteDua(ritual.kind, route.completed, isComplete(state, ritual.id));
  return dua ? { ritual, dua } : null;
}

const RESTRICTIONS = [
  {
    id: 'parfum',
    label: 'Memakai wangi-wangian',
    detail: 'Parfum, minyak wangi, atau pelembab beraroma.',
    appliesTo: 'all',
    Icon: Wind,
    citation: 'Kemenag 2023 · p.76',
  },
  {
    id: 'kuku',
    label: 'Memotong kuku atau rambut',
    detail: 'Termasuk mencukur, mencabut, atau memendekkan rambut.',
    appliesTo: 'all',
    Icon: Scissors,
    citation: 'Kemenag 2023 · p.76',
  },
  {
    id: 'jahit',
    label: 'Memakai pakaian berjahit',
    detail: 'Pakaian yang membentuk badan bagi laki-laki.',
    appliesTo: 'male',
    Icon: Shirt,
    citation: 'Kemenag 2023 · p.76',
  },
  {
    id: 'wajah',
    label: 'Menutup wajah',
    detail: 'Menutup wajah saat ihram bagi perempuan (RD-03).',
    appliesTo: 'female',
    Icon: EyeOff,
    citation: 'Kemenag 2023 · p.75 · RD-03',
  },
  {
    id: 'berburu',
    label: 'Berburu hewan darat',
    detail: 'Memburu atau melukai hewan darat yang halal dimakan.',
    appliesTo: 'all',
    Icon: Navigation,
    citation: 'Kemenag 2023 · p.76',
  },
];

const REMEDIES = [
  {
    id: 'dam',
    label: 'Dam',
    detail: 'Menyembelih seekor kambing',
    note: 'Pilihan pertama untuk pelanggaran ihram pada model ini.',
    Icon: Heart,
  },
  {
    id: 'puasa',
    label: 'Puasa',
    detail: 'Berpuasa tiga hari',
    note: 'Alternatif fidyah; dicatat sebagai satu pilihan, bukan mata uang.',
    Icon: MoonStar,
  },
  {
    id: 'sadaqah',
    label: 'Sadaqah',
    detail: 'Memberi makan enam orang miskin',
    note: 'Alternatif fidyah; dicatat sebagai satu pilihan, bukan mata uang.',
    Icon: HandHeart,
  },
];

const JAMARAT = {
  ula: { id: 'ula', label: 'Jumrah Ula', short: 'Ula', x: 262 },
  wusta: { id: 'wusta', label: 'Jumrah Wusta', short: 'Wusta', x: 320 },
  aqabah: { id: 'aqabah', label: 'Jumrah Aqabah', short: 'Aqabah', x: 378 },
};

const PHASE_MAP = Object.fromEntries(PHASES.map((p) => [p.id, p]));
const RITUAL_MAP = Object.fromEntries(RITUALS.map((r) => [r.id, r]));

const ICON_MAP = {
  Activity,
  AlertTriangle,
  ArrowLeftRight,
  ArrowRight,
  BadgeCheck,
  Ban,
  BookMarked,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDot,
  CircleHelp,
  CircleSlash2,
  Clock3,
  Compass,
  Download,
  Droplets,
  Eye,
  EyeOff,
  Flag,
  Footprints,
  GraduationCap,
  HandHeart,
  Heart,
  HeartHandshake,
  History,
  Info,
  Landmark,
  ListChecks,
  LockKeyhole,
  LogOut,
  MapPin,
  Menu,
  Milestone,
  MoonStar,
  Mountain,
  Navigation,
  PlaneLanding,
  RefreshCcw,
  RotateCcw,
  Route,
  Scale,
  Scissors,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  Shirt,
  Sparkles,
  Sunrise,
  Tent,
  Timer,
  Trash2,
  TriangleAlert,
  Trophy,
  User,
  UserRound,
  Volume2,
  Wind,
  X,
  XCircle,
};

const TONE = {
  emerald: {
    text: 'text-emerald-300',
    soft: 'text-emerald-200/80',
    bg: 'bg-emerald-500/10',
    bgStrong: 'bg-emerald-500/15',
    border: 'border-emerald-400/25',
    borderStrong: 'border-emerald-400/40',
    dot: 'bg-emerald-400',
    ring: 'ring-emerald-400/20',
    button: 'bg-emerald-500 text-emerald-950 hover:bg-emerald-400',
    gradient: 'from-emerald-400 via-teal-300 to-cyan-300',
    bar: 'bg-emerald-400',
  },
  amber: {
    text: 'text-amber-300',
    soft: 'text-amber-200/80',
    bg: 'bg-amber-500/10',
    bgStrong: 'bg-amber-500/15',
    border: 'border-amber-400/25',
    borderStrong: 'border-amber-400/40',
    dot: 'bg-amber-400',
    ring: 'ring-amber-400/20',
    button: 'bg-amber-400 text-amber-950 hover:bg-amber-300',
    gradient: 'from-amber-300 via-orange-300 to-yellow-200',
    bar: 'bg-amber-400',
  },
  rose: {
    text: 'text-rose-300',
    soft: 'text-rose-200/80',
    bg: 'bg-rose-500/10',
    bgStrong: 'bg-rose-500/15',
    border: 'border-rose-400/25',
    borderStrong: 'border-rose-400/40',
    dot: 'bg-rose-400',
    ring: 'ring-rose-400/20',
    button: 'bg-rose-500 text-rose-950 hover:bg-rose-400',
    gradient: 'from-rose-400 via-red-300 to-orange-300',
    bar: 'bg-rose-400',
  },
  sky: {
    text: 'text-sky-300',
    soft: 'text-sky-200/80',
    bg: 'bg-sky-500/10',
    bgStrong: 'bg-sky-500/15',
    border: 'border-sky-400/25',
    borderStrong: 'border-sky-400/40',
    dot: 'bg-sky-400',
    ring: 'ring-sky-400/20',
    button: 'bg-sky-500 text-sky-950 hover:bg-sky-400',
    gradient: 'from-sky-400 via-cyan-300 to-teal-200',
    bar: 'bg-sky-400',
  },
  violet: {
    text: 'text-violet-300',
    soft: 'text-violet-200/80',
    bg: 'bg-violet-500/10',
    bgStrong: 'bg-violet-500/15',
    border: 'border-violet-400/25',
    borderStrong: 'border-violet-400/40',
    dot: 'bg-violet-400',
    ring: 'ring-violet-400/20',
    button: 'bg-violet-500 text-violet-950 hover:bg-violet-400',
    gradient: 'from-violet-400 via-fuchsia-300 to-pink-300',
    bar: 'bg-violet-400',
  },
  slate: {
    text: 'text-slate-300',
    soft: 'text-slate-400',
    bg: 'bg-slate-500/10',
    bgStrong: 'bg-slate-500/15',
    border: 'border-slate-400/20',
    borderStrong: 'border-slate-400/30',
    dot: 'bg-slate-400',
    ring: 'ring-slate-400/15',
    button: 'bg-slate-200 text-slate-950 hover:bg-white',
    gradient: 'from-slate-300 via-slate-400 to-slate-500',
    bar: 'bg-slate-400',
  },
};

function tone(name) {
  return TONE[name] || TONE.slate;
}

/* ------------------------------------------------------------------ */
/*  HELPERS — deterministik, tanpa Math.random untuk state permainan    */
/* ------------------------------------------------------------------ */

const deepClone = (value) => JSON.parse(JSON.stringify(value));

function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

function isComplete(state, ritualId) {
  return state.rituals?.[ritualId]?.status === 'complete';
}

function ritualName(id) {
  return RITUAL_MAP[id]?.name || id;
}

function resolvePrompt(def, gender) {
  const variant = def?.variants?.[gender] || {};
  return {
    ...def,
    ...variant,
    options: variant.options || def?.options || [],
    correct: typeof variant.correct === 'number' ? variant.correct : def?.correct,
    question: variant.question || def?.question,
    explanation: variant.explanation || def?.explanation,
    hint: variant.hint || def?.hint,
    citation: variant.citation || def?.citation,
  };
}

function formatRatio(n, d) {
  return d > 0 ? `${n}/${d}` : 'tidak berlaku';
}

function remedyLabel(id) {
  return REMEDIES.find((remedy) => remedy.id === id)?.label || id;
}

function percent(n, d) {
  if (!d) return 0;
  return Math.round((n / d) * 100);
}

function getPhase(index) {
  return PHASES[Math.max(0, Math.min(PHASES.length - 1, index))];
}

function buildAudit(state, phaseIndex = state.phaseIndex) {
  const phase = getPhase(phaseIndex);
  const required = RITUALS.filter((r) => r.phase === phase.id);
  const missing = required.filter((r) => !isComplete(state, r.id));
  return { phase, required, missing };
}

function getRitualBlock(state, ritual) {
  if (!ritual) return { ok: false, reason: 'Ritual tidak dikenal.' };
  if (state.finished) return { ok: false, reason: 'Sesi sudah selesai. Lihat laporan.' };
  if (isComplete(state, ritual.id)) return { ok: false, reason: 'Sudah selesai.' };
  if (getPhase(state.phaseIndex).id !== ritual.phase) {
    return { ok: false, reason: `Tersedia pada fase ${PHASE_MAP[ritual.phase]?.short || ritual.phase}.` };
  }
  const missing = (ritual.prerequisites || []).filter((id) => !isComplete(state, id));
  if (missing.length) {
    return {
      ok: false,
      reason: `Prasyarat belum lengkap: ${missing.map((id) => ritualName(id)).join(', ')}.`,
    };
  }
  if (ritual.requiresIhram && state.ihram.active !== ritual.requiresIhram) {
    return { ok: false, reason: `Butuh ihram episode ${ritual.requiresIhram}.` };
  }
  if (ritual.requiresPurity && !state.purity.wudu) {
    return { ok: false, reason: 'Tawaf tanpa wudu tidak sah (RD-02). Ambil wudu dulu.' };
  }
  if (ritual.id === 'ihramHaji' && state.ihram.active !== null) {
    return { ok: false, reason: 'Tahallul umrah belum selesai; ihram episode 2 belum boleh dimulai.' };
  }
  if (ritual.id === 'tahallulHaji' && state.ihram.active !== 2) {
    return { ok: false, reason: 'Ihram haji belum aktif. Tahallul hanya setelah episode 2.' };
  }
  return { ok: true, reason: '' };
}

function computeOutcome(state) {
  if (state.endedEarly) return 'TIDAK_DISELESAIKAN';
  if (state.terminal) return 'HajjTidakSah';
  const missingRukn = RITUALS.filter((r) => r.classification === 'rukn' && !isComplete(state, r.id));
  if (missingRukn.length) return 'HajjTidakSah';
  const openDebts = state.debts.filter((d) => !d.resolved).length;
  const openViolations = state.ledger.filter((v) => !v.resolved).length;
  return openDebts + openViolations > 0 ? 'SelesaiDenganDam' : 'Selesai';
}

function outcomeMeta(outcome) {
  switch (outcome) {
    case 'Selesai':
      return {
        label: 'Selesai',
        tone: 'emerald',
        Icon: Trophy,
        blurb: 'Rangkaian selesai dan tidak ada kewajiban yang tertunda.',
        long: 'Semua fase tercatat, rukun terpenuhi, dan tidak ada dam atau kafarat terbuka pada model ini.',
      };
    case 'SelesaiDenganDam':
      return {
        label: 'Selesai dengan dam',
        tone: 'amber',
        Icon: Scale,
        blurb: 'Rangkaian selesai, tetapi masih ada kewajiban yang perlu ditunaikan.',
        long: 'Haji berlanjut sampai akhir, namun ada wajib atau kafarat yang belum diselesaikan. Laporan ini mencatatnya sebagai kewajiban, bukan sebagai kegagalan total.',
      };
    case 'HajjTidakSah':
      return {
        label: 'Hajj tidak sah',
        tone: 'rose',
        Icon: ShieldAlert,
        blurb: 'Ada rukun yang tertinggal. Konsekuensinya terminal pada model ini.',
        long: 'Rukun tidak dapat digantikan dengan dam. Model ini menghentikan sesi dan menampilkan penyebabnya. Ini bukan fatwa; ini konsekuensi dari satu tabel aturan.',
      };
    case 'TIDAK_DISELESAIKAN':
      return {
        label: 'Tidak diselesaikan',
        tone: 'slate',
        Icon: CircleSlash2,
        blurb: 'Sesi dihentikan sebelum rangkaian selesai.',
        long: 'Sesi ditandai tidak diselesaikan. Laporan tetap menampilkan apa yang sudah dicatat, tetapi status ini bukan salah satu dari tiga outcome final.',
      };
    default:
      return {
        label: 'Belum ada outcome',
        tone: 'slate',
        Icon: CircleHelp,
        blurb: 'Sesi belum mencapai titik akhir.',
        long: 'Selesaikan fase terakhir untuk mendapatkan outcome.',
      };
  }
}

function buildReport(state) {
  const completed = RITUALS.filter((r) => isComplete(state, r.id));
  const promptRows = PROMPTS.map((def) => {
    const ps = state.prompts?.[def.id];
    if (!ps) return null;
    const view = resolvePrompt(def, state.gender);
    const first = ps.attempts?.[0] || null;
    return {
      id: def.id,
      title: view.title,
      question: view.question,
      attempts: ps.attempts || [],
      attemptCount: ps.attempts?.length || 0,
      firstCorrect: ps.firstCorrect,
      resolved: ps.resolved,
      correctAnswer: view.options[view.correct],
      selectedAnswer: first ? view.options[first.option] : null,
      explanation: view.explanation,
      citation: view.citation,
    };
  }).filter(Boolean);

  const answered = promptRows.filter((p) => p.firstCorrect !== null);
  const firstCorrect = answered.filter((p) => p.firstCorrect).length;
  const routeRows = ['tawafUmrah', 'saiUmrah', 'tawafIfadah', 'tawafWada'].map((id) => {
    const route = state.routes?.[id];
    return {
      id,
      label: RITUAL_MAP[id].name.replace(/ — .*/, ''),
      numerator: route?.completed || 0,
      denominator: 7,
      started: Boolean(route),
    };
  });

  const debts = state.debts.map((d) => ({
    id: d.id,
    cause: d.cause,
    citation: d.citation,
    resolved: d.resolved,
  }));
  const violations = state.ledger.map((v) => ({
    id: v.id,
    label: v.label,
    episode: v.episode,
    citation: v.citation,
    remedy: v.remedy ? remedyLabel(v.remedy) : null,
    resolved: v.resolved,
    type: v.type,
  }));
  const openDebts = debts.filter((d) => !d.resolved).length;
  const openViolations = violations.filter((v) => !v.resolved).length;
  const outcome = state.endedEarly ? 'TIDAK_DISELESAIKAN' : state.outcome || computeOutcome(state);

  return {
    generatedAt: new Date().toISOString(),
    seed: state.seed,
    mode: state.mode,
    gender: state.gender,
    source: RULE_SOURCE,
    outcome,
    endedEarly: state.endedEarly,
    finished: state.finished,
    phase: getPhase(state.phaseIndex).label,
    turn: state.turn,
    rituals: {
      completed: completed.length,
      total: RITUALS.length,
      rows: RITUALS.map((r) => ({
        id: r.id,
        name: r.name,
        classification: r.classification,
        phase: PHASE_MAP[r.phase]?.short,
        completed: isComplete(state, r.id),
        citation: r.citation,
      })),
    },
    firstAttempt: {
      numerator: firstCorrect,
      denominator: answered.length,
    },
    promptSummary: {
      answered: answered.length,
      total: PROMPTS.length,
    },
    actions: {
      accepted: state.score.accepted,
      rejected: state.score.rejected,
      denominator: state.score.accepted + state.score.rejected,
    },
    routes: routeRows,
    violations,
    debts,
    openDebts,
    openViolations,
    prompts: promptRows,
    wuquf: state.wuquf,
    terminal: state.terminal,
    checkpointAvailable: state.mode === 'latihan' && Boolean(state.checkpoint),
    log: state.log,
  };
}

/* ------------------------------------------------------------------ */
/*  REDUCER — inti state engine                                        */
/* ------------------------------------------------------------------ */

function initialState() {
  return {
    version: SAVE_VERSION,
    started: false,
    seed: 'TMT-01',
    mode: 'latihan',
    gender: 'male',
    sourceId: RULE_SOURCE.id,
    phaseIndex: 0,
    turn: 0,
    purity: { wudu: false },
    ihram: { active: null, episodes: [] },
    pebbles: 0,
    rituals: {},
    routes: {},
    jamarat: {},
    prompts: {},
    ledger: [],
    debts: [],
    pendingViolationId: null,
    score: {
      firstCorrect: 0,
      firstTotal: 0,
      attempts: 0,
      correctAttempts: 0,
      accepted: 0,
      rejected: 0,
    },
    terminal: null,
    finished: false,
    endedEarly: false,
    outcome: null,
    wuquf: null,
    hady: false,
    log: [],
    history: [],
    checkpoint: null,
    phaseAudits: [],
    startedAt: null,
  };
}

function snapshotCore(state) {
  const { log, history, checkpoint, ...core } = state;
  return deepClone(core);
}

function makeLogEntry(turn, phase, toneName, icon, title, detail) {
  return {
    id: `L${turn}`,
    turn,
    phaseId: phase?.id || 'miqat',
    moment: phase?.momentLabel || '',
    tone: toneName,
    icon,
    title,
    detail,
  };
}

function commit(state, turn, label, toneName, icon, title, detail, atPhaseIndex = state.phaseIndex) {
  const phase = getPhase(atPhaseIndex);
  const entry = makeLogEntry(turn, phase, toneName, icon, title, detail);
  const logged = {
    ...state,
    turn,
    log: [entry, ...state.log].slice(0, 260),
  };
  const historyEntry = {
    id: `H${turn}`,
    turn,
    label,
    tone: toneName,
    at: phase.momentLabel,
    phaseId: phase.id,
    snapshot: snapshotCore(logged),
  };
  return {
    ...logged,
    history: [...logged.history, historyEntry].slice(-60),
  };
}

function setCheckpoint(state) {
  if (state.mode !== 'latihan') return { ...state, checkpoint: null };
  const phase = getPhase(state.phaseIndex);
  return {
    ...state,
    checkpoint: {
      phaseIndex: state.phaseIndex,
      turn: state.turn,
      label: phase.label,
      core: snapshotCore(state),
    },
  };
}

function initPhasePrompts(state, phaseIndex) {
  const phase = getPhase(phaseIndex);
  const defs = PROMPTS.filter((p) => p.phase === phase.id);
  if (!defs.length) return state;
  const prompts = { ...state.prompts };
  let changed = false;
  defs.forEach((def) => {
    if (!prompts[def.id]) {
      prompts[def.id] = {
        instanceId: `${def.id}@${state.turn}`,
        attempts: [],
        firstCorrect: null,
        resolved: false,
        resolvedTurn: null,
      };
      changed = true;
    }
  });
  return changed ? { ...state, prompts } : state;
}

function applyEffect(state, effect, turn) {
  switch (effect) {
    case 'ihram1':
      return {
        ...state,
        ihram: {
          active: 1,
          episodes: [
            ...state.ihram.episodes,
            { episode: 1, startedTurn: turn, endedTurn: null, phaseId: 'miqat' },
          ],
        },
      };
    case 'ihram2':
      return {
        ...state,
        ihram: {
          active: 2,
          episodes: [
            ...state.ihram.episodes,
            { episode: 2, startedTurn: turn, endedTurn: null, phaseId: 'haji8' },
          ],
        },
      };
    case 'tahallul1':
      return {
        ...state,
        ihram: {
          ...state.ihram,
          active: null,
          episodes: state.ihram.episodes.map((e) =>
            e.episode === 1 ? { ...e, endedTurn: turn } : e,
          ),
        },
      };
    case 'tahallul2':
      return {
        ...state,
        ihram: {
          ...state.ihram,
          active: null,
          episodes: state.ihram.episodes.map((e) =>
            e.episode === 2 ? { ...e, endedTurn: turn } : e,
          ),
        },
      };
    case 'pebbles49':
      return { ...state, pebbles: Math.min(70, state.pebbles + 49) };
    case 'wuquf':
      return {
        ...state,
        wuquf: {
          recordedTurn: turn,
          window: 'Zawal 9 Dzulhijjah → Fajar 10 Dzulhijjah',
          purityRequired: false,
        },
      };
    case 'hady':
      return { ...state, hady: true };
    default:
      return state;
  }
}

function markRitualComplete(state, ritual, turn) {
  let next = {
    ...state,
    rituals: {
      ...state.rituals,
      [ritual.id]: { status: 'complete', completedTurn: turn, phaseId: ritual.phase },
    },
    score: { ...state.score, accepted: state.score.accepted + 1 },
  };
  if (ritual.effect) next = applyEffect(next, ritual.effect, turn);
  return next;
}

function rejectAction(state, turn, title, detail, label = 'Aksi ditolak') {
  return commit(
    state,
    turn,
    label,
    'warn',
    'Ban',
    title,
    detail,
  );
}

function completeRitual(state, ritualId) {
  const turn = state.turn + 1;
  const ritual = RITUAL_MAP[ritualId];
  if (!ritual) return rejectAction(state, turn, 'Ritual tidak dikenal', ritualId);
  if (state.finished) return rejectAction(state, turn, 'Sesi sudah selesai', 'Lihat laporan.');
  const block = getRitualBlock(state, ritual);
  if (!block.ok) return rejectAction(state, turn, `${ritual.name} belum bisa dilakukan`, block.reason);
  if (ritual.kind === 'tawaf' || ritual.kind === 'sai') {
    return rejectAction(
      { ...state, score: { ...state.score, rejected: state.score.rejected + 1 } },
      turn,
      `${ritual.name} memakai simulator rute`,
      'Buka kartu ritual dan tekan tombol rute untuk menghitung putaran/leg.',
    );
  }
  if (ritual.kind === 'jamarat') {
    return rejectAction(
      { ...state, score: { ...state.score, rejected: state.score.rejected + 1 } },
      turn,
      `${ritual.name} memakai papan lontar`,
      'Buka papan lontar untuk menghitung kerikil per jumrah.',
    );
  }

  let next = markRitualComplete(state, ritual, turn);
  let extra = '';
  if (ritual.id === 'tahallulUmrah') extra = 'Ihram episode 1 ditutup.';
  if (ritual.id === 'tahallulHaji') extra = 'Ihram episode 2 ditutup.';
  if (ritual.id === 'ihramHaji') extra = 'Ihram episode 2 aktif.';
  if (ritual.id === 'ihramHaji') {
    // guard already handled by block; kept explicit for clarity
  }
  if (ritual.effect === 'pebbles49') extra = `Kerikil sekarang ${next.pebbles}.`;

  return commit(
    next,
    turn,
    ritual.name,
    'success',
    'CheckCircle2',
    `${ritual.name} selesai`,
    `${ritual.citation}${extra ? ` · ${extra}` : ''}`,
  );
}

function routeStep(state, ritualId, action) {
  const turn = state.turn + 1;
  const ritual = RITUAL_MAP[ritualId];
  if (!ritual) return rejectAction(state, turn, 'Rute tidak dikenal', ritualId);
  if (state.finished) return rejectAction(state, turn, 'Sesi sudah selesai', 'Lihat laporan.');
  if (!['tawaf', 'sai'].includes(ritual.kind)) {
    return rejectAction(state, turn, 'Bukan ritual rute', ritual.name);
  }
  const block = getRitualBlock(state, ritual);
  if (!block.ok) return rejectAction(state, turn, `${ritual.name} belum bisa dimulai`, block.reason);

  if (ritual.kind === 'tawaf') return tawafStep(state, ritual, action, turn);
  return saiStep(state, ritual, action, turn);
}

function tawafStep(state, ritual, action, turn) {
  const route = state.routes[ritual.id] || {
    completed: 0,
    t: 0,
    steps: 0,
    rejected: 0,
  };

  if (route.completed >= 7) {
    return rejectAction(state, turn, 'Tujuh putaran sudah selesai', 'Putaran ke-8 tidak ada.');
  }

  if (action === 'reverse') {
    const next = {
      ...state,
      score: { ...state.score, rejected: state.score.rejected + 1 },
      routes: {
        ...state.routes,
        [ritual.id]: { ...route, t: 0, rejected: route.rejected + 1 },
      },
    };
    return commit(
      next,
      turn,
      'Arah tawaf ditolak',
      'warn',
      'RotateCcw',
      'Arah berlawanan tidak dihitung',
      'Ka’bah harus berada di sisi kiri. Putaran yang berjalan mundur tidak menambah hitungan; mulai lagi searah.',
    );
  }

  if (action === 'shortcut') {
    const next = {
      ...state,
      score: { ...state.score, rejected: state.score.rejected + 1 },
      routes: {
        ...state.routes,
        [ritual.id]: { ...route, t: 0, rejected: route.rejected + 1 },
      },
    };
    return commit(
      next,
      turn,
      'Potong Mataf ditolak',
      'danger',
      'Ban',
      'Memotong lewat tengah membatalkan putaran',
      'Traversal harus tetap di lintasan Mataf. Progres putaran dikosongkan; hitungan sebelumnya tetap sah.',
    );
  }

  if (action !== 'forward') {
    return rejectAction(state, turn, 'Aksi rute tidak dikenal', action);
  }

  let t = route.t + 0.34;
  let completed = route.completed;
  let committed = false;
  if (t >= 0.99) {
    completed += 1;
    t = Math.max(0, t - 1);
    committed = true;
  }

  let next = {
    ...state,
    routes: {
      ...state.routes,
      [ritual.id]: {
        ...route,
        t,
        completed,
        steps: route.steps + 1,
      },
    },
  };

  if (completed >= 7) {
    next = markRitualComplete(next, ritual, turn);
    return commit(
      next,
      turn,
      `${ritual.name} selesai`,
      'success',
      'Compass',
      'Tawaf selesai — 7 putaran',
      `${ritual.citation} · Ambang commit terlewati pada setiap putaran. Putaran ke-8 tidak mungkin.`,
    );
  }

  return commit(
    next,
    turn,
    committed ? `Putaran ${completed}/7` : 'Langkah tawaf',
    committed ? 'success' : 'info',
    'Compass',
    committed ? `Putaran ${completed} tercatat` : `Progres putaran ${Math.round(t * 100)}%`,
    committed
      ? 'Arah valid dan progres melewati ambang commit. Lanjutkan searah.'
      : 'Ka’bah di sisi kiri. Lanjutkan searah; putaran dihitung setelah melewati ambang commit.',
  );
}

function saiStep(state, ritual, action, turn) {
  const route = state.routes[ritual.id] || {
    completed: 0,
    position: 0,
    started: false,
    rejected: 0,
    lastTerminal: 'safa',
  };

  if (route.completed >= 7) {
    return rejectAction(state, turn, 'Tujuh leg sudah selesai', 'Sa’i berakhir di Marwah.');
  }

  if (action === 'startSafa') {
    if (route.started) {
      return rejectAction(state, turn, 'Sa’i sudah dimulai', 'Leg dihitung saat tiba di terminal seberang.');
    }
    const next = {
      ...state,
      routes: {
        ...state.routes,
        [ritual.id]: { ...route, started: true, position: 0, lastTerminal: 'safa' },
      },
    };
    return commit(
      next,
      turn,
      'Sa’i dimulai dari Safa',
      'info',
      'Footprints',
      'Posisi awal: Safa',
      'Leg pertama harus Safa → Marwah. Tekan “Berjalan” untuk menghitung leg.',
    );
  }

  if (action === 'startMarwah') {
    const next = {
      ...state,
      score: { ...state.score, rejected: state.score.rejected + 1 },
      routes: {
        ...state.routes,
        [ritual.id]: { ...route, rejected: route.rejected + 1 },
      },
    };
    return commit(
      next,
      turn,
      'Start dari Marwah ditolak',
      'warn',
      'RotateCcw',
      'Sa’i harus dimulai dari Safa',
      'Reaching Marwah first does not count as leg 1. Pindah ke Safa, lalu mulai lagi. Tidak ada leg yang dicatat.',
    );
  }

  if (action !== 'walk') {
    return rejectAction(state, turn, 'Aksi Sa’i tidak dikenal', action);
  }

  if (!route.started) {
    return rejectAction(
      state,
      turn,
      'Belum ada posisi awal',
      'Mulai Sa’i dari Safa terlebih dahulu. Leg tidak dihitung dari Marwah.',
    );
  }

  const completed = route.completed + 1;
  const position = route.position === 0 ? 1 : 0;
  const lastTerminal = position === 0 ? 'safa' : 'marwah';
  let next = {
    ...state,
    routes: {
      ...state.routes,
      [ritual.id]: {
        ...route,
        completed,
        position,
        lastTerminal,
      },
    },
  };

  if (completed >= 7) {
    next = markRitualComplete(next, ritual, turn);
    return commit(
      next,
      turn,
      `${ritual.name} selesai`,
      'success',
      'Footprints',
      'Sa’i selesai — 7 leg, berakhir di Marwah',
      `${ritual.citation} · Arah bergantian dan leg ke-7 berakhir di Marwah.`,
    );
  }

  return commit(
    next,
    turn,
    `Leg ${completed}/7`,
    'success',
    'Footprints',
    `Leg ${completed} tercatat — tiba di ${lastTerminal === 'safa' ? 'Safa' : 'Marwah'}`,
    `Arah berikutnya: ${position === 0 ? 'Safa → Marwah' : 'Marwah → Safa'}.`,
  );
}

function stoneJamarat(state, ritualId, pillarId) {
  const turn = state.turn + 1;
  const ritual = RITUAL_MAP[ritualId];
  if (!ritual || ritual.kind !== 'jamarat') {
    return rejectAction(state, turn, 'Papan lontar tidak dikenal', ritualId);
  }
  if (state.finished) return rejectAction(state, turn, 'Sesi sudah selesai', 'Lihat laporan.');
  const block = getRitualBlock(state, ritual);
  if (!block.ok) return rejectAction(state, turn, `${ritual.name} belum bisa dilakukan`, block.reason);

  const required = ritual.pillars || ['aqabah'];
  if (!required.includes(pillarId)) {
    return rejectAction(state, turn, 'Jumrah tidak dijadwalkan hari ini', JAMARAT[pillarId]?.label || pillarId);
  }
  const current = state.jamarat[ritual.id] || { counts: {} };
  const count = current.counts[pillarId] || 0;
  if (count >= 7) {
    return rejectAction(state, turn, 'Jumrah ini sudah selesai', 'Tujuh kerikil sudah dilontarkan.');
  }
  if (state.pebbles < 1) {
    return rejectAction(
      state,
      turn,
      'Kerikil habis',
      'Ambil kerikil terlebih dahulu. Total kebutuhan nafar awal: 49 butir.',
    );
  }

  const counts = { ...current.counts, [pillarId]: count + 1 };
  let next = {
    ...state,
    pebbles: state.pebbles - 1,
    jamarat: { ...state.jamarat, [ritual.id]: { counts } },
  };
  const doneAll = required.every((p) => (counts[p] || 0) >= 7);
  if (doneAll) next = markRitualComplete(next, ritual, turn);

  const label = JAMARAT[pillarId]?.label || pillarId;
  return commit(
    next,
    turn,
    doneAll ? `${ritual.name} selesai` : `Lontar ${label}`,
    doneAll ? 'success' : 'info',
    'Milestone',
    doneAll ? `${ritual.name} selesai` : `${counts[pillarId]}/7 kerikil ke ${label}`,
    doneAll
      ? 'Semua jumrah yang dijadwalkan selesai. Kerikil tersisa: ' + next.pebbles + '.'
      : `Sisa kerikil: ${next.pebbles}.` + (counts[pillarId] === 7 ? ` ${label} selesai.` : ''),
  );
}

function applyAudit(state, audit, turn) {
  let debts = [...state.debts];
  let ledger = [...state.ledger];
  const terminalCauses = [];
  const newDebtNotes = [];

  audit.missing.forEach((ritual) => {
    if (ritual.classification === 'rukn') terminalCauses.push(ritual);
    if (ritual.classification === 'wajib') {
      const exists = debts.some((d) => d.ritualId === ritual.id && !d.resolved);
      if (!exists) {
        debts.push({
          id: `D${turn}-${ritual.id}`,
          cause: `Meninggalkan ${ritual.name} pada ${audit.phase.label}`,
          ritualId: ritual.id,
          phaseId: audit.phase.id,
          classification: 'wajib',
          remedy: 'dam',
          citation: ritual.citation,
          resolved: false,
          createdTurn: turn,
        });
        newDebtNotes.push(ritual.name);
      }
    }
  });

  if (audit.phase.id === 'miqat' && !isComplete(state, 'niatUmrah')) {
    const exists = ledger.some((v) => v.type === 'crossing');
    if (!exists) {
      ledger.push({
        id: `V${turn}-crossing`,
        type: 'crossing',
        restrictionId: 'miqat-crossing',
        label: 'Melewati miqat tanpa ihram',
        episode: null,
        phaseId: 'miqat',
        turn,
        citation: 'Kemenag 2023 · p.75 · INV-10',
        remedy: null,
        resolved: false,
        expiation: { options: ['dam', 'puasa', 'sadaqah'], chosen: null },
      });
    }
  }

  return { debts, ledger, terminalCauses, newDebtNotes };
}

function advancePhase(state) {
  const turn = state.turn + 1;
  const phase = getPhase(state.phaseIndex);
  if (state.finished) return rejectAction(state, turn, 'Sesi sudah selesai', 'Lihat laporan.');
  if (state.phaseIndex >= PHASES.length - 1) {
    return rejectAction(
      state,
      turn,
      'Ini fase terakhir',
      'Gunakan tombol “Selesaikan sesi” untuk menjalankan audit akhir dan membuka laporan.',
    );
  }

  const audit = buildAudit(state);
  const { debts, ledger, terminalCauses, newDebtNotes } = applyAudit(state, audit, turn);
  const nextIndex = Math.min(state.phaseIndex + 1, PHASES.length - 1);
  const auditRecord = {
    id: `A${turn}`,
    phaseId: phase.id,
    turn,
    missing: audit.missing.map((r) => ({
      id: r.id,
      name: r.name,
      classification: r.classification,
    })),
  };

  let next = {
    ...state,
    debts,
    ledger,
    phaseAudits: [...state.phaseAudits, auditRecord],
  };

  if (terminalCauses.length) {
    next = {
      ...next,
      phaseIndex: nextIndex,
      terminal: {
        kind: 'rukn',
        ritualId: terminalCauses[0].id,
        title: 'Rukun tidak dikerjakan',
        detail: terminalCauses.map((r) => r.name).join(', '),
      },
      finished: true,
      outcome: 'HajjTidakSah',
      pendingViolationId: null,
    };
    const names = terminalCauses.map((r) => `${r.name} (${r.citation})`).join('; ');
    return commit(
      next,
      turn,
      'Audit fase: rukun hilang',
      'danger',
      'ShieldAlert',
      'Hajj tidak sah — rukun tertinggal',
      `${names}. Rukun tidak dapat diganti dengan dam; fase dicatat dan sesi berakhir.`,
      state.phaseIndex,
    );
  }

  next = { ...next, phaseIndex: nextIndex };
  next = initPhasePrompts(next, nextIndex);

  const missingCount = audit.missing.length;
  const detailBits = [];
  if (missingCount) {
    detailBits.push(
      `Belum selesai: ${audit.missing
        .map((r) => `${r.name} (${CLASSIFICATIONS[r.classification].label})`)
        .join(', ')}.`,
    );
  }
  if (newDebtNotes.length) {
    detailBits.push(`Dam tertunda baru: ${newDebtNotes.join(', ')}.`);
  }
  if (!missingCount) detailBits.push('Semua tindakan wajib fase ini selesai.');

  next = commit(
    next,
    turn,
    `Fase ${phase.label} selesai`,
    missingCount ? 'warn' : 'success',
    'ChevronRight',
    missingCount ? 'Fase dilanjutkan dengan catatan audit' : 'Fase selesai bersih',
    detailBits.join(' '),
    state.phaseIndex,
  );

  return setCheckpoint(next);
}

function finishSession(state) {
  const turn = state.turn + 1;
  if (state.finished) return state;
  if (state.phaseIndex !== PHASES.length - 1) {
    return rejectAction(
      state,
      turn,
      'Belum di fase terakhir',
      'Selesaikan fase Tawaf Wada terlebih dahulu, atau akhiri sesi lebih awal dari menu.',
    );
  }

  const audit = buildAudit(state);
  const { debts, ledger } = applyAudit(state, audit, turn);
  const auditRecord = {
    id: `A${turn}`,
    phaseId: audit.phase.id,
    turn,
    missing: audit.missing.map((r) => ({
      id: r.id,
      name: r.name,
      classification: r.classification,
    })),
  };
  const missingRukn = RITUALS.filter(
    (r) => r.classification === 'rukn' && !isComplete(state, r.id),
  );
  let next = {
    ...state,
    debts,
    ledger,
    phaseAudits: [...state.phaseAudits, auditRecord],
    finished: true,
  };

  if (missingRukn.length) {
    next = {
      ...next,
      outcome: 'HajjTidakSah',
      terminal: {
        kind: 'rukn',
        ritualId: missingRukn[0].id,
        title: 'Rukun tidak dikerjakan',
        detail: missingRukn.map((r) => r.name).join(', '),
      },
    };
    return commit(
      next,
      turn,
      'Sesi selesai',
      'danger',
      'ShieldAlert',
      'Hajj tidak sah',
      `Rukun belum selesai: ${missingRukn.map((r) => r.name).join(', ')}. Laporan menampilkan penyebab, bukan klaim keabsahan.`,
    );
  }

  const openDebts = debts.filter((d) => !d.resolved).length;
  const openViolations = ledger.filter((v) => !v.resolved).length;
  const outcome = openDebts + openViolations > 0 ? 'SelesaiDenganDam' : 'Selesai';
  next = { ...next, outcome };
  return commit(
    next,
    turn,
    'Sesi selesai',
    outcome === 'Selesai' ? 'success' : 'warn',
    outcome === 'Selesai' ? 'Trophy' : 'Scale',
    outcome === 'Selesai' ? 'Selesai tanpa kewajiban terbuka' : 'Selesai dengan dam',
    `Outcome: ${outcome}. ${openDebts} dam tertunda, ${openViolations} kafarat belum dipilih. Laporan disusun dari catatan sesi.`,
  );
}

function answerPrompt(state, promptId, optionIndex) {
  const turn = state.turn + 1;
  const def = PROMPTS.find((p) => p.id === promptId);
  if (!def) return rejectAction(state, turn, 'Kuis tidak dikenal', promptId);
  if (state.finished) return rejectAction(state, turn, 'Sesi sudah selesai', 'Lihat laporan.');
  const view = resolvePrompt(def, state.gender);
  const ps = state.prompts[promptId];
  if (!ps) return rejectAction(state, turn, 'Kuis belum tersedia', 'Kuis dibuat saat fase dimasuki.');
  if (ps.resolved) {
    return rejectAction(
      state,
      turn,
      'Jawaban sudah dikunci',
      'Prompt yang sudah selesai tidak memberi skor lagi. Pengiriman ulang diabaikan.',
    );
  }
  if (typeof optionIndex !== 'number' || optionIndex < 0 || optionIndex >= view.options.length) {
    return rejectAction(state, turn, 'Pilihan tidak valid', 'Pilih salah satu opsi yang tersedia.');
  }

  const correct = optionIndex === view.correct;
  const first = ps.attempts.length === 0;
  const attempts = [
    ...ps.attempts,
    { option: optionIndex, correct, turn, attempt: ps.attempts.length + 1 },
  ];
  const firstCorrect = first ? correct : ps.firstCorrect;
  const resolved = correct || state.mode === 'simulasi';
  const score = {
    ...state.score,
    attempts: state.score.attempts + 1,
    correctAttempts: state.score.correctAttempts + (correct ? 1 : 0),
  };
  if (first) {
    score.firstTotal += 1;
    if (correct) score.firstCorrect += 1;
  }
  const prompts = {
    ...state.prompts,
    [promptId]: {
      ...ps,
      attempts,
      firstCorrect,
      resolved,
      resolvedTurn: resolved ? turn : null,
    },
  };
  const next = { ...state, prompts, score };

  if (correct) {
    return commit(
      next,
      turn,
      `Kuis ${view.title}`,
      'success',
      'CheckCircle2',
      `${view.title}: tepat`,
      `${view.explanation} ${view.citation}`,
    );
  }

  if (state.mode === 'simulasi') {
    return commit(
      next,
      turn,
      `Kuis ${view.title}`,
      'danger',
      'XCircle',
      `${view.title}: belum tepat — jawaban dikunci`,
      `Jawaban benar: ${view.options[view.correct]}. ${view.explanation} ${view.citation}`,
    );
  }

  return commit(
    next,
    turn,
    `Kuis ${view.title}`,
    'warn',
    'RotateCcw',
    `${view.title}: coba lagi`,
    `Hint: ${view.hint}`,
  );
}

function triggerViolation(state, restrictionId) {
  const turn = state.turn + 1;
  const restriction = RESTRICTIONS.find((r) => r.id === restrictionId);
  if (!restriction) return rejectAction(state, turn, 'Larangan tidak dikenal', restrictionId);
  if (state.finished) return rejectAction(state, turn, 'Sesi sudah selesai', 'Lihat laporan.');
  if (!state.ihram.active) {
    return rejectAction(state, turn, 'Tidak sedang ihram', 'Larangan ihram hanya berlaku saat episode aktif.');
  }
  if (restriction.appliesTo !== 'all' && restriction.appliesTo !== state.gender) {
    return rejectAction(
      state,
      turn,
      'Larangan tidak berlaku untuk sesi ini',
      `Aturan ini berlaku untuk ${GENDERS[restriction.appliesTo]?.label || restriction.appliesTo}. INV-12: larangan yang tidak berlaku tidak menghasilkan pelanggaran.`,
    );
  }

  const entry = {
    id: `V${turn}`,
    type: 'restriction',
    restrictionId: restriction.id,
    label: restriction.label,
    episode: state.ihram.active,
    phaseId: getPhase(state.phaseIndex).id,
    turn,
    citation: restriction.citation,
    remedy: null,
    resolved: false,
    expiation: {
      options: ['dam', 'puasa', 'sadaqah'],
      chosen: null,
    },
  };
  const next = {
    ...state,
    ledger: [...state.ledger, entry],
    pendingViolationId: entry.id,
  };
  return commit(
    next,
    turn,
    'Pelanggaran ihram dicatat',
    'danger',
    'ShieldAlert',
    `Pelanggaran: ${restriction.label}`,
    `Ihram episode ${state.ihram.active} · ${restriction.citation}. Satu pelanggaran = satu catatan kafarat; pilih satu opsi.`,
  );
}

function chooseRemedy(state, violationId, remedyId) {
  const turn = state.turn + 1;
  if (state.finished) return rejectAction(state, turn, 'Sesi sudah selesai', 'Lihat laporan.');
  const violation = state.ledger.find((v) => v.id === violationId);
  const remedy = REMEDIES.find((r) => r.id === remedyId);
  if (!violation) return rejectAction(state, turn, 'Catatan pelanggaran tidak ditemukan', violationId);
  if (violation.resolved) {
    return rejectAction(
      state,
      turn,
      'Kafarat sudah dipilih',
      'Setiap pelanggaran hanya memiliki satu catatan kafarat. Pilihan tidak dapat ditumpuk.',
    );
  }
  if (!remedy) return rejectAction(state, turn, 'Kafarat tidak dikenal', remedyId);

  const ledger = state.ledger.map((v) =>
    v.id === violationId
      ? {
          ...v,
          remedy: remedy.id,
          resolved: true,
          resolvedTurn: turn,
          expiation: { ...(v.expiation || {}), chosen: remedy.id, resolvedTurn: turn },
        }
      : v,
  );
  return commit(
    { ...state, ledger, pendingViolationId: null },
    turn,
    'Kafarat dicatat',
    'success',
    'BadgeCheck',
    `Kafarat: ${remedy.label}`,
    `${remedy.detail} · ${violation.label}. Tidak ada mata uang, token, atau sumber daya generik yang dipakai.`,
  );
}

function deferRemedy(state) {
  const turn = state.turn + 1;
  const violation = state.ledger.find((v) => v.id === state.pendingViolationId);
  if (!violation) return { ...state, pendingViolationId: null };
  return commit(
    { ...state, pendingViolationId: null },
    turn,
    'Kafarat ditunda',
    'warn',
    'Clock3',
    'Kafarat ditunda — tercatat sebagai kewajiban',
    `${violation.label} tetap terbuka. Outcome akhir akan menjadi SelesaiDenganDam jika belum diselesaikan.`,
  );
}

function resolveDebt(state, debtId) {
  const turn = state.turn + 1;
  if (state.finished) return rejectAction(state, turn, 'Sesi sudah selesai', 'Lihat laporan.');
  const debt = state.debts.find((d) => d.id === debtId);
  if (!debt) return rejectAction(state, turn, 'Kewajiban tidak ditemukan', debtId);
  if (debt.resolved) return rejectAction(state, turn, 'Kewajiban sudah ditunaikan', debt.cause);
  const debts = state.debts.map((d) =>
    d.id === debtId ? { ...d, resolved: true, resolvedTurn: turn } : d,
  );
  return commit(
    { ...state, debts },
    turn,
    'Dam ditunaikan',
    'success',
    'BadgeCheck',
    'Kewajiban dam ditunaikan',
    `${debt.cause}. Tercatat dengan referensi ${debt.citation}.`,
  );
}

function takeWudu(state) {
  const turn = state.turn + 1;
  if (state.finished) return rejectAction(state, turn, 'Sesi sudah selesai', 'Lihat laporan.');
  if (state.purity.wudu) {
    return commit(state, turn, 'Wudu', 'info', 'Droplets', 'Sudah dalam keadaan berwudu', 'Status purity tetap suci.');
  }
  return commit(
    { ...state, purity: { ...state.purity, wudu: true } },
    turn,
    'Mengambil wudu',
    'success',
    'Droplets',
    'Wudu selesai',
    'Tawaf membutuhkan purity sebagai syarat sah pada sumber ini (RD-02).',
  );
}

function breakWudu(state) {
  const turn = state.turn + 1;
  if (state.finished) return rejectAction(state, turn, 'Sesi sudah selesai', 'Lihat laporan.');
  if (state.mode !== 'latihan') {
    return rejectAction(state, turn, 'Uji purity hanya di Latihan', 'Di Simulasi, nullifier tetap dicatat sebagai keadaan nyata.');
  }
  if (!state.purity.wudu) {
    return rejectAction(state, turn, 'Wudu sudah batal', 'Status purity saat ini belum suci.');
  }
  return commit(
    { ...state, purity: { ...state.purity, wudu: false } },
    turn,
    'Wudu dibatalkan',
    'warn',
    'Droplets',
    'Wudu batal — tawaf berikutnya tertahan',
    'Ini simulasi pembelajaran. Tawaf tanpa wudu tidak dihitung pada model ini (RD-02).',
  );
}

function collectPebbles(state) {
  const turn = state.turn + 1;
  if (state.finished) return rejectAction(state, turn, 'Sesi sudah selesai', 'Lihat laporan.');
  const phase = getPhase(state.phaseIndex);
  if (!['muzdalifah', 'haji10', 'mina11', 'mina12'].includes(phase.id)) {
    return rejectAction(state, turn, 'Belum waktunya mengambil kerikil', 'Kerikil diambil di Muzdalifah atau Mina.');
  }
  if (state.pebbles >= 70) {
    return rejectAction(state, turn, 'Kerikil sudah cukup', 'Batas model 70 butir.');
  }
  const nextPebbles = Math.min(70, state.pebbles + 7);
  return commit(
    { ...state, pebbles: nextPebbles },
    turn,
    'Ambil kerikil',
    'info',
    'CircleDot',
    `Mengambil 7 kerikil (${nextPebbles}/70)`,
    'Kebutuhan nafar awal: 49 butir. Setiap jumrah memerlukan 7 kerikil.',
  );
}

function restoreCheckpoint(state) {
  const turn = state.turn + 1;
  if (state.mode !== 'latihan') {
    return rejectAction(state, turn, 'Checkpoint tidak tersedia', 'Simulasi tidak memiliki rollback (INV-23).');
  }
  if (!state.checkpoint) {
    return rejectAction(state, turn, 'Belum ada checkpoint', 'Checkpoint dibuat di awal setiap fase pada mode Latihan.');
  }
  const core = deepClone(state.checkpoint.core);
  const restored = {
    ...state,
    ...core,
    log: state.log,
    history: state.history,
    checkpoint: state.checkpoint,
    pendingViolationId: null,
  };
  return commit(
    restored,
    turn,
    'Checkpoint dipulihkan',
    'info',
    'RotateCcw',
    'Kembali ke awal fase',
    `State dipulihkan ke checkpoint “${state.checkpoint.label}”. Log dan riwayat tetap dipertahankan; ini bukan undo bebas.`,
  );
}

function startSession(mode, gender) {
  let next = {
    ...initialState(),
    started: true,
    mode: MODES[mode] ? mode : 'latihan',
    gender: GENDERS[gender] ? gender : 'male',
    startedAt: new Date().toISOString(),
  };
  next = initPhasePrompts(next, 0);
  next = commit(
    next,
    next.turn + 1,
    'Sesi dimulai',
    'info',
    'Flag',
    `Sesi ${MODES[next.mode].label} dimulai`,
    `Sumber: ${RULE_SOURCE.short} (${RULE_SOURCE.edition}) · ${GENDERS[next.gender].label}. ${MODES[next.mode].hint}`,
  );
  return setCheckpoint(next);
}

function reducer(state, action) {
  switch (action.type) {
    case 'START_SESSION':
      return startSession(action.mode, action.gender);
    case 'LOAD_SAVE': {
      if (!action.save || action.save.version !== SAVE_VERSION || !action.save.started) {
        return state;
      }
      const base = initialState();
      const loaded = deepClone(action.save);
      const merged = {
        ...base,
        ...loaded,
        mode: MODES[loaded.mode] ? loaded.mode : 'latihan',
        gender: GENDERS[loaded.gender] ? loaded.gender : 'male',
        phaseIndex: Math.max(0, Math.min(PHASES.length - 1, Number(loaded.phaseIndex) || 0)),
        purity: { ...base.purity, ...(loaded.purity || {}) },
        ihram: { ...base.ihram, ...(loaded.ihram || {}) },
        score: { ...base.score, ...(loaded.score || {}) },
        prompts: { ...(loaded.prompts || {}) },
        rituals: { ...(loaded.rituals || {}) },
        routes: { ...(loaded.routes || {}) },
        jamarat: { ...(loaded.jamarat || {}) },
        ledger: Array.isArray(loaded.ledger) ? loaded.ledger : [],
        debts: Array.isArray(loaded.debts) ? loaded.debts : [],
        log: Array.isArray(loaded.log) ? loaded.log : [],
        history: Array.isArray(loaded.history) ? loaded.history : [],
        phaseAudits: Array.isArray(loaded.phaseAudits) ? loaded.phaseAudits : [],
      };
      return initPhasePrompts(merged, merged.phaseIndex);
    }
    case 'EXIT_TO_MENU':
      return initialState();
    case 'COMPLETE_RITUAL':
      return completeRitual(state, action.ritualId);
    case 'ROUTE_STEP':
      return routeStep(state, action.ritualId, action.action);
    case 'STONE_JAMARAT':
      return stoneJamarat(state, action.ritualId, action.pillarId);
    case 'ANSWER_PROMPT':
      return answerPrompt(state, action.promptId, action.optionIndex);
    case 'TRIGGER_VIOLATION':
      return triggerViolation(state, action.restrictionId);
    case 'OPEN_REMEDY': {
      const violation = state.ledger.find((entry) => entry.id === action.violationId);
      if (!violation || violation.resolved || state.finished) return state;
      return { ...state, pendingViolationId: violation.id };
    }
    case 'CHOOSE_REMEDY':
      return chooseRemedy(state, action.violationId, action.remedyId);
    case 'DEFER_REMEDY':
      return deferRemedy(state);
    case 'RESOLVE_DEBT':
      return resolveDebt(state, action.debtId);
    case 'TAKE_WUDU':
      return takeWudu(state);
    case 'BREAK_WUDU':
      return breakWudu(state);
    case 'COLLECT_PEBBLES':
      return collectPebbles(state);
    case 'ADVANCE_PHASE':
      return advancePhase(state);
    case 'FINISH_SESSION':
      return finishSession(state);
    case 'END_EARLY': {
      const turn = state.turn + 1;
      return commit(
        {
          ...state,
          finished: true,
          endedEarly: true,
          outcome: null,
          terminal: null,
          pendingViolationId: null,
        },
        turn,
        'Sesi dihentikan',
        'warn',
        'LogOut',
        'Sesi diakhiri lebih awal',
        'Laporan ditandai “tidak diselesaikan”. Status ini bukan salah satu dari tiga outcome final dan tidak dihitung sebagai Selesai.',
      );
    }
    case 'RESTORE_CHECKPOINT':
      return restoreCheckpoint(state);
    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */
/*  APP                                                                */
/* ------------------------------------------------------------------ */

function readSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== SAVE_VERSION || !parsed.started) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeSave(state) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // Penyimpanan penuh atau diblokir: sesi tetap berjalan di memori.
  }
}

/* ------------------------------------------------------------------ */
/*  SHARED UI                                                          */
/* ------------------------------------------------------------------ */

function KaabaMark({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4.3 8.2 12 3.8l7.7 4.4v7.6L12 20.2l-7.7-4.4V8.2Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path d="M4.3 8.2 12 12.7l7.7-4.5M12 12.7v7.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.9 12.2 12 16.4l7.1-4.2" stroke="#fbbf24" strokeWidth="1.35" />
      <path d="M12 16.4v3.7" stroke="#fbbf24" strokeWidth="1.1" />
    </svg>
  );
}

function Modal({ open, onClose, children, wide = false, dismissible = true, label = 'Dialog' }) {
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && dismissible) onClose?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, dismissible, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center p-2 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={dismissible ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        className={cx(
          'relative max-h-[92vh] w-full overflow-y-auto rounded-3xl border border-white/10 bg-[#0a1410] shadow-2xl shadow-black/60',
          wide ? 'max-w-2xl' : 'max-w-lg',
        )}
      >
        {children}
      </div>
    </div>
  );
}

function ClassBadge({ classification, small = false }) {
  const data = CLASSIFICATIONS[classification] || CLASSIFICATIONS.sunnah;
  const t = tone(data.tone);
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center gap-1 rounded-full border font-semibold uppercase tracking-wider',
        t.bg,
        t.border,
        t.text,
        small ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]',
      )}
      title={data.description}
    >
      {data.label}
    </span>
  );
}

function ToneBadge({ children, tone: toneName = 'slate', className = '' }) {
  const t = tone(toneName);
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium',
        t.bg,
        t.border,
        t.text,
        className,
      )}
    >
      {children}
    </span>
  );
}

function ProgressBar({ value, max, tone: toneName = 'emerald', className = '', slim = false }) {
  const pct = percent(value, max);
  const t = tone(toneName);
  return (
    <div
      className={cx('overflow-hidden rounded-full bg-white/[.06]', slim ? 'h-1' : 'h-1.5', className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={cx('h-full rounded-full transition-all duration-500', t.bar)}
        style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
      />
    </div>
  );
}

function CircleProgress({ value, max, tone: toneName = 'emerald', size = 88, stroke = 7, children }) {
  const pct = percent(value, max);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const t = tone(toneName);
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,.07)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className={t.text}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (pct / 100) * circumference}
          style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.2,.8,.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}

function IconBubble({ Icon, tone: toneName = 'slate', size = 'md', className = '' }) {
  const t = tone(toneName);
  const sizes = {
    sm: 'h-7 w-7 rounded-lg',
    md: 'h-9 w-9 rounded-xl',
    lg: 'h-11 w-11 rounded-2xl',
  };
  const icons = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-5 w-5' };
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center justify-center border',
        sizes[size],
        t.bg,
        t.border,
        t.text,
        className,
      )}
    >
      <Icon className={icons[size]} strokeWidth={1.9} />
    </span>
  );
}

function StatChip({ Icon, label, value, tone: toneName = 'slate', onClick, title, active = false }) {
  const t = tone(toneName);
  const Comp = Icon || CircleDot;
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={!onClick}
      className={cx(
        'group inline-flex shrink-0 items-center gap-2 rounded-xl border px-2.5 py-1.5 text-left transition',
        active ? cx(t.bg, t.borderStrong) : 'border-white/[.07] bg-white/[.025]',
        onClick ? 'hover:border-white/20 hover:bg-white/[.05]' : 'cursor-default',
      )}
    >
      <Comp className={cx('h-3.5 w-3.5', t.text)} strokeWidth={2} />
      <span className="min-w-0">
        <span className="block text-[9px] uppercase tracking-[.14em] text-slate-500">{label}</span>
        <span className="block whitespace-nowrap text-[11px] font-semibold text-slate-200">{value}</span>
      </span>
    </button>
  );
}

function MiniDots({ total, filled, tone: toneName = 'emerald', size = 'h-2 w-2' }) {
  const t = tone(toneName);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={cx(
            'rounded-full transition-all duration-300',
            size,
            index < filled ? t.dot : 'bg-white/10',
            index === filled - 1 ? 'scale-110 ring-2 ring-white/10' : '',
          )}
        />
      ))}
    </div>
  );
}

function SectionLabel({ children, icon: Icon = Sparkles, action = null }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-slate-500" />
        <span className="text-[10px] font-semibold uppercase tracking-[.18em] text-slate-500">{children}</span>
      </div>
      {action}
    </div>
  );
}

function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-emerald-950 shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.03] px-3.5 py-2 text-xs font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[.06] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function KeyValue({ label, value, tone: toneName }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[.05] py-2 last:border-0">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className={cx('text-right text-[11px] font-medium', toneName ? tone(toneName).text : 'text-slate-200')}>
        {value}
      </span>
    </div>
  );
}

function RuleNote({ children, icon: Icon = Info, tone: toneName = 'sky', className = '' }) {
  const t = tone(toneName);
  return (
    <div className={cx('flex gap-2.5 rounded-xl border px-3 py-2.5', t.bg, t.border, className)}>
      <Icon className={cx('mt-0.5 h-3.5 w-3.5 shrink-0', t.text)} />
      <p className={cx('text-[11px] leading-relaxed', t.soft)}>{children}</p>
    </div>
  );
}

function downloadJson(data, filename) {
  try {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  } catch {
    // Unduhan bersifat opsional; state tetap tersimpan lokal.
  }
}

/* ------------------------------------------------------------------ */
/*  START SCREEN                                                       */
/* ------------------------------------------------------------------ */

function StartScreen({ saved, onStart, onResume, onDiscard }) {
  const [mode, setMode] = useState(saved?.mode === 'simulasi' ? 'simulasi' : 'latihan');
  const [gender, setGender] = useState(saved?.gender === 'female' ? 'female' : 'male');
  const selectedMode = MODES[mode];
  const selectedGender = GENDERS[gender];
  const savedPhase = saved ? getPhase(saved.phaseIndex || 0) : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060c09] text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-[34rem] w-[34rem] rounded-full bg-emerald-500/10 blur-[110px]" />
        <div className="absolute -right-40 top-10 h-[30rem] w-[30rem] rounded-full bg-amber-500/10 blur-[110px]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-teal-500/10 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[.22]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(251,191,36,.22) 1px, transparent 0)',
            backgroundSize: '26px 26px',
            maskImage: 'linear-gradient(to bottom, black, transparent 80%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 80%)',
          }}
        />
        <svg
          viewBox="0 0 600 400"
          className="absolute -right-20 bottom-[-6rem] h-[28rem] w-[42rem] text-emerald-300/[.06]"
          aria-hidden="true"
        >
          <path
            d="M120 220 300 110l180 110v170L300 500 120 390V220Z"
            fill="currentColor"
            stroke="rgba(251,191,36,.16)"
            strokeWidth="2"
          />
          <path d="M120 220 300 330l180-110M300 330v170" stroke="rgba(251,191,36,.16)" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[480px] flex-col justify-center px-4 py-8">
        <div className="space-y-6">
          <section className="max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <ToneBadge tone="emerald">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Prototipe edukasi
              </ToneBadge>
              <ToneBadge tone="slate">Proposed draft · belum ditinjau ulama</ToneBadge>
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white">
              Manasik{' '}
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
                Tamattu
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-400">
              Satu perjalanan interaktif dari miqat sampai Tawaf Wada. Belajar urutan, hitungan,
              purity, pelanggaran ihram, dan konsekuensinya lewat satu tabel aturan yang konsisten.
            </p>

            <div className="mt-6 grid gap-2.5">
              {[
                { Icon: Compass, title: 'Hitungan nyata', text: '7 putaran & 7 leg dengan guard rute.' },
                { Icon: ShieldCheck, title: 'Konsekuensi', text: 'Rukun, wajib, sunnah punya hasil berbeda.' },
                { Icon: BookOpen, title: 'Satu sumber', text: 'Kemenag 2023, bukan campuran madzhab.' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/[.07] bg-white/[.025] p-3 backdrop-blur"
                >
                  <item.Icon className="h-4 w-4 text-emerald-300" />
                  <p className="mt-2 text-xs font-semibold text-slate-200">{item.title}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-2xl border border-white/[.07] bg-black/20 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-slate-500">
                  Peta perjalanan
                </p>
                <span className="text-[10px] text-slate-500">9 fase · 22 ritual</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {PHASES.map((phase, index) => (
                  <span
                    key={phase.id}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/[.06] bg-white/[.03] px-2 py-1 text-[10px] text-slate-400"
                  >
                    <span className="font-mono text-[9px] text-emerald-400/70">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {phase.short}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-5 flex gap-2 text-[11px] leading-relaxed text-slate-500">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-400/70" />
              <span>
                Sumber aturan: <span className="text-slate-300">{RULE_SOURCE.label}</span>,{' '}
                {RULE_SOURCE.publisher}, {RULE_SOURCE.edition}. Konten fiqh prototipe ini belum
                diverifikasi ulama dan bukan fatwa.
              </span>
            </p>
          </section>

          <section className="relative">
            <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-b from-emerald-400/30 via-white/5 to-transparent" />
            <div className="relative rounded-[2rem] border border-white/10 bg-[#08120e]/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20">
                  <KaabaMark className="h-7 w-7" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-white">Mulai sesi</h2>
                  <p className="text-[11px] text-slate-500">Pilih mode dan avatar. Keduanya mengubah aturan.</p>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-slate-500">Mode</p>
                {Object.values(MODES).map((item) => {
                  const t = tone(item.tone);
                  const active = mode === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMode(item.id)}
                      className={cx(
                        'group flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition',
                        active
                          ? cx(t.borderStrong, t.bg, 'shadow-lg shadow-black/20')
                          : 'border-white/[.07] bg-white/[.02] hover:border-white/15 hover:bg-white/[.04]',
                      )}
                    >
                      <span
                        className={cx(
                          'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border',
                          active ? cx(t.bgStrong, t.border, t.text) : 'border-white/10 bg-white/[.03] text-slate-400',
                        )}
                      >
                        <item.Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className={cx('text-sm font-semibold', active ? 'text-white' : 'text-slate-200')}>
                            {item.label}
                          </span>
                          <span className={cx('text-[10px]', t.text)}>{item.tagline}</span>
                        </span>
                        <span className="mt-1 block text-[11px] leading-relaxed text-slate-500">
                          {item.description}
                        </span>
                      </span>
                      <span
                        className={cx(
                          'mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2',
                          active ? cx(t.borderStrong, t.dot) : 'border-white/15',
                        )}
                      >
                        {active && <Check className="h-2.5 w-2.5 text-[#07110d]" strokeWidth={3} />}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5">
                <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-slate-500">Avatar</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {Object.values(GENDERS).map((item) => {
                    const active = gender === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setGender(item.id)}
                        title={item.note}
                        className={cx(
                          'flex items-center gap-2 rounded-xl border p-2.5 text-left transition',
                          active
                            ? 'border-emerald-400/35 bg-emerald-500/10'
                            : 'border-white/[.07] bg-white/[.02] hover:border-white/15',
                        )}
                      >
                        <item.Icon className={cx('h-4 w-4', active ? 'text-emerald-300' : 'text-slate-500')} />
                        <span className={cx('text-xs font-medium', active ? 'text-white' : 'text-slate-400')}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-[10px] leading-relaxed text-slate-500">{selectedGender.note}</p>
              </div>

              <div className="mt-5 rounded-xl border border-white/[.07] bg-white/[.02] p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <BookMarked className="h-3.5 w-3.5 text-amber-300/80" />
                    <span className="text-[11px] text-slate-400">Sumber aturan sesi</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-300">Kemenag 2023</span>
                </div>
                <p className="mt-1.5 text-[10px] leading-relaxed text-slate-500">
                  {RULE_SOURCE.edition} · ISBN {RULE_SOURCE.isbn} · sumber tunggal, tanpa pemilih madzhab.
                </p>
              </div>

              {saved && (
                <div className="mt-3 rounded-xl border border-sky-400/20 bg-sky-500/[.07] p-3">
                  <div className="flex items-center gap-2">
                    <History className="h-3.5 w-3.5 text-sky-300" />
                    <p className="text-[11px] font-semibold text-sky-200">
                      {saved.finished ? 'Laporan terakhir tersimpan' : 'Sesi tersimpan'}
                    </p>
                  </div>
                  <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
                    {MODES[saved.mode]?.label || saved.mode} · {GENDERS[saved.gender]?.label || saved.gender} ·{' '}
                    {savedPhase?.label}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={onResume}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-sky-400 px-2.5 py-1.5 text-[11px] font-semibold text-sky-950 transition hover:bg-sky-300"
                    >
                      {saved.finished ? 'Lihat laporan' : 'Lanjutkan'}
                      <ArrowRight className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={onDiscard}
                      className="inline-flex items-center justify-center rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] text-slate-400 transition hover:border-rose-400/30 hover:text-rose-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              <PrimaryButton onClick={() => onStart(mode, gender)} className="mt-4 w-full py-2.5 text-sm">
                <selectedMode.Icon className="h-4 w-4" />
                Mulai {selectedMode.label}
                <ArrowRight className="h-4 w-4" />
              </PrimaryButton>

              <p className="mt-3 text-center text-[10px] leading-relaxed text-slate-600">
                Dengan memulai, Anda memilih satu tabel aturan untuk seluruh sesi. Tidak ada data yang
                dikirim keluar perangkat.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SCENES — ilustrasi skematik, bukan peta sebenarnya                 */
/* ------------------------------------------------------------------ */

function OrbitMarker({ t = 0, cx = 320, cy = 172, rx = 198, ry = 84, color = '#34d399' }) {
  const angle = -Math.PI / 2 - t * Math.PI * 2;
  const x = cx + rx * Math.cos(angle);
  const y = cy + ry * Math.sin(angle);
  return (
    <g
      style={{
        transform: `translate(${x}px, ${y}px)`,
        transition: 'transform .45s cubic-bezier(.2,.8,.2,1)',
      }}
    >
      <circle r="13" fill={color} opacity=".18" />
      <circle r="7" fill={color} stroke="#052e1b" strokeWidth="2.5" />
      <circle r="2" fill="#ecfdf5" />
    </g>
  );
}

const TAWAF_CROWD = (() => {
  const pseudo = (n) => {
    const value = Math.sin(n * 12.9898) * 43758.5453;
    return value - Math.floor(value);
  };
  return Array.from({ length: 42 }, (_, index) => {
    const cluster = index % 6;
    const baseAngle = (cluster / 6) * Math.PI * 2 + 0.4;
    return {
      angle: baseAngle + (pseudo(index + 1) - 0.5) * 0.24,
      radius: 98 + pseudo(index + 11) * 52,
      size: 2.6 + pseudo(index + 21) * 1.7,
      tone: pseudo(index + 31) > 0.55 ? '#5f8075' : '#45655c',
    };
  });
})();

function KaabaScene({ route }) {
  const completed = route?.completed || 0;
  const progress = Math.min(7, completed + (route?.t || 0));
  const progressRef = useRef(progress);
  const playerRef = useRef(null);
  const labelRef = useRef(null);
  progressRef.current = progress;

  useEffect(() => {
    let frame;
    let last = performance.now();
    let angle = -Math.PI / 2 - progressRef.current * Math.PI * 2;
    let avoid = 0;

    const draw = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const target = -Math.PI / 2 - progressRef.current * Math.PI * 2;
      if (target < angle - Math.PI * 2.5) angle = target;
      angle += (target - angle) * Math.min(1, dt * 6);

      let targetAvoid = 0;
      for (const person of TAWAF_CROWD) {
        const ahead = Math.atan2(Math.sin(angle - person.angle), Math.cos(angle - person.angle));
        if (
          ahead > 0.03 &&
          ahead < 0.4 &&
          Math.abs(person.radius - (126 + avoid)) < 17
        ) {
          targetAvoid = person.radius <= 126 ? 20 : -20;
          break;
        }
      }
      avoid += (targetAvoid - avoid) * Math.min(1, dt * 5);

      const radius = Math.max(98, Math.min(154, 126 + avoid));
      const x = 320 + radius * Math.cos(angle);
      const y = 180 + radius * Math.sin(angle);
      const nextAngle = angle - 0.02;
      const nx = 320 + radius * Math.cos(nextAngle);
      const ny = 180 + radius * Math.sin(nextAngle);
      const facing = (Math.atan2(ny - y, nx - x) * 180) / Math.PI;

      playerRef.current?.setAttribute('transform', `translate(${x} ${y}) rotate(${facing})`);
      labelRef.current?.setAttribute('transform', `translate(${x} ${y - 19})`);

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <svg viewBox="0 0 640 360" className="h-full w-full" role="img" aria-label="Tampak atas Ka'bah; karakter berjalan otomatis mengelilingi Ka'bah sambil menghindari kerumunan">
      <defs>
        <radialGradient id="matafTopGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#0e3329" />
          <stop offset="100%" stopColor="#06110d" />
        </radialGradient>
        <linearGradient id="kaabaTopGold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="45%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>

      <rect width="640" height="360" fill="#050f0b" />
      <circle cx="320" cy="180" r="184" fill="url(#matafTopGlow)" />
      <circle cx="320" cy="180" r="170" fill="none" stroke="#12362b" strokeWidth="20" opacity=".7" />
      <circle cx="320" cy="180" r="136" fill="none" stroke="#94a3b8" strokeOpacity=".12" strokeWidth="1" />
      <circle cx="320" cy="180" r="132" fill="none" stroke="#fbbf24" strokeOpacity=".24" strokeWidth="2" strokeDasharray="3 9" />
      <circle cx="320" cy="180" r="90" fill="#06110d" stroke="#1d4237" strokeWidth="1" />

      <g>
        <rect x="286" y="146" width="68" height="66" rx="3" fill="#04140e" stroke="#34d399" strokeOpacity=".35" />
        <rect x="286" y="166" width="68" height="9" fill="url(#kaabaTopGold)" opacity=".92" />
        <rect x="291" y="151" width="58" height="56" rx="2" fill="none" stroke="#fbbf24" strokeOpacity=".18" />
        <rect x="311" y="197" width="18" height="5" rx="1" fill="#fbbf24" opacity=".75" />
        <text x="320" y="187" textAnchor="middle" fill="#fef3c7" fontSize="7" letterSpacing="2" opacity=".6">
          KA’BAH
        </text>
      </g>

      <line x1="320" y1="34" x2="320" y2="62" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
      <text x="334" y="35" textAnchor="start" fill="#fbbf24" fontSize="7" letterSpacing="2" opacity=".7">
        HAJAR ASWAD
      </text>

      {TAWAF_CROWD.map((person, index) => {
        const x = 320 + person.radius * Math.cos(person.angle);
        const y = 180 + person.radius * Math.sin(person.angle);
        return (
          <g key={index} transform={`translate(${x} ${y})`} opacity=".8">
            <ellipse rx={person.size + 1.5} ry={person.size} fill={person.tone} />
            <circle cy={-person.size * 0.55} r={person.size * 0.72} fill="#6c8a80" />
          </g>
        );
      })}

      <g ref={playerRef}>
        <circle r="16" fill="#34d399" opacity=".12" />
        <circle r="11" fill="none" stroke="#34d399" strokeOpacity=".45" strokeWidth="1.2">
          <animate attributeName="r" values="8;15;8" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values=".5;.05;.5" dur="2s" repeatCount="indefinite" />
        </circle>
        <ellipse rx="7.5" ry="5" fill="#10b981" stroke="#ecfdf5" strokeWidth="1.4" />
        <circle cx="5" cy="0" r="3.2" fill="#ecfdf5" stroke="#065f46" strokeWidth=".9" />
        <path d="M11 -2.6 L17 0 L11 2.6Z" fill="#a7f3d0" opacity=".9" />
      </g>
      <g ref={labelRef}>
        <text textAnchor="middle" fill="#a7f3d0" fontSize="7" letterSpacing="1.5" opacity=".85">
          ANDA
        </text>
      </g>

    </svg>
  );
}

function SaiScene({ route }) {
  const position = route?.started ? route.position : 0;
  const x = 124 + position * 392;
  const y = 204 - Math.sin(position * Math.PI) * 15;
  return (
    <svg viewBox="0 0 640 320" className="h-full w-full" role="img" aria-label="Ilustrasi Sa'i antara Safa dan Marwah">
      <defs>
        <linearGradient id="saiSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#131b33" />
          <stop offset="62%" stopColor="#0b1520" />
          <stop offset="100%" stopColor="#07100d" />
        </linearGradient>
        <radialGradient id="saiGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity=".16" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="320" fill="url(#saiSky)" />
      <circle cx="320" cy="170" r="180" fill="url(#saiGlow)" />
      <ellipse cx="320" cy="248" rx="290" ry="66" fill="#0a1a17" opacity=".8" />
      <path d="M0 252 Q160 214 320 232 T640 246 L640 320 L0 320Z" fill="#081410" />
      <path d="M62 236 C100 156 170 146 212 224Z" fill="#134e4a" opacity=".85" />
      <path d="M428 224 C466 146 536 156 578 236Z" fill="#134e4a" opacity=".85" />
      <path d="M78 226 C110 170 166 160 198 222" fill="none" stroke="#2dd4bf" strokeOpacity=".22" strokeWidth="2" />
      <path d="M442 222 C474 160 526 170 562 226" fill="none" stroke="#2dd4bf" strokeOpacity=".22" strokeWidth="2" />
      <path d="M124 210 C210 178, 430 178, 516 210" fill="none" stroke="#94a3b8" strokeOpacity=".3" strokeWidth="2" strokeDasharray="6 7" />
      <g opacity=".9">
        <rect x="292" y="112" width="7" height="106" rx="3" fill="#22c55e" opacity=".55" />
        <rect x="341" y="112" width="7" height="106" rx="3" fill="#22c55e" opacity=".55" />
        <rect x="292" y="112" width="7" height="16" rx="3" fill="#86efac" />
        <rect x="341" y="112" width="7" height="16" rx="3" fill="#86efac" />
        <text x="320" y="104" textAnchor="middle" fill="#86efac" fontSize="7" letterSpacing="2" opacity=".7">
          ZONA HIJAU
        </text>
      </g>
      <g style={{ transform: `translate(${x}px, ${y}px)`, transition: 'transform .55s cubic-bezier(.2,.8,.2,1)' }}>
        <circle r="16" fill="#38bdf8" opacity=".14" />
        <circle r="8" fill="#38bdf8" stroke="#07111a" strokeWidth="2.5" />
        <circle r="2.5" fill="#e0f2fe" />
      </g>
      <text x="96" y="262" textAnchor="middle" fill="#5eead4" fontSize="11" letterSpacing="2">SAFA</text>
      <text x="544" y="262" textAnchor="middle" fill="#5eead4" fontSize="11" letterSpacing="2">MARWAH</text>
      <text x="320" y="300" textAnchor="middle" fill="#94a3b8" fontSize="8" letterSpacing="3" opacity=".55">
        7 LEG · BOLAK-BALIK
      </text>
      <g transform="translate(196 286)">
        {Array.from({ length: 7 }).map((_, index) => (
          <circle
            key={index}
            cx={index * 18}
            cy="0"
            r="3"
            fill={index < (route?.completed || 0) ? '#38bdf8' : '#1e293b'}
          />
        ))}
      </g>
    </svg>
  );
}

function MiqatScene() {
  return (
    <svg viewBox="0 0 640 320" className="h-full w-full" role="img" aria-label="Ilustrasi batas miqat">
      <defs>
        <linearGradient id="miqatSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d2431" />
          <stop offset="58%" stopColor="#0b1b17" />
          <stop offset="100%" stopColor="#07100c" />
        </linearGradient>
        <radialGradient id="miqatSun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fcd34d" stopOpacity=".3" />
          <stop offset="100%" stopColor="#fcd34d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="320" fill="url(#miqatSky)" />
      <circle cx="470" cy="92" r="92" fill="url(#miqatSun)" />
      <circle cx="470" cy="92" r="18" fill="#fde68a" opacity=".55" />
      <path d="M0 232 Q160 204 320 220 T640 228 L640 320 L0 320Z" fill="#0a1a13" />
      <path d="M0 258 Q200 238 420 252 T640 258" fill="none" stroke="#94a3b8" strokeOpacity=".11" strokeWidth="1" />
      <path d="M420 218 L420 320" stroke="#fbbf24" strokeOpacity=".35" strokeWidth="2" strokeDasharray="7 8" />
      <text x="432" y="304" fill="#fbbf24" fontSize="8" letterSpacing="2" opacity=".65">BATAS MIQAT</text>
      <g transform="translate(420 188)">
        <rect x="-2" y="-8" width="4" height="54" rx="2" fill="#475569" />
        <rect x="-48" y="-46" width="96" height="38" rx="7" fill="#0f2a22" stroke="#34d399" strokeOpacity=".45" />
        <text x="0" y="-23" textAnchor="middle" fill="#a7f3d0" fontSize="11" letterSpacing="3">MIQAT</text>
        <text x="0" y="-12" textAnchor="middle" fill="#5eead4" fontSize="6" letterSpacing="1.5" opacity=".6">IH RAM</text>
      </g>
      <g transform="translate(150 206)" opacity=".9">
        <path d="M-38 8 L-20 -44 L-6 8Z" fill="#e2e8f0" opacity=".75" />
        <path d="M8 8 L26 -44 L40 8Z" fill="#e2e8f0" opacity=".55" />
        <path d="M-34 8 L38 8" stroke="#fbbf24" strokeOpacity=".35" strokeWidth="2" />
      </g>
      <g transform="translate(150 118)" opacity=".35">
        <path d="M0 0 L46 -5 L42 2 L4 7Z" fill="#e2e8f0" />
        <path d="M10 2 L18 -18 L24 -17 L20 4Z" fill="#e2e8f0" />
        <path d="M-8 2 L-30 12 M46 0 L66 8" stroke="#e2e8f0" strokeWidth="1.2" />
      </g>
      <path d="M70 176 C170 152, 280 152, 380 176" fill="none" stroke="#38bdf8" strokeOpacity=".25" strokeWidth="1.5" strokeDasharray="4 7" />
      <text x="84" y="292" fill="#94a3b8" fontSize="8" letterSpacing="3" opacity=".55">KEBERANGKATAN</text>
      <text x="548" y="292" fill="#94a3b8" fontSize="8" letterSpacing="3" opacity=".55">MAKKAH</text>
    </svg>
  );
}

function ArafahScene() {
  return (
    <svg viewBox="0 0 640 320" className="h-full w-full" role="img" aria-label="Ilustrasi Arafah dan Jabal Rahmah">
      <defs>
        <linearGradient id="arafahSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b1d17" />
          <stop offset="45%" stopColor="#1d1a1a" />
          <stop offset="100%" stopColor="#0a1210" />
        </linearGradient>
        <radialGradient id="arafahSun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity=".55" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="320" fill="url(#arafahSky)" />
      <circle cx="470" cy="98" r="100" fill="url(#arafahSun)" />
      <circle cx="470" cy="98" r="26" fill="#fde68a" opacity=".75" />
      <path d="M0 226 Q120 190 230 218 T440 210 T640 226 L640 320 L0 320Z" fill="#151b16" />
      <path d="M120 238 L250 104 L292 144 L338 92 L470 238Z" fill="#2a2620" />
      <path d="M250 104 L292 144 L338 92 L360 120 L300 190 L230 160Z" fill="#373027" opacity=".7" />
      <path d="M318 122 L338 92 L360 120 L342 142Z" fill="#6b5d3d" opacity=".6" />
      <g transform="translate(104 232)">
        {[0, 1, 2, 3].map((index) => (
          <g key={index} transform={`translate(${index * 54} 0)`}>
            <path d="M0 0 L22 -24 L44 0Z" fill={index % 2 ? '#0f3a31' : '#134e4a'} stroke="#2dd4bf" strokeOpacity=".2" />
            <path d="M6 -2 L22 -20 L38 -2" fill="none" stroke="#fbbf24" strokeOpacity=".25" />
          </g>
        ))}
      </g>
      <g transform="translate(430 236)">
        {[0, 1, 2].map((index) => (
          <g key={index} transform={`translate(${index * 52} 0)`}>
            <path d="M0 0 L22 -24 L44 0Z" fill={index % 2 ? '#134e4a' : '#0f3a31'} stroke="#2dd4bf" strokeOpacity=".2" />
          </g>
        ))}
      </g>
      <text x="320" y="304" textAnchor="middle" fill="#fcd34d" fontSize="8" letterSpacing="3" opacity=".55">
        WUQUF · ZAWAL 9 → FAJAR 10
      </text>
      <text x="500" y="72" fill="#fcd34d" fontSize="9" letterSpacing="3" opacity=".55">ARAF AH</text>
    </svg>
  );
}

function MuzdalifahScene() {
  const stars = [
    [72, 54, 1.2],
    [138, 88, 0.8],
    [206, 42, 1],
    [284, 76, 1.3],
    [352, 38, 0.7],
    [424, 72, 1.1],
    [496, 46, 0.9],
    [560, 92, 1.2],
    [596, 40, 0.7],
    [106, 126, 0.6],
    [252, 116, 0.8],
    [388, 118, 0.6],
    [520, 132, 0.7],
  ];
  return (
    <svg viewBox="0 0 640 320" className="h-full w-full" role="img" aria-label="Ilustrasi malam di Muzdalifah">
      <defs>
        <linearGradient id="muzSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b1024" />
          <stop offset="55%" stopColor="#0a1420" />
          <stop offset="100%" stopColor="#07100d" />
        </linearGradient>
        <radialGradient id="muzMoon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity=".3" />
          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="320" fill="url(#muzSky)" />
      {stars.map(([x, y, r], index) => (
        <circle key={index} cx={x} cy={y} r={r} fill="#e2e8f0" opacity={0.4 + (index % 3) * 0.14} />
      ))}
      <circle cx="474" cy="88" r="86" fill="url(#muzMoon)" />
      <path d="M490 62 a30 30 0 1 0 0 52 a24 24 0 1 1 0 -52Z" fill="#e2e8f0" opacity=".7" />
      <path d="M0 238 Q160 212 320 228 T640 238 L640 320 L0 320Z" fill="#0a1612" />
      <path d="M0 270 Q180 250 360 264 T640 268" fill="none" stroke="#94a3b8" strokeOpacity=".1" />
      {[
        [96, 254, 2.4],
        [132, 266, 1.6],
        [188, 248, 2],
        [236, 274, 1.4],
        [298, 258, 2.2],
        [344, 280, 1.5],
        [402, 252, 1.8],
        [466, 272, 2.5],
        [518, 258, 1.4],
        [566, 278, 1.8],
      ].map(([x, y, r], index) => (
        <circle key={index} cx={x} cy={y} r={r} fill="#a8a29e" opacity=".5" />
      ))}
      <g transform="translate(70 230)" opacity=".55">
        <path d="M0 0 L20 -20 L40 0Z" fill="#1e293b" />
        <path d="M14 0 L20 -14 L26 0Z" fill="#334155" />
      </g>
      <g transform="translate(546 236)" opacity=".45">
        <path d="M0 0 L18 -18 L36 0Z" fill="#1e293b" />
      </g>
      <text x="320" y="306" textAnchor="middle" fill="#a5b4fc" fontSize="8" letterSpacing="3" opacity=".55">
        MUZDALIFAH · MENGAMBIL KERIKIL
      </text>
    </svg>
  );
}

function MinaScene({ highlight = [], pebbles = 0 }) {
  const pillars = Object.values(JAMARAT);
  return (
    <svg viewBox="0 0 640 320" className="h-full w-full" role="img" aria-label="Ilustrasi tenda Mina dan tiga jumrah">
      <defs>
        <linearGradient id="minaSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2118" />
          <stop offset="48%" stopColor="#191c17" />
          <stop offset="100%" stopColor="#0a1210" />
        </linearGradient>
        <radialGradient id="minaSun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity=".32" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="320" fill="url(#minaSky)" />
      <circle cx="112" cy="82" r="92" fill="url(#minaSun)" />
      <circle cx="112" cy="82" r="17" fill="#fde68a" opacity=".55" />
      <path d="M0 238 Q160 214 320 230 T640 238 L640 320 L0 320Z" fill="#0c1712" />
      <g opacity=".65">
        {[
          [70, 206, 0.9],
          [140, 214, 0.75],
          [500, 210, 0.8],
          [570, 202, 0.65],
        ].map(([x, y, scale], index) => (
          <g key={index} transform={`translate(${x} ${y}) scale(${scale})`}>
            <path d="M0 0 L26 -28 L52 0Z" fill={index % 2 ? '#134e4a' : '#0f3a31'} stroke="#2dd4bf" strokeOpacity=".18" />
            <path d="M8 -2 L26 -24 L44 -2" fill="none" stroke="#fbbf24" strokeOpacity=".18" />
          </g>
        ))}
      </g>
      {pillars.map((pillar) => {
        const active = highlight.includes(pillar.id);
        return (
          <g key={pillar.id} transform={`translate(${pillar.x} 238)`}>
            {active && <ellipse cx="0" cy="4" rx="26" ry="8" fill="#fbbf24" opacity=".14" />}
            <rect
              x="-11"
              y="-74"
              width="22"
              height="74"
              rx="4"
              fill={active ? '#f59e0b' : '#475569'}
              opacity={active ? 0.9 : 0.55}
              stroke={active ? '#fde68a' : '#64748b'}
              strokeOpacity=".5"
            />
            <rect x="-15" y="-82" width="30" height="10" rx="3" fill={active ? '#fbbf24' : '#64748b'} opacity=".8" />
            <circle cx="0" cy="-86" r={active ? 4 : 2.5} fill={active ? '#fef3c7' : '#94a3b8'} opacity=".8" />
            <text x="0" y="19" textAnchor="middle" fill={active ? '#fde68a' : '#64748b'} fontSize="7" letterSpacing="1">
              {pillar.short.toUpperCase()}
            </text>
          </g>
        );
      })}
      <g opacity=".55">
        {Array.from({ length: Math.min(18, pebbles || 0) }).map((_, index) => (
          <circle
            key={index}
            cx={430 + (index % 9) * 14}
            cy={258 + Math.floor(index / 9) * 10}
            r="2"
            fill="#a8a29e"
          />
        ))}
      </g>
      <text x="320" y="306" textAnchor="middle" fill="#fcd34d" fontSize="8" letterSpacing="3" opacity=".5">
        MINA · JAMARAT
      </text>
    </svg>
  );
}

function WadaScene({ route }) {
  return (
    <svg viewBox="0 0 640 320" className="h-full w-full" role="img" aria-label="Ilustrasi Tawaf Wada dan perpisahan">
      <defs>
        <linearGradient id="wadaSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#241a26" />
          <stop offset="46%" stopColor="#14191d" />
          <stop offset="100%" stopColor="#08110d" />
        </linearGradient>
        <radialGradient id="wadaGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#fb923c" stopOpacity=".28" />
          <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wadaGold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <rect width="640" height="320" fill="url(#wadaSky)" />
      <circle cx="164" cy="150" r="150" fill="url(#wadaGlow)" />
      <path d="M0 240 Q200 214 420 236 T640 242 L640 320 L0 320Z" fill="#0a1612" />
      <ellipse cx="220" cy="230" rx="148" ry="42" fill="#0e2721" opacity=".8" />
      <ellipse cx="220" cy="230" rx="128" ry="34" fill="none" stroke="#fbbf24" strokeOpacity=".2" strokeDasharray="3 8" />
      <g transform="translate(220 216) scale(.78)">
        <ellipse cx="0" cy="48" rx="58" ry="16" fill="#000" opacity=".4" />
        <path d="M-42 -34 L-30 -46 L50 -46 L38 -34Z" fill="#0f766e" />
        <rect x="-42" y="-34" width="80" height="78" rx="4" fill="#052e22" stroke="#34d399" strokeOpacity=".35" />
        <rect x="-42" y="-8" width="80" height="10" fill="url(#wadaGold)" opacity=".9" />
        <rect x="-10" y="18" width="20" height="26" rx="2" fill="#020b08" stroke="#fbbf24" strokeOpacity=".4" />
      </g>
      {route && <OrbitMarker t={route.t || 0} cx={220} cy={230} rx={140} ry={36} color="#fbbf24" />}
      <path d="M340 268 C410 250, 500 252, 600 276" fill="none" stroke="#fbbf24" strokeOpacity=".18" strokeWidth="2" strokeDasharray="5 9" />
      <g transform="translate(482 224)" opacity=".5">
        <rect x="-16" y="-12" width="32" height="24" rx="4" fill="#1e293b" stroke="#94a3b8" strokeOpacity=".3" />
        <path d="M-16 -12 L0 -26 L16 -12" fill="none" stroke="#94a3b8" strokeOpacity=".35" />
      </g>
      <text x="320" y="302" textAnchor="middle" fill="#fbbf24" fontSize="8" letterSpacing="3" opacity=".55">
        TAWAF WADA · PERPISAHAN
      </text>
    </svg>
  );
}

function SceneArt({ state, phase, activeRoute }) {
  const route = activeRoute ? state.routes?.[activeRoute] : null;
  if (phase.id === 'miqat') return <MiqatScene />;
  if (phase.id === 'arafah') return <ArafahScene />;
  if (phase.id === 'muzdalifah') return <MuzdalifahScene />;
  if (phase.id === 'haji8') return <MinaScene pebbles={state.pebbles} />;
  if (phase.id === 'mina11' || phase.id === 'mina12') {
    return <MinaScene highlight={['ula', 'wusta', 'aqabah']} pebbles={state.pebbles} />;
  }
  if (phase.id === 'haji10') {
    if (activeRoute === 'tawafIfadah') return <KaabaScene route={route} />;
    return <MinaScene highlight={['aqabah']} pebbles={state.pebbles} />;
  }
  if (phase.id === 'wada') {
    return activeRoute === 'tawafWada' ? <KaabaScene route={route} /> : <WadaScene route={null} />;
  }
  if (phase.id === 'umrah') {
    if (activeRoute === 'saiUmrah') return <SaiScene route={route} />;
    return <KaabaScene route={activeRoute === 'tawafUmrah' ? route : null} />;
  }
  return <KaabaScene route={null} />;
}

/* ------------------------------------------------------------------ */
/*  GAME CHROME                                                        */
/* ------------------------------------------------------------------ */

function TopBar({ state, onMenu, onGuide, onHistory, onReport }) {
  const phase = getPhase(state.phaseIndex);
  const mode = MODES[state.mode];
  return (
    <header className="sticky top-0 z-40 border-b border-white/[.06] bg-[#060c09]/85 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[480px] items-center gap-2 px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20">
            <KaabaMark className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-[15px] font-semibold tracking-tight text-white">
                Manasik Tamattu
              </h1>
              <span className="hidden rounded-md border border-white/10 bg-white/[.03] px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-slate-500 sm:inline">
                Proto
              </span>
            </div>
            <p className="hidden text-[10px] text-slate-500">
              {RULE_SOURCE.short} · {RULE_SOURCE.edition}
            </p>
          </div>
        </div>

        <div className="ml-1 hidden min-w-0 items-center gap-2 border-l border-white/[.07] pl-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[.04] text-slate-400">
            <phase.Icon className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-medium text-slate-200">{phase.label}</p>
            <p className="text-[9px] uppercase tracking-[.14em] text-slate-500">
              Fase {state.phaseIndex + 1}/{PHASES.length} · {phase.momentLabel}
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <ToneBadge tone={mode.tone} className="hidden sm:inline-flex">
            <mode.Icon className="h-3 w-3" />
            {mode.label}
          </ToneBadge>
          <button
            type="button"
            onClick={onGuide}
            aria-label="Panduan sesi"
            title="Panduan sesi"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/[.08] bg-white/[.03] text-slate-300 transition hover:border-white/20 hover:bg-white/[.06] hover:text-white"
          >
            <BookOpen className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onHistory}
            aria-label="Riwayat sesi"
            title="Riwayat sesi"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/[.08] bg-white/[.03] text-slate-300 transition hover:border-white/20 hover:bg-white/[.06] hover:text-white"
          >
            <History className="h-3.5 w-3.5" />
          </button>
          {state.finished && (
            <button
              type="button"
              onClick={onReport}
              aria-label="Buka laporan"
              title="Buka laporan"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-amber-950 transition hover:bg-amber-300"
            >
              <ScrollText className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={onMenu}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/[.08] bg-white/[.03] text-slate-300 transition hover:border-white/20 hover:bg-white/[.06] hover:text-white"
            aria-label="Menu sesi"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

function ResourceStrip({ state, dispatch, onRestore }) {
  const phase = getPhase(state.phaseIndex);
  const openDebts = state.debts.filter((d) => !d.resolved).length;
  const openViolations = state.ledger.filter((v) => !v.resolved).length;
  const promptTotal = Object.values(state.prompts).filter((p) => p.firstCorrect !== null).length;
  const promptCorrect = Object.values(state.prompts).filter((p) => p.firstCorrect === true).length;
  const required = RITUALS.filter((r) => r.phase === phase.id);
  const done = required.filter((r) => isComplete(state, r.id)).length;
  const canCollect = ['muzdalifah', 'haji10', 'mina11', 'mina12'].includes(phase.id);

  return (
    <div className="border-b border-white/[.05] bg-[#07100c]/70">
      <div className="mx-auto flex max-w-[480px] items-center gap-1.5 overflow-x-auto px-3 py-2">
        <StatChip
          Icon={Droplets}
          label="Purity"
          value={state.purity.wudu ? 'Suci' : 'Belum wudu'}
          tone={state.purity.wudu ? 'emerald' : 'amber'}
          active={state.purity.wudu}
          onClick={state.purity.wudu || state.finished ? undefined : () => dispatch({ type: 'TAKE_WUDU' })}
          title={state.purity.wudu ? 'Sudah berwudu' : 'Klik untuk mengambil wudu'}
        />
        <StatChip
          Icon={ShieldCheck}
          label="Ihram"
          value={state.ihram.active ? `Episode ${state.ihram.active}` : 'Tidak aktif'}
          tone={state.ihram.active ? 'emerald' : 'slate'}
          active={Boolean(state.ihram.active)}
        />
        <StatChip
          Icon={CircleDot}
          label="Kerikil"
          value={`${state.pebbles}/70`}
          tone={state.pebbles > 0 ? 'sky' : 'slate'}
          onClick={canCollect && state.pebbles < 70 && !state.finished ? () => dispatch({ type: 'COLLECT_PEBBLES' }) : undefined}
          title={canCollect ? 'Klik untuk mengambil 7 kerikil' : 'Kerikil diambil di Muzdalifah atau Mina'}
        />
        <StatChip
          Icon={Scale}
          label="Dam"
          value={`${openDebts} tertunda`}
          tone={openDebts ? 'amber' : 'emerald'}
          active={openDebts > 0}
        />
        <StatChip
          Icon={TargetIcon}
          label="Kuis"
          value={`${promptCorrect}/${promptTotal}`}
          tone={promptTotal && promptCorrect === promptTotal ? 'emerald' : 'violet'}
          active={promptTotal > 0}
        />
        <StatChip
          Icon={ListChecks}
          label="Fase"
          value={`${done}/${required.length}`}
          tone={done === required.length ? 'emerald' : 'slate'}
        />
        <div className="ml-auto hidden shrink-0 items-center gap-1.5 pl-2">
          {state.mode === 'latihan' && state.checkpoint && !state.finished && (
            <button
              type="button"
              onClick={onRestore}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[.07] bg-white/[.03] px-2 py-1.5 text-[10px] text-slate-400 transition hover:border-sky-400/25 hover:text-sky-300"
            >
              <RotateCcw className="h-3 w-3" />
              Checkpoint
            </button>
          )}
          <span className="rounded-lg border border-white/[.06] bg-white/[.02] px-2 py-1.5 font-mono text-[10px] text-slate-500">
            {state.seed} · turn {state.turn}
          </span>
        </div>
      </div>
    </div>
  );
}

function TargetIcon({ className }) {
  return <ListChecks className={className} />;
}

function PhaseRail({ state, compact = false }) {
  const current = state.phaseIndex;

  if (compact) {
    return (
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {PHASES.map((phase, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <div
              key={phase.id}
              className={cx(
                'flex shrink-0 items-center gap-1.5 rounded-xl border px-2.5 py-1.5',
                active
                  ? 'border-emerald-400/35 bg-emerald-500/10'
                  : done
                    ? 'border-white/[.07] bg-white/[.03]'
                    : 'border-white/[.05] bg-white/[.015] opacity-60',
              )}
            >
              <span
                className={cx(
                  'flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold',
                  active
                    ? 'bg-emerald-400 text-emerald-950'
                    : done
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-white/[.05] text-slate-500',
                )}
              >
                {done ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : index + 1}
              </span>
              <span className={cx('text-[10px] font-medium', active ? 'text-white' : 'text-slate-400')}>
                {phase.short}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <aside className="rounded-3xl border border-white/[.07] bg-[#0a1410]/80 p-3.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-slate-500">Perjalanan</p>
        <span className="rounded-md border border-white/[.06] bg-white/[.02] px-1.5 py-0.5 font-mono text-[9px] text-slate-500">
          {current + 1}/{PHASES.length}
        </span>
      </div>

      <ol className="mt-3 space-y-0.5">
        {PHASES.map((phase, index) => {
          const done = index < current;
          const active = index === current;
          const future = index > current;
          return (
            <li key={phase.id} className="relative">
              {index < PHASES.length - 1 && (
                <span
                  className={cx(
                    'absolute left-[15px] top-9 h-[calc(100%-12px)] w-px',
                    done ? 'bg-emerald-400/25' : 'bg-white/[.06]',
                  )}
                />
              )}
              <div
                className={cx(
                  'relative flex items-start gap-2.5 rounded-2xl px-1.5 py-2 transition',
                  active ? 'bg-emerald-500/[.07]' : 'hover:bg-white/[.02]',
                )}
              >
                <span
                  className={cx(
                    'relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold',
                    active
                      ? 'border-emerald-300/60 bg-emerald-400 text-emerald-950 shadow-lg shadow-emerald-950/40'
                      : done
                        ? 'border-emerald-400/25 bg-emerald-500/15 text-emerald-300'
                        : 'border-white/[.08] bg-[#0a1410] text-slate-500',
                  )}
                >
                  {done ? (
                    <Check className="h-3 w-3" strokeWidth={3} />
                  ) : active ? (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-950/40" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-950" />
                    </span>
                  ) : (
                    index + 1
                  )}
                </span>
                <div className={cx('min-w-0 flex-1', future && 'opacity-55')}>
                  <div className="flex items-center gap-1.5">
                    <p className={cx('truncate text-[11px] font-medium', active ? 'text-white' : 'text-slate-300')}>
                      {phase.short}
                    </p>
                    {active && (
                      <span className="rounded bg-emerald-400/15 px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-emerald-300">
                        now
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-[9px] text-slate-500">{phase.momentLabel}</p>
                  {active && (
                    <div className="mt-1 flex items-center gap-1.5">
                      <MiniDots
                        total={RITUALS.filter((r) => r.phase === phase.id).length}
                        filled={RITUALS.filter((r) => r.phase === phase.id && isComplete(state, r.id)).length}
                        size="h-1.5 w-1.5"
                      />
                      <span className="text-[8px] text-slate-500">
                        {RITUALS.filter((r) => r.phase === phase.id && isComplete(state, r.id)).length}/
                        {RITUALS.filter((r) => r.phase === phase.id).length}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-3 rounded-2xl border border-white/[.06] bg-white/[.02] p-3">
        <div className="flex items-center gap-2">
          <Clock3 className="h-3 w-3 text-slate-500" />
          <p className="text-[9px] font-semibold uppercase tracking-[.16em] text-slate-500">Titik istirahat</p>
        </div>
        <p className="mt-1.5 text-[11px] font-medium leading-snug text-slate-300">
          {getPhase(current).restPoint.label}
        </p>
        <p className="mt-1.5 text-[9px] leading-relaxed text-slate-500">
          Waktu tidak berjalan sendiri. Audit dijalankan sebelum fase bergerak.
        </p>
      </div>
    </aside>
  );
}

function PhaseHero({ state, onAdvance, onFinish, onRestore, onReport }) {
  const phase = getPhase(state.phaseIndex);
  const required = RITUALS.filter((r) => r.phase === phase.id);
  const done = required.filter((r) => isComplete(state, r.id)).length;
  const isLast = state.phaseIndex === PHASES.length - 1;
  const nextPhase = PHASES[state.phaseIndex + 1];
  const outcome = state.finished ? outcomeMeta(computeOutcome(state)) : null;
  const t = tone(phase.tone);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/[.08] bg-[#0a1410]/90 p-4 sm:p-5">
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-500/[.07] blur-3xl" />
      <div className="relative flex flex-col gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <ToneBadge tone={phase.tone}>
              <phase.Icon className="h-3 w-3" />
              {phase.eyebrow}
            </ToneBadge>
            <span className="text-[10px] text-slate-500">{phase.momentLabel}</span>
            <span className="h-1 w-1 rounded-full bg-slate-700" />
            <span className="text-[10px] text-slate-500">{phase.zoneLabel}</span>
          </div>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">
            {phase.headline}
          </h2>
          <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-slate-400">
            {phase.narrative}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {phase.focus.map((item) => (
              <span
                key={item}
                className="rounded-lg border border-white/[.06] bg-white/[.025] px-2 py-1 text-[10px] text-slate-400"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <CircleProgress value={done} max={required.length} tone={done === required.length ? 'emerald' : phase.tone} size={84} stroke={6}>
            <span className="text-lg font-semibold text-white">{done}</span>
            <span className="text-[9px] text-slate-500">dari {required.length} ritual</span>
          </CircleProgress>
          {state.finished ? (
            <ToneBadge tone={outcome.tone}>
              <outcome.Icon className="h-3 w-3" />
              {outcome.label}
            </ToneBadge>
          ) : (
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-[.14em] text-slate-500">Fase berikutnya</p>
              <p className="text-[11px] font-medium text-slate-300">{nextPhase ? nextPhase.short : 'Laporan'}</p>
            </div>
          )}
        </div>
      </div>

      <div className="relative mt-4 flex flex-col gap-2.5 border-t border-white/[.06] pt-3.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={cx('flex h-6 w-6 items-center justify-center rounded-lg border', t.bg, t.border, t.text)}>
              <Clock3 className="h-3 w-3" />
            </span>
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-[.16em] text-slate-500">Titik istirahat</p>
              <p className="truncate text-[11px] font-medium text-slate-300">{phase.restPoint.label}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {state.mode === 'latihan' && state.checkpoint && (
            <GhostButton onClick={onRestore} className="py-1.5 text-[10px]">
              <RotateCcw className="h-3 w-3" />
              Checkpoint fase
            </GhostButton>
          )}
          {state.finished ? (
            <PrimaryButton onClick={onReport} className="py-2">
              <Trophy className="h-3.5 w-3.5" />
              Lihat laporan
            </PrimaryButton>
          ) : isLast ? (
            <PrimaryButton onClick={onFinish} className="py-2">
              <Trophy className="h-3.5 w-3.5" />
              Selesaikan sesi
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={onAdvance} className="py-2">
              <ChevronRight className="h-3.5 w-3.5" />
              Audit & lanjut
            </PrimaryButton>
          )}
        </div>
      </div>
      {state.finished && (
        <div className="relative mt-2 flex items-center gap-2 text-[10px] text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-amber-300" />
          {state.endedEarly
            ? 'Sesi dihentikan. Buka laporan dari tombol di kanan atas atau menu sesi.'
            : 'Sesi selesai. Buka laporan dari tombol di kanan atas atau menu sesi.'}
        </div>
      )}
    </section>
  );
}

function ScenePanel({ state, ui, setUi, dispatch }) {
  const phase = getPhase(state.phaseIndex);
  const activeRoute = ui.activeRoute;
  const routeRitual = activeRoute ? RITUAL_MAP[activeRoute] : null;
  const isTawafRoute = routeRitual?.kind === 'tawaf';
  const jamaratHighlight =
    phase.id === 'haji10' ? ['aqabah'] : phase.id === 'mina11' || phase.id === 'mina12' ? ['ula', 'wusta', 'aqabah'] : [];

  return (
    <div className="space-y-3">
      <section className="relative overflow-hidden rounded-3xl border border-white/[.08] bg-[#08120e]">
        <div className="relative h-[250px] sm:h-[300px]">
          <SceneArt state={state} phase={phase} activeRoute={activeRoute} />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 bg-gradient-to-b from-black/55 to-transparent p-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-black/30 text-emerald-300 backdrop-blur">
                <phase.Icon className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="text-[9px] uppercase tracking-[.16em] text-slate-400">Lokasi</p>
                <p className="text-[11px] font-medium text-white">{phase.zoneLabel}</p>
              </div>
            </div>
            <span className="rounded-md border border-white/10 bg-black/25 px-2 py-1 text-[9px] text-slate-400 backdrop-blur">
              {isTawafRoute ? 'Tampak atas' : 'Ilustrasi skematik'}
            </span>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#08120e] via-[#08120e]/80 to-transparent p-3 pt-12">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-emerald-300/70">
                  {phase.short}
                </p>
                <p className="mt-0.5 max-w-lg text-[11px] leading-relaxed text-slate-300">
                  {isTawafRoute
                    ? 'Karakter mengikuti langkah tawaf Anda. Tiga langkah menyelesaikan satu putaran.'
                    : phase.tip}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {activeRoute && (
                  <ToneBadge tone={routeRitual?.kind === 'sai' ? 'sky' : 'emerald'}>
                    <Route className="h-3 w-3" />
                    Rute aktif
                  </ToneBadge>
                )}
                {jamaratHighlight.length > 0 && (
                  <ToneBadge tone="amber">
                    <Milestone className="h-3 w-3" />
                    Lontar
                  </ToneBadge>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {activeRoute && routeRitual && (
        <RouteConsole state={state} ritual={routeRitual} onClose={() => setUi((u) => ({ ...u, activeRoute: null }))} dispatch={dispatch} />
      )}
    </div>
  );
}

function RouteConsole({ state, ritual, onClose, dispatch }) {
  const route = state.routes[ritual.id] || (ritual.kind === 'tawaf'
    ? { completed: 0, t: 0, steps: 0, rejected: 0 }
    : { completed: 0, position: 0, started: false, rejected: 0 });
  const isTawaf = ritual.kind === 'tawaf';
  const done = route.completed >= 7;
  const block = getRitualBlock(state, ritual);
  const needsWudu = ritual.requiresPurity && !state.purity.wudu;
  const t = tone(isTawaf ? 'emerald' : 'sky');

  return (
    <section className="rounded-3xl border border-white/[.08] bg-[#0a1410]/95 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <IconBubble Icon={ritual.Icon} tone={isTawaf ? 'emerald' : 'sky'} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-white">{ritual.name}</h3>
              <ClassBadge classification={ritual.classification} small />
              <ToneBadge tone={done ? 'emerald' : isTawaf ? 'emerald' : 'sky'}>
                {done ? 'Selesai' : `${route.completed}/7 ${isTawaf ? 'putaran' : 'leg'}`}
              </ToneBadge>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{ritual.citation}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[.08] text-slate-500 transition hover:border-white/20 hover:text-white"
          aria-label="Tutup simulator rute"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <MiniDots total={7} filled={route.completed} tone={isTawaf ? 'emerald' : 'sky'} size="h-2.5 w-2.5" />
        <span className="text-[10px] text-slate-500">
          {done ? 'Hitungan penuh' : isTawaf ? 'Tiga langkah per putaran' : 'Satu leg per perjalanan'}
        </span>
      </div>
      <ProgressBar value={route.completed} max={7} tone={isTawaf ? 'emerald' : 'sky'} className="mt-2" />

      <RouteDuaCard ritual={ritual} route={route} />

      {needsWudu && (
        <div className="mt-3 rounded-xl border border-rose-400/25 bg-rose-500/[.08] p-3">
          <p className="flex items-center gap-2 text-[11px] font-medium text-rose-200">
            <Droplets className="h-3.5 w-3.5" />
            Tawaf tertahan: belum berwudu
          </p>
          <p className="mt-1 text-[10px] leading-relaxed text-rose-200/70">
            Purity adalah syarat sah tawaf pada sumber ini (RD-02). Ambil wudu lalu lanjutkan.
          </p>
          <button
            type="button"
            onClick={() => dispatch({ type: 'TAKE_WUDU' })}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-rose-500 px-2.5 py-1.5 text-[10px] font-semibold text-rose-950 transition hover:bg-rose-400"
          >
            <Droplets className="h-3 w-3" />
            Ambil wudu
          </button>
        </div>
      )}

      {done ? (
        <div className="mt-3 rounded-2xl border border-emerald-400/25 bg-emerald-500/[.08] p-3">
          <p className="flex items-center gap-2 text-xs font-semibold text-emerald-200">
            <CheckCircle2 className="h-4 w-4" />
            {isTawaf ? 'Tujuh putaran tervalidasi' : 'Tujuh leg selesai di Marwah'}
          </p>
          <p className="mt-1 text-[10px] leading-relaxed text-emerald-200/70">
            Ritual sudah tercatat. {isTawaf ? 'Putaran ke-8 tidak mungkin.' : 'Hitungan leg tidak bisa dilanjutkan.'}
          </p>
        </div>
      ) : isTawaf ? (
        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[10px] text-slate-500">
              Progres putaran berjalan: <span className={t.text}>{Math.round((route.t || 0) * 100)}%</span>
            </span>
            <span className="text-[9px] text-slate-600">ambang commit 99%</span>
          </div>
          <div className="grid gap-2">
            <button
              type="button"
              disabled={!block.ok}
              onClick={() => dispatch({ type: 'ROUTE_STEP', ritualId: ritual.id, action: 'forward' })}
              className={cx(
                'inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-40',
                t.button,
              )}
            >
              <Compass className="h-3.5 w-3.5" />
              Langkah searah
            </button>
            <button
              type="button"
              disabled={!block.ok}
              onClick={() => dispatch({ type: 'ROUTE_STEP', ritualId: ritual.id, action: 'reverse' })}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-400/20 bg-amber-500/[.06] px-3 py-2.5 text-[11px] font-medium text-amber-200 transition hover:border-amber-400/35 hover:bg-amber-500/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Balik arah
            </button>
            <button
              type="button"
              disabled={!block.ok}
              onClick={() => dispatch({ type: 'ROUTE_STEP', ritualId: ritual.id, action: 'shortcut' })}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-400/20 bg-rose-500/[.06] px-3 py-2.5 text-[11px] font-medium text-rose-200 transition hover:border-rose-400/35 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              Potong tengah
            </button>
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
            Arah berlawanan dan potongan lewat tengah tidak menambah hitungan. Putaran dihitung saat progres
            melewati ambang commit 99%; hitungan lama tetap sah.
          </p>
        </div>
      ) : (
        <div className="mt-3">
          {!route.started ? (
            <div className="grid gap-2">
              <button
                type="button"
                disabled={!block.ok}
                onClick={() => dispatch({ type: 'ROUTE_STEP', ritualId: ritual.id, action: 'startSafa' })}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-sky-500 px-3 py-2.5 text-[11px] font-semibold text-sky-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Footprints className="h-3.5 w-3.5" />
                Mulai dari Safa
              </button>
              <button
                type="button"
                disabled={!block.ok}
                onClick={() => dispatch({ type: 'ROUTE_STEP', ritualId: ritual.id, action: 'startMarwah' })}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-400/20 bg-amber-500/[.06] px-3 py-2.5 text-[11px] font-medium text-amber-200 transition hover:border-amber-400/35 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Mulai dari Marwah
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                disabled={!block.ok}
                onClick={() => dispatch({ type: 'ROUTE_STEP', ritualId: ritual.id, action: 'walk' })}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-sky-500 px-3 py-2.5 text-[11px] font-semibold text-sky-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Footprints className="h-3.5 w-3.5" />
                Berjalan ke {route.position === 0 ? 'Marwah' : 'Safa'}
              </button>
              <span className="text-center text-[10px] text-slate-500">
                {route.completed}/7 leg · arah {route.position === 0 ? 'Safa → Marwah' : 'Marwah → Safa'}
              </span>
            </div>
          )}
          <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
            Leg 1 wajib Safa → Marwah. Arah bergantian; leg ke-7 berakhir di Marwah, bukan Safa.
          </p>
        </div>
      )}
    </section>
  );
}

function RitualCard({ state, ritual, dispatch, onOpenRoute, onOpenJamarat }) {
  const complete = isComplete(state, ritual.id);
  const block = getRitualBlock(state, ritual);
  const t = tone(CLASSIFICATIONS[ritual.classification].tone);
  const isRoute = ritual.kind === 'tawaf' || ritual.kind === 'sai';
  const isJamarat = ritual.kind === 'jamarat';
  const progress = isRoute ? state.routes?.[ritual.id]?.completed || 0 : 0;
  const requiredPillars = ritual.pillars || ['aqabah'];
  const jamaratDone = requiredPillars.reduce(
    (sum, pillar) => sum + (state.jamarat?.[ritual.id]?.counts?.[pillar] || 0),
    0,
  );
  const jamaratTotal = requiredPillars.length * 7;

  let buttonLabel = 'Kerjakan';
  if (complete) buttonLabel = 'Selesai';
  else if (!block.ok) buttonLabel = 'Terkunci';
  else if (isRoute) buttonLabel = progress > 0 ? `Lanjutkan ${progress}/7` : 'Buka rute';
  else if (isJamarat) buttonLabel = `Buka lontar ${jamaratDone}/${jamaratTotal}`;

  const onClick = () => {
    if (!block.ok || complete) return;
    if (isRoute) onOpenRoute(ritual.id);
    else if (isJamarat) onOpenJamarat(ritual.id);
    else dispatch({ type: 'COMPLETE_RITUAL', ritualId: ritual.id });
  };

  return (
    <article
      className={cx(
        'group relative flex flex-col overflow-hidden rounded-2xl border p-3 transition',
        complete
          ? 'border-emerald-400/15 bg-emerald-500/[.035]'
          : block.ok
            ? 'border-white/[.08] bg-white/[.025] hover:border-white/[.16] hover:bg-white/[.04]'
            : 'border-white/[.05] bg-white/[.015] opacity-80',
      )}
    >
      <div className="flex items-start gap-2.5">
        <IconBubble Icon={ritual.Icon} tone={complete ? 'emerald' : CLASSIFICATIONS[ritual.classification].tone} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className={cx('text-[12px] font-semibold leading-snug', complete ? 'text-emerald-200/70' : 'text-slate-100')}>
              {ritual.name}
            </h3>
            <ClassBadge classification={ritual.classification} small />
          </div>
          <p className={cx('mt-1 text-[10px] leading-relaxed', complete ? 'text-emerald-200/45' : 'text-slate-500')}>
            {ritual.desc}
          </p>
        </div>
        <span className="mt-0.5 shrink-0">
          {complete ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          ) : block.ok ? (
            <ChevronRight className="h-4 w-4 text-slate-500 transition group-hover:text-white" />
          ) : (
            <LockKeyhole className="h-4 w-4 text-slate-600" />
          )}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[9px]">
        <span className="rounded-md border border-white/[.06] bg-black/20 px-1.5 py-0.5 text-slate-500">
          {ritual.citation}
        </span>
        {isRoute && (
          <span className={cx('rounded-md px-1.5 py-0.5', t.bg, t.text)}>
            {progress}/7 {ritual.kind === 'tawaf' ? 'putaran' : 'leg'}
          </span>
        )}
        {isJamarat && (
          <span className="rounded-md border border-amber-400/15 bg-amber-500/[.06] px-1.5 py-0.5 text-amber-200/80">
            {jamaratDone}/{jamaratTotal} kerikil
          </span>
        )}
        {!complete && !block.ok && <span className="text-slate-600">butuh prasyarat</span>}
      </div>

      {isRoute && (
        <ProgressBar
          value={progress}
          max={7}
          tone={ritual.kind === 'tawaf' ? 'emerald' : 'sky'}
          className="mt-2"
          slim
        />
      )}
      {isJamarat && (
        <ProgressBar value={jamaratDone} max={jamaratTotal} tone="amber" className="mt-2" slim />
      )}

      {!complete && !block.ok && (
        <p className="mt-2 line-clamp-2 text-[9px] leading-relaxed text-amber-300/70">{block.reason}</p>
      )}

      <div className="mt-auto pt-2.5">
        <button
          type="button"
          onClick={onClick}
          disabled={!block.ok || complete}
          className={cx(
            'inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold transition disabled:cursor-not-allowed',
            complete
              ? 'bg-emerald-500/10 text-emerald-300/60'
              : block.ok
                ? 'bg-white/[.06] text-white hover:bg-white/[.12]'
                : 'bg-white/[.025] text-slate-600',
          )}
          title={block.ok ? buttonLabel : block.reason}
        >
          {complete ? <Check className="h-3 w-3" /> : isRoute ? <Route className="h-3 w-3" /> : isJamarat ? <Milestone className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          {buttonLabel}
        </button>
      </div>
    </article>
  );
}

function UtilityBar({ state, dispatch, onRestore }) {
  const phase = getPhase(state.phaseIndex);
  const canCollect = ['muzdalifah', 'haji10', 'mina11', 'mina12'].includes(phase.id);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => dispatch({ type: 'TAKE_WUDU' })}
        disabled={state.purity.wudu || state.finished}
        className={cx(
          'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-medium transition disabled:cursor-not-allowed',
          state.purity.wudu
            ? 'border-emerald-400/20 bg-emerald-500/[.06] text-emerald-300/70'
            : 'border-amber-400/20 bg-amber-500/[.06] text-amber-200 hover:border-amber-400/35',
        )}
      >
        <Droplets className="h-3 w-3" />
        {state.purity.wudu ? 'Sudah berwudu' : 'Ambil wudu'}
      </button>
      {canCollect && (
        <button
          type="button"
          onClick={() => dispatch({ type: 'COLLECT_PEBBLES' })}
          disabled={state.pebbles >= 70 || state.finished}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/[.08] bg-white/[.03] px-2.5 py-1.5 text-[10px] font-medium text-slate-300 transition hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <CircleDot className="h-3 w-3" />
          Ambil 7 kerikil
        </button>
      )}
      {state.mode === 'latihan' && state.checkpoint && (
        <button
          type="button"
          onClick={onRestore}
          disabled={state.finished}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/[.08] bg-white/[.03] px-2.5 py-1.5 text-[10px] font-medium text-slate-300 transition hover:border-sky-400/25 hover:text-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="h-3 w-3" />
          Pulihkan checkpoint
        </button>
      )}
      {state.mode === 'simulasi' && (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-violet-400/15 bg-violet-500/[.06] px-2.5 py-1.5 text-[10px] text-violet-200/70">
          <LockKeyhole className="h-3 w-3" />
          Tanpa rollback
        </span>
      )}
    </div>
  );
}

function DebtLedger({ state, dispatch }) {
  const openDebts = state.debts.filter((debt) => !debt.resolved);
  const openViolations = state.ledger.filter((violation) => !violation.resolved);
  if (!openDebts.length && !openViolations.length) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-500/[.035] px-3 py-2">
        <BadgeCheck className="h-3.5 w-3.5 text-emerald-300" />
        <p className="text-[10px] text-emerald-200/70">
          Tidak ada dam atau kafarat terbuka. Kewajiban akan tercatat di sini.
        </p>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-amber-400/20 bg-amber-500/[.035] p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Scale className="h-3.5 w-3.5 text-amber-300" />
          <p className="text-[11px] font-semibold text-amber-100">Kewajiban terbuka</p>
        </div>
        <div className="flex gap-1.5">
          {openDebts.length > 0 && <ToneBadge tone="amber">{openDebts.length} dam</ToneBadge>}
          {openViolations.length > 0 && <ToneBadge tone="rose">{openViolations.length} kafarat</ToneBadge>}
        </div>
      </div>
      <div className="mt-2 space-y-1.5">
        {openDebts.map((debt) => (
          <div key={debt.id} className="flex items-start gap-2 rounded-lg border border-white/[.06] bg-black/20 px-2.5 py-2">
            <Scale className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium text-slate-300">Dam — {debt.cause}</p>
              <p className="mt-0.5 text-[9px] text-slate-600">{debt.citation}</p>
            </div>
            <button
              type="button"
              onClick={() => dispatch({ type: 'RESOLVE_DEBT', debtId: debt.id })}
              disabled={state.finished}
              className="shrink-0 rounded-md bg-amber-400 px-2 py-1 text-[9px] font-semibold text-amber-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Tunaikan
            </button>
          </div>
        ))}
        {openViolations.map((violation) => (
          <div key={violation.id} className="flex items-start gap-2 rounded-lg border border-white/[.06] bg-black/20 px-2.5 py-2">
            <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-300" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium text-slate-300">
                {violation.type === 'crossing' ? 'Melewati miqat tanpa ihram' : violation.label}
              </p>
              <p className="mt-0.5 text-[9px] text-slate-600">
                {violation.citation} {violation.episode ? `· episode ${violation.episode}` : ''}
              </p>
            </div>
            <button
              type="button"
              onClick={() => dispatch({ type: 'OPEN_REMEDY', violationId: violation.id })}
              disabled={state.finished}
              className="shrink-0 rounded-md bg-rose-500 px-2 py-1 text-[9px] font-semibold text-rose-950 transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Pilih kafarat
            </button>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[9px] leading-relaxed text-slate-500">
        Dam dan kafarat tidak dibayar dengan koin. Setiap catatan diselesaikan dengan memilih satu opsi
        yang disediakan sumber aturan.
      </p>
    </div>
  );
}

function PromptCard({ state, dispatch, def }) {
  if (!def) return null;
  const siblings = PROMPTS.filter((prompt) => prompt.phase === def.phase);
  const promptIndex = siblings.findIndex((prompt) => prompt.id === def.id) + 1;
  const view = resolvePrompt(def, state.gender);
  const ps = state.prompts?.[def.id];
  const Icon = def.Icon || CircleHelp;
  if (!ps) {
    return (
      <div className="rounded-2xl border border-white/[.07] bg-white/[.02] p-3">
        <p className="text-[11px] text-slate-500">Kuis zona disiapkan saat fase dimasuki.</p>
      </div>
    );
  }
  const last = ps.attempts?.[ps.attempts.length - 1];
  const firstWrong = ps.firstCorrect === false;
  const resolved = ps.resolved;
  const correct = resolved && Boolean(last?.correct);
  const showHint = !resolved && last && !last.correct && state.mode === 'latihan';
  const t = resolved
    ? tone(correct ? 'emerald' : state.mode === 'simulasi' ? 'rose' : 'amber')
    : tone('violet');

  return (
    <div className={cx('overflow-hidden rounded-2xl border', t.border, t.bg)}>
      <div className="flex items-start gap-2.5 p-3">
        <IconBubble Icon={Icon} tone={resolved ? (correct ? 'emerald' : 'rose') : 'violet'} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[9px] font-semibold uppercase tracking-[.16em] text-slate-500">Kuis zona</span>
            <ToneBadge tone={resolved ? (correct ? 'emerald' : 'rose') : 'violet'} className="py-0.5">
              {resolved ? (correct ? 'Tepat' : 'Terkunci') : 'Belum dijawab'}
            </ToneBadge>
            {ps.attempts.length > 0 && (
              <span className="text-[9px] text-slate-500">Percobaan {ps.attempts.length}</span>
            )}
          </div>
          <h3 className="mt-1.5 text-[12px] font-semibold leading-snug text-white">{view.question}</h3>
          <p className="mt-1 text-[9px] text-slate-500">
            {state.mode === 'simulasi'
              ? 'Percobaan pertama menentukan skor. Tidak ada percobaan ulang.'
              : 'Boleh mencoba lagi. Skor percobaan pertama tetap disimpan terpisah.'}
          </p>
        </div>
        <span className="shrink-0 rounded-md border border-white/[.06] bg-black/20 px-1.5 py-0.5 text-[9px] text-slate-500">
          Kuis {promptIndex}/{siblings.length}
        </span>
      </div>

      <div className="space-y-1.5 px-3 pb-3">
        {view.options.map((option, index) => {
          const selected = last?.option === index;
          const isCorrectOption = index === view.correct;
          let styles =
            'border-white/[.07] bg-white/[.025] text-slate-300 hover:border-white/20 hover:bg-white/[.05]';
          if (resolved) {
            if (isCorrectOption) styles = 'border-emerald-400/30 bg-emerald-500/[.09] text-emerald-100';
            else if (selected) styles = 'border-rose-400/25 bg-rose-500/[.07] text-rose-100';
            else styles = 'border-white/[.04] bg-white/[.01] text-slate-500';
          } else if (selected && !last?.correct) {
            styles = 'border-rose-400/30 bg-rose-500/[.08] text-rose-100';
          }
          return (
            <button
              key={option}
              type="button"
              disabled={resolved || state.finished}
              onClick={() => dispatch({ type: 'ANSWER_PROMPT', promptId: def.id, optionIndex: index })}
              className={cx(
                'flex w-full items-start gap-2 rounded-xl border px-2.5 py-2 text-left text-[11px] leading-snug transition disabled:cursor-not-allowed',
                styles,
              )}
            >
              <span
                className={cx(
                  'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[8px] font-semibold',
                  resolved && isCorrectOption
                    ? 'border-emerald-300/40 bg-emerald-400 text-emerald-950'
                    : 'border-white/15 text-slate-500',
                )}
              >
                {resolved && isCorrectOption ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : String.fromCharCode(65 + index)}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {showHint && (
        <div className="mx-3 mb-3 rounded-xl border border-amber-400/20 bg-amber-500/[.06] px-2.5 py-2">
          <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-amber-200/80">
            <CircleHelp className="mt-0.5 h-3 w-3 shrink-0" />
            Hint: {view.hint}
          </p>
        </div>
      )}

      {resolved && (
        <div className={cx('mx-3 mb-3 rounded-xl border px-2.5 py-2', t.border, 'bg-black/15')}>
          <p className={cx('text-[10px] leading-relaxed', t.soft)}>
            <span className="font-semibold">{correct ? 'Benar. ' : 'Jawaban benar: '}</span>
            {!correct && `${view.options[view.correct]}. `}
            {view.explanation}
          </p>
          <p className="mt-1 text-[9px] text-slate-600">{view.citation}</p>
          {firstWrong && (
            <p className="mt-1 text-[9px] text-amber-300/70">
              Skor percobaan pertama: belum tepat. Percobaan ulang tidak mengubah skor itu.
            </p>
          )}
        </div>
      )}
      {!resolved && firstWrong && state.mode === 'latihan' && (
        <p className="px-3 pb-3 text-[9px] text-slate-500">
          Percobaan pertama sudah tercatat untuk laporan. Coba lagi untuk memahami alasan.
        </p>
      )}
    </div>
  );
}

function ViolationLab({ state, dispatch }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(null);
  if (!state.ihram.active || state.finished) return null;

  const allowed = RESTRICTIONS.filter((r) => r.appliesTo === 'all' || r.appliesTo === state.gender);
  const pendingRestriction = allowed.find((r) => r.id === pending);
  const isPractice = state.mode === 'latihan';

  return (
    <div className="overflow-hidden rounded-2xl border border-rose-400/15 bg-rose-500/[.035]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-2.5 p-3 text-left"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-400/20 bg-rose-500/10 text-rose-300">
          <ShieldAlert className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold text-rose-100">Lab aturan ihram</p>
          <p className="text-[9px] text-rose-200/50">
            Episode {state.ihram.active} · {isPractice ? 'bisa dipulihkan lewat checkpoint' : 'konsekuensi permanen di Simulasi'}
          </p>
        </div>
        <ChevronDown className={cx('h-3.5 w-3.5 text-rose-300/50 transition', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="border-t border-rose-400/10 p-3">
          <p className="text-[10px] leading-relaxed text-slate-400">
            Pilih satu tindakan untuk melihat bagaimana ledger mencatatnya. Setiap pelanggaran membuat
            satu catatan kafarat; tidak ada koin atau mata uang.
            {!isPractice && ' Di Simulasi, catatan ini tidak bisa dihapus.'}
          </p>
          <div className="mt-2 grid gap-1.5">
            {allowed.map((restriction) => (
              <button
                key={restriction.id}
                type="button"
                onClick={() => setPending(restriction.id)}
                className="flex items-center gap-2 rounded-lg border border-white/[.07] bg-white/[.025] px-2.5 py-2 text-left transition hover:border-rose-400/25 hover:bg-rose-500/[.05]"
              >
                <restriction.Icon className="h-3.5 w-3.5 shrink-0 text-rose-300/80" />
                <span className="min-w-0">
                  <span className="block truncate text-[10px] font-medium text-slate-300">
                    Coba: {restriction.label}
                  </span>
                  <span className="block truncate text-[9px] text-slate-600">{restriction.citation}</span>
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => dispatch({ type: 'BREAK_WUDU' })}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-amber-400/20 bg-amber-500/[.06] px-2.5 py-1.5 text-[10px] text-amber-200/80 transition hover:border-amber-400/35"
          >
            <Droplets className="h-3 w-3" />
            Batalkan wudu (uji tawaf)
          </button>

          {pendingRestriction && (
            <div className="mt-2 rounded-xl border border-rose-400/25 bg-rose-500/[.08] p-2.5">
              <p className="text-[10px] leading-relaxed text-rose-100">
                Catat pelanggaran <span className="font-semibold">{pendingRestriction.label}</span> pada
                ihram episode {state.ihram.active}?
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'TRIGGER_VIOLATION', restrictionId: pendingRestriction.id });
                    setPending(null);
                    setOpen(false);
                  }}
                  className="rounded-lg bg-rose-500 px-2.5 py-1.5 text-[10px] font-semibold text-rose-950 transition hover:bg-rose-400"
                >
                  Ya, catat
                </button>
                <button
                  type="button"
                  onClick={() => setPending(null)}
                  className="rounded-lg border border-white/10 px-2.5 py-1.5 text-[10px] text-slate-400 transition hover:text-white"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RouteDuaCard({ ritual, route }) {
  const isTawaf = ritual.kind === 'tawaf';
  const dua = getRouteDua(ritual.kind, route.completed, route.completed >= 7);
  if (!dua) return null;
  const label = `${isTawaf ? 'Putaran' : 'Leg'} ${dua.index + 1} dari 7`;

  return (
    <div
      aria-live="polite"
      className="relative mt-3 overflow-hidden rounded-2xl border border-amber-400/15 bg-gradient-to-br from-amber-500/[.06] via-[#0a1410] to-[#0a1410] p-3.5"
    >
      <div className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-amber-400/10 blur-2xl" />
      <div className="relative flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <p className="text-[9px] font-semibold uppercase tracking-[.16em] text-amber-300/70">
            Doa {isTawaf ? 'putaran' : 'leg'} berjalan
          </p>
        </div>
        <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] ${isTawaf ? 'bg-emerald-500/10 text-emerald-300' : 'bg-sky-500/10 text-sky-300'}`}>
          {label}
        </span>
      </div>
      <p className="relative mt-1.5 text-[10px] font-medium text-amber-100/80">{dua.title}</p>
      <p
        dir="rtl"
        lang="ar"
        className="relative mt-2 text-right font-arabic text-[16px] leading-[1.95] text-amber-50/90"
      >
        {dua.arabic}
      </p>
      <p className="relative mt-2 text-[10px] italic leading-relaxed text-slate-400">{dua.latin}</p>
      <p className="relative mt-1 text-[10px] leading-relaxed text-slate-500">{dua.translation}</p>
      <p className="relative mt-2 text-[9px] text-slate-600">
        {dua.source} · bacaan pilihan, bukan syarat sah
      </p>
    </div>
  );
}

function DuaCard({ phase, override }) {
  const dua = override?.dua || DUAS[phase.dua];
  if (!dua) return null;
  const kicker = override
    ? `Doa ${override.ritual.kind === 'tawaf' ? 'putaran' : 'leg'} ${override.dua.index + 1}`
    : 'Dua fase';
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-400/15 bg-gradient-to-br from-amber-500/[.06] via-[#0a1410] to-[#0a1410] p-3.5">
      <div className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-amber-400/10 blur-2xl" />
      <div className="relative flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <p className="text-[9px] font-semibold uppercase tracking-[.16em] text-amber-300/70">{kicker}</p>
        </div>
        <span className="text-[9px] text-slate-600">{dua.title}</span>
      </div>
      <p
        dir="rtl"
        lang="ar"
        className="relative mt-2 text-right font-arabic text-[19px] leading-[2] text-amber-50/90"
      >
        {dua.arabic}
      </p>
      <p className="relative mt-2 text-[10px] italic leading-relaxed text-slate-400">{dua.latin}</p>
      <p className="relative mt-1 text-[10px] leading-relaxed text-slate-500">{dua.translation}</p>
      <p className="relative mt-2 text-[9px] text-slate-600">{dua.source}</p>
    </div>
  );
}

function ActionsPanel({ state, dispatch, ui, setUi, onRestore }) {
  const phase = getPhase(state.phaseIndex);
  const rituals = RITUALS.filter((r) => r.phase === phase.id);
  const done = rituals.filter((r) => isComplete(state, r.id)).length;
  const routeDua = getPhaseRouteDua(state, phase);

  return (
    <section className="rounded-3xl border border-white/[.07] bg-[#0a1410]/80 p-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <ListChecks className="h-3.5 w-3.5 text-emerald-300" />
            <h2 className="text-sm font-semibold text-white">Tindakan fase ini</h2>
            <span className="rounded-md border border-white/[.06] bg-white/[.02] px-1.5 py-0.5 text-[9px] text-slate-500">
              {done}/{rituals.length}
            </span>
          </div>
          <p className="mt-1 text-[10px] text-slate-500">
            Urutan dijaga oleh prasyarat. Klasifikasi menentukan konsekuensi audit.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {Object.entries(CLASSIFICATIONS).map(([key, value]) => (
            <span
              key={key}
              className={cx(
                'rounded-md border px-1.5 py-0.5 text-[9px]',
                tone(value.tone).bg,
                tone(value.tone).border,
                tone(value.tone).text,
              )}
            >
              {value.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 grid gap-2.5">
        {rituals.map((ritual) => (
          <RitualCard
            key={ritual.id}
            state={state}
            ritual={ritual}
            dispatch={dispatch}
            onOpenRoute={(id) => setUi((u) => ({ ...u, activeRoute: id }))}
            onOpenJamarat={(id) => setUi((u) => ({ ...u, jamaratOpen: id }))}
          />
        ))}
      </div>

      <div className="mt-3">
        <UtilityBar state={state} dispatch={dispatch} onRestore={onRestore} />
      </div>

      <div className="mt-3 grid gap-3">
        <DebtLedger state={state} dispatch={dispatch} />
        {PROMPTS.filter((prompt) => prompt.phase === phase.id).map((prompt) => (
          <PromptCard key={prompt.id} state={state} dispatch={dispatch} def={prompt} />
        ))}
        <ViolationLab state={state} dispatch={dispatch} />
        <DuaCard phase={phase} override={routeDua} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  SIDE PANEL                                                         */
/* ------------------------------------------------------------------ */

function SidePanel({ state, ui, setUi, dispatch, onRestore }) {
  const tabs = [
    { id: 'log', label: 'Jurnal', Icon: Activity },
    { id: 'guide', label: 'Panduan', Icon: BookOpen },
    { id: 'history', label: 'Riwayat', Icon: History },
  ];
  return (
    <aside id="side-panel" className="rounded-3xl border border-white/[.07] bg-[#0a1410]/80 p-3">
      <div className="flex items-center gap-1 rounded-xl border border-white/[.06] bg-black/20 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setUi((u) => ({ ...u, sideTab: tab.id }))}
            className={cx(
              'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] font-medium transition',
              ui.sideTab === tab.id
                ? 'bg-white/[.08] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-300',
            )}
          >
            <tab.Icon className="h-3 w-3" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-3">
        {ui.sideTab === 'log' && <LogPanel state={state} />}
        {ui.sideTab === 'guide' && <GuidePanel state={state} onRestore={onRestore} />}
        {ui.sideTab === 'history' && (
          <HistoryPanel state={state} ui={ui} setUi={setUi} onRestore={onRestore} />
        )}
      </div>
    </aside>
  );
}

function LogPanel({ state }) {
  const [filter, setFilter] = useState('all');
  const filters = [
    { id: 'all', label: 'Semua' },
    { id: 'important', label: 'Penting' },
    { id: 'ritual', label: 'Ritual' },
  ];
  const filtered = state.log.filter((entry) => {
    if (filter === 'important') return ['warn', 'danger', 'audit'].includes(entry.tone);
    if (filter === 'ritual') return ['success', 'ritual', 'info'].includes(entry.tone);
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <SectionLabel icon={Activity}>Jurnal aktivitas</SectionLabel>
        <button
          type="button"
          onClick={() => downloadJson({ seed: state.seed, mode: state.mode, log: state.log }, `${state.seed}-log.json`)}
          className="mb-3 inline-flex items-center gap-1 rounded-md border border-white/[.07] px-1.5 py-1 text-[9px] text-slate-500 transition hover:text-slate-300"
          title="Unduh log JSON"
        >
          <Download className="h-2.5 w-2.5" />
        </button>
      </div>
      <div className="mb-2 flex gap-1">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={cx(
              'rounded-md px-2 py-1 text-[9px] transition',
              filter === item.id ? 'bg-white/[.08] text-white' : 'text-slate-500 hover:text-slate-300',
            )}
          >
            {item.label}
          </button>
        ))}
        <span className="ml-auto self-center font-mono text-[9px] text-slate-600">{state.log.length}</span>
      </div>

      <div className="max-h-[calc(100vh-18rem)] space-y-1.5 overflow-y-auto pr-0.5">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/[.07] p-4 text-center">
            <p className="text-[10px] text-slate-600">Belum ada aktivitas pada filter ini.</p>
          </div>
        )}
        {filtered.map((entry) => {
          const t = tone(entry.tone);
          const Icon = ICON_MAP[entry.icon] || Info;
          const isDanger = entry.tone === 'danger';
          return (
            <div
              key={entry.id}
              className={cx(
                'rounded-xl border-l-2 border-y border-r border-white/[.04] bg-white/[.015] px-2.5 py-2',
                isDanger ? 'border-l-rose-400' : entry.tone === 'warn' ? 'border-l-amber-400' : entry.tone === 'success' ? 'border-l-emerald-400' : 'border-l-sky-400',
              )}
            >
              <div className="flex items-start gap-2">
                <span className={cx('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md', t.bg, t.text)}>
                  <Icon className="h-2.5 w-2.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cx('text-[10px] font-semibold leading-snug', t.text)}>{entry.title}</p>
                  <p className="mt-0.5 text-[9px] leading-relaxed text-slate-500">{entry.detail}</p>
                  <div className="mt-1 flex items-center gap-1.5 text-[8px] text-slate-600">
                    <span>Turn {entry.turn}</span>
                    <span className="h-0.5 w-0.5 rounded-full bg-slate-700" />
                    <span className="truncate">{entry.moment}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GuidePanel({ state, onRestore }) {
  const rules = [
    {
      Icon: HeartHandshake,
      tone: 'emerald',
      title: 'Dua episode ihram',
      text: 'Tamattu memisahkan ihram umrah dan ihram haji dengan tahallul. Episode 2 tidak bisa dimulai sebelum episode 1 ditutup.',
      citation: 'INV-9',
    },
    {
      Icon: Droplets,
      tone: 'sky',
      title: 'Purity adalah syarat tawaf',
      text: 'Tawaf tanpa wudu tidak dihitung. Perbaiki wudu lalu ulangi; tidak ada jalur dam untuk menggantikannya.',
      citation: 'RD-02',
    },
    {
      Icon: Footprints,
      tone: 'sky',
      title: 'Sa’i = rukun, bukan lingkaran',
      text: 'Tujuh leg dari Safa, arah bergantian, leg ke-7 berakhir di Marwah. Memulai dari Marwah tidak dihitung.',
      citation: 'RD-05 · INV-14',
    },
    {
      Icon: Mountain,
      tone: 'amber',
      title: 'Wuquf tidak tergantikan',
      text: 'Jendela zawal 9 Dzulhijjah sampai fajar 10. Jika lewat tanpa wuquf, outcome terminal HajjTidakSah.',
      citation: 'INV-8',
    },
    {
      Icon: Tent,
      tone: 'amber',
      title: 'Mabit Mina = wajib',
      text: 'Meninggalkan mabit Mina menimbulkan satu dam tertunda. Haji tetap berlanjut; ini bukan rukun yang hilang.',
      citation: 'RD-01',
    },
    {
      Icon: Scale,
      tone: 'rose',
      title: 'Kafarat adalah pilihan, bukan koin',
      text: 'Setiap pelanggaran punya satu catatan kafarat: dam, puasa tiga hari, atau memberi makan enam orang miskin. Tidak ada mata uang generik.',
      citation: 'INV-20 · INV-21',
    },
  ];

  return (
    <div>
      <SectionLabel icon={BookOpen}>Panduan singkat</SectionLabel>
      <div className="space-y-2">
        <div className="rounded-xl border border-white/[.07] bg-white/[.02] p-3">
          <p className="text-[11px] font-semibold text-slate-200">Cara main</p>
          <ol className="mt-2 space-y-1.5 text-[10px] leading-relaxed text-slate-500">
            {[
              'Kerjakan ritual pada fase sekarang. Kartu terkunci menjelaskan prasyarat yang kurang.',
              'Buka simulator rute untuk tawaf/Sa’i dan papan lontar untuk jamarat.',
              'Jawab kuis zona. Di Simulasi, percobaan pertama langsung dikunci.',
              'Tekan Audit & lanjut di titik istirahat. Rukun hilang mengakhiri sesi; wajib hilang menjadi dam.',
              'Selesaikan Tawaf Wada lalu tutup sesi untuk laporan.',
            ].map((item, index) => (
              <li key={item} className="flex gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/[.06] font-mono text-[8px] text-slate-400">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid gap-1.5">
          {rules.map((rule) => (
            <div key={rule.title} className="rounded-xl border border-white/[.06] bg-white/[.015] p-2.5">
              <div className="flex items-start gap-2">
                <IconBubble Icon={rule.Icon} tone={rule.tone} size="sm" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[10px] font-semibold text-slate-200">{rule.title}</p>
                    <span className="rounded bg-white/[.05] px-1 py-0.5 font-mono text-[8px] text-slate-500">
                      {rule.citation}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[9px] leading-relaxed text-slate-500">{rule.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-white/[.06] bg-white/[.015] p-2.5">
          <p className="text-[10px] font-semibold text-slate-200">Mode</p>
          <div className="mt-1.5 grid gap-1.5">
            {Object.values(MODES).map((mode) => {
              const t = tone(mode.tone);
              return (
                <div key={mode.id} className={cx('rounded-lg border p-2', t.border, t.bg)}>
                  <p className={cx('text-[10px] font-semibold', t.text)}>{mode.label}</p>
                  <p className="mt-0.5 text-[9px] leading-relaxed text-slate-500">{mode.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-white/[.06] bg-white/[.015] p-2.5">
          <p className="text-[10px] font-semibold text-slate-200">Klasifikasi audit</p>
          <div className="mt-1.5 space-y-1">
            {Object.values(CLASSIFICATIONS).map((item) => (
              <div key={item.label} className="flex items-start gap-2">
                <ClassBadge classification={Object.keys(CLASSIFICATIONS).find((key) => CLASSIFICATIONS[key] === item)} small />
                <p className="text-[9px] leading-relaxed text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {state.mode === 'latihan' && state.checkpoint && (
          <div className="rounded-xl border border-sky-400/20 bg-sky-500/[.06] p-2.5">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold text-sky-200">
              <RotateCcw className="h-3 w-3" />
              Checkpoint fase
            </p>
            <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
              Tersimpan di awal fase <span className="text-slate-300">{state.checkpoint.label}</span>. Memulihkan
              checkpoint bukan undo bebas; log dan riwayat tetap disimpan.
            </p>
            <button
              type="button"
              onClick={onRestore}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-2.5 py-1.5 text-[9px] font-semibold text-sky-950 transition hover:bg-sky-400"
            >
              <RotateCcw className="h-2.5 w-2.5" />
              Pulihkan checkpoint
            </button>
          </div>
        )}

        <div className="rounded-xl border border-amber-400/15 bg-amber-500/[.04] p-2.5">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-200">
            <TriangleAlert className="h-3 w-3" />
            Batas prototipe
          </p>
          <p className="mt-1 text-[9px] leading-relaxed text-slate-500">
            Konten fiqh belum ditinjau ulama. Model memakai satu tabel aturan (Kemenag 2023) dan tidak
            mengklaim keabsahan ibadah nyata. Beberapa halaman sitasi adalah aproksimasi prototipe.
          </p>
        </div>
      </div>
    </div>
  );
}

function HistoryPanel({ state, ui, setUi, onRestore }) {
  const entries = [...state.history].reverse();
  const selected = state.history.find((entry) => entry.id === ui.historyCursor) || state.history[state.history.length - 1];

  if (!entries.length) {
    return (
      <div className="rounded-xl border border-dashed border-white/[.07] p-4 text-center">
        <History className="mx-auto h-5 w-5 text-slate-600" />
        <p className="mt-2 text-[10px] text-slate-600">Belum ada riwayat. Setiap tindakan menyimpan snapshot.</p>
      </div>
    );
  }

  const snapshot = selected?.snapshot;
  const snapPhase = snapshot ? getPhase(snapshot.phaseIndex ?? 0) : null;
  const snapDone = snapshot ? RITUALS.filter((r) => snapshot.rituals?.[r.id]?.status === 'complete').length : 0;
  const snapDebts = snapshot ? snapshot.debts?.filter((d) => !d.resolved).length || 0 : 0;
  const snapViolations = snapshot ? snapshot.ledger?.filter((v) => !v.resolved).length || 0 : 0;
  const snapLog = selected ? state.log.filter((entry) => entry.turn <= selected.turn).slice(0, 4) : [];

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <SectionLabel icon={History}>Riwayat & replay</SectionLabel>
        <span className="mb-3 rounded-md border border-white/[.06] px-1.5 py-0.5 font-mono text-[8px] text-slate-500">
          {state.history.length} snapshot
        </span>
      </div>

      {selected && snapshot && (
        <div className="mb-2 rounded-xl border border-sky-400/15 bg-sky-500/[.045] p-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold text-sky-200">
              <Eye className="h-3 w-3" />
              Pratinjau read-only
            </p>
            <span className="text-[8px] text-slate-500">turn {selected.turn}</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-300">{selected.label}</p>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <div className="rounded-lg bg-black/20 p-1.5">
              <p className="text-[8px] uppercase tracking-wider text-slate-600">Fase</p>
              <p className="text-[9px] font-medium text-slate-300">{snapPhase?.short}</p>
            </div>
            <div className="rounded-lg bg-black/20 p-1.5">
              <p className="text-[8px] uppercase tracking-wider text-slate-600">Ritual</p>
              <p className="text-[9px] font-medium text-slate-300">{snapDone}/{RITUALS.length}</p>
            </div>
            <div className="rounded-lg bg-black/20 p-1.5">
              <p className="text-[8px] uppercase tracking-wider text-slate-600">Dam terbuka</p>
              <p className="text-[9px] font-medium text-amber-200">{snapDebts}</p>
            </div>
            <div className="rounded-lg bg-black/20 p-1.5">
              <p className="text-[8px] uppercase tracking-wider text-slate-600">Kafarat terbuka</p>
              <p className="text-[9px] font-medium text-rose-200">{snapViolations}</p>
            </div>
          </div>
          {snapLog.length > 0 && (
            <div className="mt-2 space-y-1">
              {snapLog.map((entry) => (
                <p key={entry.id} className="truncate text-[8px] text-slate-500">
                  <span className="text-slate-600">t{entry.turn}</span> · {entry.title}
                </p>
              ))}
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setUi((u) => ({ ...u, historyCursor: null }))}
              className="rounded-lg border border-white/10 px-2 py-1 text-[9px] text-slate-400 transition hover:text-white"
            >
              Tutup pratinjau
            </button>
            {state.mode === 'latihan' && state.checkpoint && (
              <button
                type="button"
                onClick={onRestore}
                className="rounded-lg bg-sky-500 px-2 py-1 text-[9px] font-semibold text-sky-950 transition hover:bg-sky-400"
              >
                Pulihkan checkpoint fase
              </button>
            )}
          </div>
        </div>
      )}

      <div className="max-h-[calc(100vh-25rem)] space-y-1 overflow-y-auto pr-0.5">
        {entries.map((entry) => {
          const t = tone(entry.tone);
          const active = entry.id === selected?.id;
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => setUi((u) => ({ ...u, historyCursor: entry.id }))}
              className={cx(
                'flex w-full items-start gap-2 rounded-lg border px-2 py-1.5 text-left transition',
                active
                  ? 'border-sky-400/25 bg-sky-500/[.07]'
                  : 'border-transparent hover:border-white/[.07] hover:bg-white/[.02]',
              )}
            >
              <span className={cx('mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full', t.dot)} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[9px] font-medium text-slate-300">{entry.label}</span>
                <span className="block truncate text-[8px] text-slate-600">
                  turn {entry.turn} · {entry.at}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-[9px] leading-relaxed text-slate-600">
        Snapshot dibuat dengan deep clone JSON. Pratinjau tidak mengubah state. Hanya mode Latihan yang
        bisa memulihkan checkpoint fase.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MODALS                                                             */
/* ------------------------------------------------------------------ */

function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Lanjutkan',
  tone: toneName = 'amber',
  Icon = AlertTriangle,
  children,
}) {
  const t = tone(toneName);
  return (
    <Modal open={open} onClose={onClose} label={title}>
      <div className="p-5">
        <div className="flex items-start gap-3">
          <span className={cx('flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border', t.bg, t.border, t.text)}>
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-white">{title}</h2>
            <p className="mt-1 text-[12px] leading-relaxed text-slate-400">{description}</p>
          </div>
        </div>
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-5 flex flex-col-reverse gap-2">
          <GhostButton onClick={onClose}>Batal</GhostButton>
          <button
            type="button"
            onClick={onConfirm}
            className={cx('inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition', t.button)}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function RemedyModal({ state, dispatch }) {
  const violation = state.ledger.find((entry) => entry.id === state.pendingViolationId);
  if (!violation) return null;
  const open = Boolean(state.pendingViolationId);
  return (
    <Modal open={open} dismissible={false} label="Pilih kafarat">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-rose-400/25 bg-rose-500/10 text-rose-300">
            <ShieldAlert className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-white">Satu pelanggaran, satu kafarat</h2>
              <ToneBadge tone="rose">Ihram episode {violation.episode || '—'}</ToneBadge>
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-slate-400">
              {violation.label}. Pilih satu opsi yang disediakan sumber aturan. Tidak ada koin, token,
              atau mata uang generik untuk menghapus pelanggaran.
            </p>
            <p className="mt-1.5 text-[10px] text-slate-600">{violation.citation}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          {REMEDIES.map((remedy) => (
            <button
              key={remedy.id}
              type="button"
              onClick={() => dispatch({ type: 'CHOOSE_REMEDY', violationId: violation.id, remedyId: remedy.id })}
              className="group flex flex-col rounded-2xl border border-white/[.08] bg-white/[.025] p-3 text-left transition hover:border-emerald-400/30 hover:bg-emerald-500/[.06]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[.08] bg-white/[.03] text-emerald-300">
                <remedy.Icon className="h-4 w-4" />
              </span>
              <span className="mt-2 text-[12px] font-semibold text-white">{remedy.label}</span>
              <span className="mt-0.5 text-[10px] leading-relaxed text-slate-400">{remedy.detail}</span>
              <span className="mt-2 text-[9px] leading-relaxed text-slate-600">{remedy.note}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-amber-400/15 bg-amber-500/[.04] p-3">
          <p className="text-[10px] leading-relaxed text-amber-100/70">
            <span className="font-semibold text-amber-200">Catatan model:</span> pilihan dicatat sebagai
            satu catatan kafarat. Menundanya membuat kewajiban tetap terbuka dan outcome akhir menjadi
            <span className="text-amber-200"> Selesai dengan dam</span>.
          </p>
        </div>

        <div className="mt-4 flex justify-end">
          <GhostButton onClick={() => dispatch({ type: 'DEFER_REMEDY' })}>
            <Clock3 className="h-3.5 w-3.5" />
            Tunda dulu
          </GhostButton>
        </div>
      </div>
    </Modal>
  );
}

function JamaratModal({ state, ui, setUi, dispatch }) {
  const ritual = RITUAL_MAP[ui.jamaratOpen];
  if (!ritual || ritual.kind !== 'jamarat') return null;
  const required = ritual.pillars || ['aqabah'];
  const counts = state.jamarat?.[ritual.id]?.counts || {};
  const doneAll = required.every((pillar) => (counts[pillar] || 0) >= 7);
  const remaining = required.reduce((sum, pillar) => sum + Math.max(0, 7 - (counts[pillar] || 0)), 0);
  const open = Boolean(ui.jamaratOpen);

  return (
    <Modal open={open} onClose={() => setUi((u) => ({ ...u, jamaratOpen: null }))} wide label="Papan lontar jumrah">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-amber-400/25 bg-amber-500/10 text-amber-300">
              <Milestone className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-white">Papan lontar jumrah</h2>
              <p className="mt-1 text-[12px] text-slate-400">
                {ritual.name} · {ritual.citation}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ToneBadge tone="sky">
              <CircleDot className="h-3 w-3" />
              {state.pebbles} kerikil
            </ToneBadge>
            <button
              type="button"
              onClick={() => setUi((u) => ({ ...u, jamaratOpen: null }))}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[.08] text-slate-500 transition hover:text-white"
              aria-label="Tutup papan lontar"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          {Object.values(JAMARAT).map((pillar) => {
            const active = required.includes(pillar.id);
            const count = counts[pillar.id] || 0;
            const complete = count >= 7;
            return (
              <div
                key={pillar.id}
                className={cx(
                  'relative overflow-hidden rounded-2xl border p-3',
                  active
                    ? complete
                      ? 'border-emerald-400/25 bg-emerald-500/[.06]'
                      : 'border-amber-400/25 bg-amber-500/[.06]'
                    : 'border-white/[.05] bg-white/[.015] opacity-55',
                )}
              >
                <div className="flex items-center justify-between gap-1">
                  <p className={cx('text-[11px] font-semibold', active ? 'text-white' : 'text-slate-500')}>
                    {pillar.label}
                  </p>
                  <span className="font-mono text-[9px] text-slate-500">{count}/7</span>
                </div>
                <div className="mt-2 flex items-end justify-center gap-1.5 py-1">
                  {Array.from({ length: 7 }).map((_, index) => (
                    <span
                      key={index}
                      className={cx(
                        'w-1.5 rounded-full transition-all',
                        index < count ? 'h-8 bg-amber-400' : 'h-3 bg-white/10',
                      )}
                    />
                  ))}
                </div>
                <MiniDots total={7} filled={count} tone={complete ? 'emerald' : 'amber'} size="h-1.5 w-1.5" />
                <button
                  type="button"
                  aria-label={`Lontar ${pillar.label}`}
                  disabled={!active || complete || state.pebbles < 1 || state.finished}
                  onClick={() => dispatch({ type: 'STONE_JAMARAT', ritualId: ritual.id, pillarId: pillar.id })}
                  className={cx(
                    'mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-40',
                    complete
                      ? 'bg-emerald-500/10 text-emerald-300/60'
                      : 'bg-amber-400 text-amber-950 hover:bg-amber-300',
                  )}
                >
                  {complete ? <Check className="h-3 w-3" /> : <CircleDot className="h-3 w-3" />}
                  {complete ? 'Selesai' : active ? 'Lontar 1 kerikil' : 'Bukan hari ini'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <ToneBadge tone={doneAll ? 'emerald' : 'amber'}>
            {doneAll ? 'Semua jumrah selesai' : `${remaining} kerikil tersisa untuk ritual ini`}
          </ToneBadge>
          {state.pebbles < 1 && (
            <button
              type="button"
              onClick={() => dispatch({ type: 'COLLECT_PEBBLES' })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-sky-400/20 bg-sky-500/[.06] px-2.5 py-1.5 text-[10px] text-sky-200 transition hover:border-sky-400/35"
            >
              <CircleDot className="h-3 w-3" />
              Ambil 7 kerikil
            </button>
          )}
          <span className="text-[10px] text-slate-500">
            Satu jumrah = 7 kerikil. Sisa kerikil: {state.pebbles}.
          </span>
        </div>

        <div className="mt-3 rounded-xl border border-white/[.06] bg-white/[.02] p-3">
          <p className="text-[10px] leading-relaxed text-slate-500">
            <span className="font-semibold text-slate-300">Urutan model:</span> lontar Aqabah pada 10
            Dzulhijjah, lalu tiga jumrah pada 11 dan 12. Papan ini tidak memberi progres di luar hari
            ritual.
          </p>
        </div>

        {doneAll && (
          <div className="mt-3 rounded-xl border border-emerald-400/25 bg-emerald-500/[.08] p-3">
            <p className="flex items-center gap-2 text-[11px] font-semibold text-emerald-200">
              <CheckCircle2 className="h-4 w-4" />
              Ritual selesai dan tercatat.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}

function AuditModal({ mode, open, state, onClose, onConfirm }) {
  const audit = buildAudit(state);
  const allMissingRukn = RITUALS.filter((r) => r.classification === 'rukn' && !isComplete(state, r.id));
  const missing =
    mode === 'finish'
      ? [
          ...audit.missing,
          ...allMissingRukn.filter((ritual) => !audit.missing.some((item) => item.id === ritual.id)),
        ]
      : audit.missing;
  const missingRukn = [...new Set([...missing.filter((r) => r.classification === 'rukn'), ...(mode === 'finish' ? allMissingRukn : [])])];
  const missingWajib = missing.filter((r) => r.classification === 'wajib');
  const missingSunnah = missing.filter((r) => r.classification === 'sunnah');
  const next = PHASES[state.phaseIndex + 1];
  const terminal = missingRukn.length > 0;
  const t = tone(terminal ? 'rose' : missing.length ? 'amber' : 'emerald');
  const Icon = terminal ? ShieldAlert : missing.length ? AlertTriangle : CheckCircle2;

  return (
    <Modal open={open} onClose={onClose} wide label="Audit fase">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <span className={cx('flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border', t.bg, t.border, t.text)}>
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-white">
                {mode === 'finish' ? 'Audit akhir sesi' : 'Audit keluar fase'}
              </h2>
              <ToneBadge tone={tone(state.mode === 'simulasi' ? 'violet' : 'sky')}>
                {MODES[state.mode].label}
              </ToneBadge>
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-slate-400">
              {mode === 'finish'
                ? 'Audit terakhir dijalankan sebelum outcome disusun. Rukun yang hilang tidak bisa diganti dam.'
                : `Audit untuk ${audit.phase.label} dijalankan sebelum waktu bergerak ke ${next?.short || 'laporan'}.`}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          <div className="rounded-xl border border-rose-400/20 bg-rose-500/[.06] p-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-[.14em] text-rose-300/80">Rukun</p>
            <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
              {missingRukn.length ? `${missingRukn.length} tertinggal → HajjTidakSah` : 'Tidak ada yang tertinggal'}
            </p>
          </div>
          <div className="rounded-xl border border-amber-400/20 bg-amber-500/[.06] p-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-[.14em] text-amber-300/80">Wajib</p>
            <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
              {missingWajib.length ? `${missingWajib.length} dam tertunda` : 'Tidak ada yang tertinggal'}
            </p>
          </div>
          <div className="rounded-xl border border-sky-400/20 bg-sky-500/[.06] p-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-[.14em] text-sky-300/80">Sunnah</p>
            <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
              {missingSunnah.length ? `${missingSunnah.length} tanpa konsekuensi` : 'Tidak ada yang tertinggal'}
            </p>
          </div>
        </div>

        {missing.length ? (
          <div className="mt-3 rounded-2xl border border-white/[.07] bg-white/[.02] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-slate-500">
              Tercatat belum selesai
            </p>
            <div className="mt-2 space-y-1.5">
              {missing.map((ritual) => (
                <div key={ritual.id} className="flex items-start gap-2 rounded-lg bg-black/20 px-2 py-1.5">
                  <ClassBadge classification={ritual.classification} small />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium text-slate-300">{ritual.name}</p>
                    <p className="text-[9px] text-slate-600">{ritual.citation}</p>
                  </div>
                  <span className="text-[9px] text-slate-500">
                    {ritual.classification === 'rukn'
                      ? 'terminal'
                      : ritual.classification === 'wajib'
                        ? '+1 dam'
                        : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/[.06] p-3">
            <p className="flex items-center gap-2 text-[11px] font-semibold text-emerald-200">
              <CheckCircle2 className="h-4 w-4" />
              Semua tindakan fase ini selesai.
            </p>
            <p className="mt-1 text-[10px] text-slate-500">Tidak ada konsekuensi baru dari audit ini.</p>
          </div>
        )}

        {mode === 'finish' && !terminal && (
          <div className="mt-3 rounded-xl border border-amber-400/15 bg-amber-500/[.04] p-3">
            <p className="text-[10px] leading-relaxed text-slate-400">
              Outcome ditentukan setelah audit: <span className="text-emerald-300">Selesai</span> jika tidak ada
              kewajiban terbuka, atau <span className="text-amber-300">Selesai dengan dam</span> jika masih ada
              dam/kafarat.
            </p>
          </div>
        )}

        {terminal && (
          <RuleNote icon={ShieldAlert} tone="rose" className="mt-3">
            Model ini akan mengakhiri sesi dengan <span className="font-semibold">HajjTidakSah</span>. Di mode
            Latihan, Anda dapat memulihkan checkpoint fase untuk mencoba lagi. Di Simulasi, keputusan ini
            permanen.
          </RuleNote>
        )}

        <div className="mt-5 flex flex-col-reverse gap-2">
          <GhostButton onClick={onClose}>Kembali kerjakan</GhostButton>
          <button
            type="button"
            onClick={onConfirm}
            className={cx('inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition', t.button)}
          >
            {mode === 'finish' ? 'Tutup sesi & lihat laporan' : `Lanjut ke ${next?.short || 'laporan'}`}
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="mt-3 text-center text-[9px] text-slate-600">
          Audit dan perpindahan fase adalah satu unit. Jika audit tidak dapat ditulis, waktu tidak bergerak.
        </p>
      </div>
    </Modal>
  );
}

function GuideModal({ open, onClose, state, onRestore }) {
  return (
    <Modal open={open} onClose={onClose} wide label="Panduan sesi">
      <div className="flex items-center justify-between gap-3 border-b border-white/[.07] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-emerald-300" />
          <h2 className="text-sm font-semibold text-white">Panduan sesi</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[.08] text-slate-500 transition hover:text-white"
          aria-label="Tutup panduan"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="p-5">
        <GuidePanel state={state} onRestore={onRestore} />
      </div>
    </Modal>
  );
}

function MenuModal({ open, state, onClose, onGuide, onHistory, onReport, onRestore, onEndEarly, onExit }) {
  const items = [
    { Icon: BookOpen, label: 'Panduan & aturan', detail: 'Cara main, klasifikasi, sumber aturan', onClick: onGuide },
    { Icon: History, label: 'Riwayat & replay', detail: 'Pratinjau snapshot read-only', onClick: onHistory },
    ...(state.finished
      ? [{ Icon: Trophy, label: 'Lihat laporan', detail: 'Outcome, metrik, dan debrief', onClick: onReport }]
      : []),
    ...(state.mode === 'latihan' && state.checkpoint
      ? [
          {
            Icon: RotateCcw,
            label: 'Pulihkan checkpoint',
            detail: `Kembali ke awal ${state.checkpoint.label}`,
            onClick: onRestore,
          },
        ]
      : []),
    ...(!state.finished
      ? [
          {
            Icon: LogOut,
            label: 'Akhiri sesi lebih awal',
            detail: 'Laporan akan ditandai tidak diselesaikan',
            onClick: onEndEarly,
            danger: true,
          },
        ]
      : []),
    {
      Icon: Trash2,
      label: 'Keluar ke menu',
      detail: 'Hapus simpanan lokal dan mulai dari awal',
      onClick: onExit,
      danger: true,
    },
  ];

  return (
    <Modal open={open} onClose={onClose} label="Menu sesi">
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white">Menu sesi</h2>
            <p className="mt-0.5 text-[10px] text-slate-500">
              {state.seed} · {MODES[state.mode].label} · {GENDERS[state.gender].label}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[.08] text-slate-500 transition hover:text-white"
            aria-label="Tutup menu"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-4 space-y-1.5">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.onClick}
              className={cx(
                'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition',
                item.danger
                  ? 'border-rose-400/10 bg-rose-500/[.025] hover:border-rose-400/25 hover:bg-rose-500/[.06]'
                  : 'border-white/[.06] bg-white/[.02] hover:border-white/[.14] hover:bg-white/[.04]',
              )}
            >
              <span
                className={cx(
                  'flex h-8 w-8 items-center justify-center rounded-xl border',
                  item.danger
                    ? 'border-rose-400/20 bg-rose-500/10 text-rose-300'
                    : 'border-white/[.08] bg-white/[.03] text-slate-300',
                )}
              >
                <item.Icon className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className={cx('block text-[11px] font-medium', item.danger ? 'text-rose-200' : 'text-slate-200')}>
                  {item.label}
                </span>
                <span className="block text-[9px] text-slate-500">{item.detail}</span>
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  REPORT                                                             */
/* ------------------------------------------------------------------ */

function MetricRow({ label, numerator, denominator, tone: toneName = 'emerald', hint }) {
  const valid = denominator > 0;
  return (
    <div className="rounded-xl border border-white/[.06] bg-white/[.02] p-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] text-slate-400">{label}</span>
        <span className={cx('font-mono text-[11px] font-semibold', valid ? tone(toneName).text : 'text-slate-500')}>
          {formatRatio(numerator, denominator)}
        </span>
      </div>
      {valid ? (
        <ProgressBar value={numerator} max={denominator} tone={toneName} className="mt-1.5" slim />
      ) : (
        <p className="mt-1 text-[9px] text-slate-600">tidak berlaku · penyebut 0</p>
      )}
      {hint && <p className="mt-1 text-[9px] text-slate-600">{hint}</p>}
    </div>
  );
}

function ReportView({ state, report, onClose, onRestart, onExit, onRestore }) {
  const meta = outcomeMeta(report.outcome);
  const t = tone(meta.tone);
  const openDebts = report.debts.filter((d) => !d.resolved);
  const openViolations = report.violations.filter((v) => !v.resolved);
  const totalOpen = openDebts.length + openViolations.length;

  return (
    <div className="fixed inset-0 z-[95] overflow-y-auto bg-[#060c09]">
      <div className="sticky top-0 z-10 border-b border-white/[.07] bg-[#060c09]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[480px] items-center gap-3 px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/20">
            <KaabaMark className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[.16em] text-slate-500">Laporan sesi</p>
            <p className="truncate text-sm font-semibold text-white">
              {report.seed} · {MODES[report.mode]?.label} · {GENDERS[report.gender]?.label}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => downloadJson(report, `${report.seed}-report.json`)}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[.03] px-2.5 text-[10px] text-slate-300 transition hover:border-white/20 hover:text-white"
            >
              <Download className="h-3 w-3" />
              <span className="hidden sm:inline">Unduh JSON</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:text-white"
              aria-label="Tutup laporan"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[480px] px-4 py-5">
        <section className={cx('relative overflow-hidden rounded-3xl border p-5', t.border, t.bg)}>
          <div className={cx('pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full blur-3xl', t.bgStrong)} />
          <div className="relative flex flex-col gap-4">
            <span className={cx('flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border', t.bgStrong, t.border, t.text)}>
              <meta.Icon className="h-7 w-7" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className={cx('text-2xl font-semibold tracking-tight', t.text)}>{meta.label}</h1>
                <ToneBadge tone={MODES[report.mode]?.tone || 'sky'}>{MODES[report.mode]?.label}</ToneBadge>
                <ToneBadge tone="slate">{GENDERS[report.gender]?.label}</ToneBadge>
                {report.endedEarly && <ToneBadge tone="slate">dihentikan</ToneBadge>}
              </div>
              <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-slate-300">{meta.blurb}</p>
              <p className="mt-1.5 max-w-2xl text-[11px] leading-relaxed text-slate-500">{meta.long}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <ToneBadge tone="slate">
                  <BookMarked className="h-3 w-3" />
                  {report.source.short} · {report.source.edition}
                </ToneBadge>
                <ToneBadge tone="slate">
                  <Flag className="h-3 w-3" />
                  Fase akhir: {report.phase}
                </ToneBadge>
                <ToneBadge tone="slate">
                  <Clock3 className="h-3 w-3" />
                  {report.turn} turn
                </ToneBadge>
              </div>
            </div>
          </div>
        </section>

        {report.endedEarly && (
          <RuleNote icon={CircleSlash2} tone="slate" className="mt-3">
            Status <span className="font-semibold">tidak diselesaikan</span> bukan salah satu dari tiga outcome
            final. Sesi tidak dihitung sebagai Selesai. Laporan tetap memuat catatan yang sudah dibuat.
          </RuleNote>
        )}

        <div className="mt-4 space-y-4">
          <div className="space-y-4">
            <section className="rounded-2xl border border-white/[.07] bg-[#0a1410]/80 p-4">
              <SectionLabel icon={ListChecks}>Metrik dengan penyebut</SectionLabel>
              <div className="grid gap-2">
                <MetricRow label="Ritual selesai" numerator={report.rituals.completed} denominator={report.rituals.total} tone="emerald" />
                <MetricRow
                  label="Kuis tepat pada percobaan pertama"
                  numerator={report.firstAttempt.numerator}
                  denominator={report.firstAttempt.denominator}
                  tone="violet"
                  hint={`${report.promptSummary.answered}/${report.promptSummary.total} kuis dijawab. ${
                    report.mode === 'simulasi'
                      ? 'Skor dibekukan pada percobaan pertama.'
                      : 'Percobaan ulang disimpan terpisah.'
                  }`}
                />
                <MetricRow
                  label="Tindakan diterima"
                  numerator={report.actions.accepted}
                  denominator={report.actions.denominator}
                  tone="sky"
                  hint="Rasio ritual yang diterima terhadap total ritual yang diterima/ditolak."
                />
                <MetricRow
                  label="Kewajiban terbuka"
                  numerator={openDebts.length + openViolations.length}
                  denominator={report.debts.length + report.violations.length}
                  tone={totalOpen ? 'amber' : 'emerald'}
                  hint="Dam dan kafarat yang belum ditunaikan."
                />
              </div>

              <div className="mt-4">
                <p className="text-[9px] font-semibold uppercase tracking-[.16em] text-slate-500">Rute tervalidasi</p>
                <div className="mt-2 grid gap-2">
                  {report.routes.map((route) => (
                    <div key={route.id} className="rounded-xl border border-white/[.06] bg-white/[.02] p-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400">{route.label}</span>
                        <span className="font-mono text-[10px] text-slate-300">{formatRatio(route.numerator, route.denominator)}</span>
                      </div>
                      <div className="mt-1.5">
                        <MiniDots total={7} filled={route.numerator} tone={route.numerator >= 7 ? 'emerald' : 'slate'} size="h-1.5 w-1.5" />
                      </div>
                      {!route.started && <p className="mt-1 text-[9px] text-slate-600">tidak dimulai</p>}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[.07] bg-[#0a1410]/80 p-4">
              <SectionLabel icon={Activity}>
                Jejak belajar kuis · {report.promptSummary.answered}/{report.promptSummary.total} dijawab
              </SectionLabel>
              <div className="space-y-1.5">
                {report.prompts.length === 0 && <p className="text-[10px] text-slate-600">Belum ada kuis yang dicoba.</p>}
                {report.prompts.map((prompt) => {
                  const attempted = prompt.attemptCount > 0;
                  const correctFirst = prompt.firstCorrect === true;
                  const Icon = !attempted ? CircleHelp : correctFirst ? Check : X;
                  return (
                    <div key={prompt.id} className="rounded-xl border border-white/[.06] bg-white/[.02] p-2.5">
                      <div className="flex items-start gap-2">
                        <span
                          className={cx(
                            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md',
                            !attempted
                              ? 'bg-white/[.05] text-slate-500'
                              : correctFirst
                                ? 'bg-emerald-500/10 text-emerald-300'
                                : 'bg-rose-500/10 text-rose-300',
                          )}
                        >
                          <Icon className="h-3 w-3" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-medium text-slate-300">{prompt.title}</p>
                          <p className="mt-0.5 text-[9px] leading-relaxed text-slate-500">{prompt.question}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[8px] text-slate-600">
                            <span>{prompt.attemptCount} percobaan</span>
                            <span className="h-0.5 w-0.5 rounded-full bg-slate-700" />
                            <span>
                              {!attempted
                                ? 'belum dicoba'
                                : correctFirst
                                  ? 'percobaan pertama tepat'
                                  : 'percobaan pertama belum tepat'}
                            </span>
                          </div>
                          {attempted && !correctFirst && prompt.selectedAnswer && (
                            <p className="mt-1 text-[9px] text-rose-200/70">Jawaban pertama: {prompt.selectedAnswer}</p>
                          )}
                          <p className="mt-1 text-[9px] text-emerald-200/60">Kunci: {prompt.correctAnswer}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-white/[.07] bg-[#0a1410]/80 p-4">
              <SectionLabel icon={Route}>Rangkaian ritual</SectionLabel>
              <div className="grid gap-1.5">
                {report.rituals.rows.map((ritual) => (
                  <div
                    key={ritual.id}
                    className={cx(
                      'flex items-center gap-2 rounded-lg border px-2 py-1.5',
                      ritual.completed
                        ? 'border-emerald-400/10 bg-emerald-500/[.03]'
                        : 'border-white/[.04] bg-white/[.01]',
                    )}
                  >
                    <span
                      className={cx(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded-full',
                        ritual.completed ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/[.04] text-slate-600',
                      )}
                    >
                      {ritual.completed ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                    </span>
                    <span className={cx('min-w-0 flex-1 truncate text-[9px]', ritual.completed ? 'text-slate-300' : 'text-slate-500')}>
                      {ritual.name}
                    </span>
                    <ClassBadge classification={ritual.classification} small />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-4">
            <section className="rounded-2xl border border-white/[.07] bg-[#0a1410]/80 p-4">
              <SectionLabel icon={Scale}>Kewajiban & kafarat</SectionLabel>
              {report.debts.length === 0 && report.violations.length === 0 && (
                <div className="rounded-xl border border-emerald-400/15 bg-emerald-500/[.04] p-3">
                  <p className="flex items-center gap-2 text-[10px] font-semibold text-emerald-200">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Tidak ada kewajiban terbuka.
                  </p>
                </div>
              )}
              <div className="space-y-1.5">
                {report.debts.map((debt) => (
                  <div key={debt.id} className="rounded-xl border border-white/[.06] bg-white/[.02] p-2.5">
                    <div className="flex items-start gap-2">
                      <span
                        className={cx(
                          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md',
                          debt.resolved ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300',
                        )}
                      >
                        {debt.resolved ? <Check className="h-3 w-3" /> : <Scale className="h-3 w-3" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-medium text-slate-300">Dam — {debt.cause}</p>
                        <p className="mt-0.5 text-[9px] text-slate-600">{debt.citation}</p>
                        <span className={cx('mt-1 inline-block rounded px-1 py-0.5 text-[8px]', debt.resolved ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300')}>
                          {debt.resolved ? 'ditunaikan' : 'terbuka'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {report.violations.map((violation) => (
                  <div key={violation.id} className="rounded-xl border border-white/[.06] bg-white/[.02] p-2.5">
                    <div className="flex items-start gap-2">
                      <span
                        className={cx(
                          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md',
                          violation.resolved ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300',
                        )}
                      >
                        {violation.resolved ? <Check className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-medium text-slate-300">
                          {violation.type === 'crossing' ? 'Melewati miqat tanpa ihram' : violation.label}
                        </p>
                        <p className="mt-0.5 text-[9px] text-slate-600">
                          {violation.citation} {violation.episode ? `· episode ${violation.episode}` : ''}
                        </p>
                        <span className={cx('mt-1 inline-block rounded px-1 py-0.5 text-[8px]', violation.resolved ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300')}>
                          {violation.resolved ? `kafarat: ${violation.remedy}` : 'kafarat belum dipilih'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-white/[.07] bg-[#0a1410]/80 p-4">
              <SectionLabel icon={BookMarked}>Sumber & batas</SectionLabel>
              <div className="space-y-1">
                <KeyValue label="Sumber aturan" value={report.source.label} tone="emerald" />
                <KeyValue label="Edisi" value={report.source.edition} />
                <KeyValue label="Penerbit" value={report.source.publisher} />
                <KeyValue label="ISBN" value={report.source.isbn} />
                <KeyValue label="Mode" value={MODES[report.mode]?.label} tone="sky" />
                <KeyValue label="Avatar" value={GENDERS[report.gender]?.label} />
                <KeyValue label="Seed" value={report.seed} />
              </div>
              <RuleNote icon={Info} tone="amber" className="mt-3">
                Laporan ini menilai kinerja terhadap satu tabel aturan. Ia tidak menyatakan keabsahan
                ibadah nyata dan bukan fatwa. Konten fiqh prototipe belum ditinjau ulama.
              </RuleNote>
            </section>

            <section className="rounded-2xl border border-white/[.07] bg-[#0a1410]/80 p-4">
              <SectionLabel icon={ShieldCheck}>Debrief</SectionLabel>
              <div className="space-y-2 text-[10px] leading-relaxed text-slate-400">
                <p>
                  <span className="font-semibold text-slate-200">Rukun:</span>{' '}
                  {report.rituals.rows.filter((r) => r.classification === 'rukn' && !r.completed).length === 0
                    ? 'semua rukun selesai.'
                    : `tertinggal ${report.rituals.rows.filter((r) => r.classification === 'rukn' && !r.completed).map((r) => r.name).join(', ')}.`}
                </p>
                <p>
                  <span className="font-semibold text-slate-200">Wajib:</span>{' '}
                  {openDebts.length === 0 ? 'tidak ada dam terbuka.' : `${openDebts.length} dam belum ditunaikan.`}
                </p>
                <p>
                  <span className="font-semibold text-slate-200">Kafarat:</span>{' '}
                  {openViolations.length === 0
                    ? 'semua pelanggaran punya pilihan kafarat.'
                    : `${openViolations.length} kafarat masih terbuka.`}
                </p>
                <p>
                  <span className="font-semibold text-slate-200">Langkah berikutnya:</span>{' '}
                  {report.endedEarly
                    ? 'mulai sesi baru atau pulihkan checkpoint fase untuk melanjutkan latihan.'
                    : report.outcome === 'HajjTidakSah'
                      ? 'pelajari rukun yang tertinggal, lalu ulangi sesi dari checkpoint fase pada mode Latihan.'
                      : report.outcome === 'SelesaiDenganDam'
                        ? 'tinjau daftar dam dan kafarat, lalu ulangi mode dengan urutan yang lebih ketat.'
                        : 'ulangi di mode Simulasi untuk menguji konsistensi tanpa rollback.'}
                </p>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2">
          {report.checkpointAvailable && (
            <GhostButton onClick={onRestore}>
              <RotateCcw className="h-3.5 w-3.5" />
              Pulihkan checkpoint fase
            </GhostButton>
          )}
          <GhostButton onClick={onExit}>
            <Trash2 className="h-3.5 w-3.5" />
            Sesi baru
          </GhostButton>
          <PrimaryButton onClick={onRestart}>
            <RefreshCcw className="h-3.5 w-3.5" />
            Ulangi mode ini
          </PrimaryButton>
        </div>

        <p className="mt-4 text-center text-[9px] leading-relaxed text-slate-600">
          Dibuat {new Date(report.generatedAt).toLocaleString('id-ID')} · data tetap di perangkat ·
          prototipe edukasi, bukan fatwa.
        </p>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  APP SHELL                                                          */
/* ------------------------------------------------------------------ */

const GLOBAL_CSS = `
  :root { color-scheme: dark; }
  html, body, #root { min-height: 100%; }
  body {
    margin: 0;
    background: #060c09;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  ::selection { background: rgba(52, 211, 153, .28); color: #fff; }
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, .16); border-radius: 999px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, .28); }
  .font-arabic { font-family: "Noto Naskh Arabic", Amiri, "Traditional Arabic", serif; }
  @keyframes riseIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .rise-in { animation: riseIn .35s cubic-bezier(.2,.8,.2,1) both; }
  @media print {
    body { background: white; }
    .no-print { display: none !important; }
  }
`;

const DEFAULT_UI = {
  reportOpen: false,
  guideOpen: false,
  menuOpen: false,
  advanceOpen: false,
  finishOpen: false,
  endEarlyOpen: false,
  exitOpen: false,
  restoreOpen: false,
  activeRoute: null,
  jamaratOpen: null,
  sideTab: 'log',
  historyCursor: null,
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [saved, setSaved] = useState(() => readSave());
  const [ui, setUi] = useState(DEFAULT_UI);
  const prevFinished = useRef(false);

  useEffect(() => {
    if (state.started) writeSave(state);
  }, [state]);

  useEffect(() => {
    if (state.finished && !prevFinished.current) {
      setUi((current) => ({ ...current, reportOpen: true, advanceOpen: false, finishOpen: false }));
    }
    if (!state.finished && prevFinished.current) {
      setUi((current) => ({ ...current, reportOpen: false }));
    }
    prevFinished.current = state.finished;
  }, [state.finished]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      setUi((current) => ({
        ...current,
        guideOpen: false,
        menuOpen: false,
        advanceOpen: false,
        finishOpen: false,
        endEarlyOpen: false,
        exitOpen: false,
        restoreOpen: false,
        jamaratOpen: null,
        activeRoute: null,
      }));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const start = (mode, gender) => {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {
      // abaikan
    }
    setSaved(null);
    setUi(DEFAULT_UI);
    prevFinished.current = false;
    dispatch({ type: 'START_SESSION', mode, gender });
  };

  const resume = () => {
    if (!saved) return;
    const next = deepClone(saved);
    setUi({ ...DEFAULT_UI, reportOpen: Boolean(next.finished), sideTab: 'log' });
    prevFinished.current = Boolean(next.finished);
    dispatch({ type: 'LOAD_SAVE', save: next });
  };

  const discard = () => {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {
      // abaikan
    }
    setSaved(null);
  };

  const openHistory = () => {
    setUi((current) => ({ ...current, sideTab: 'history', menuOpen: false }));
    if (typeof document !== 'undefined') {
      setTimeout(() => {
        document.getElementById('side-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 30);
    }
  };

  const openGuide = () => {
    setUi((current) => ({ ...current, guideOpen: true, menuOpen: false }));
  };

  const openReport = () => {
    if (state.finished) setUi((current) => ({ ...current, reportOpen: true, menuOpen: false }));
  };

  const confirmAdvance = () => {
    dispatch({ type: 'ADVANCE_PHASE' });
    setUi((current) => ({ ...current, advanceOpen: false, activeRoute: null }));
  };

  const confirmFinish = () => {
    dispatch({ type: 'FINISH_SESSION' });
    setUi((current) => ({ ...current, finishOpen: false, activeRoute: null }));
  };

  const restore = () => {
    dispatch({ type: 'RESTORE_CHECKPOINT' });
    setUi((current) => ({
      ...current,
      restoreOpen: false,
      advanceOpen: false,
      finishOpen: false,
      reportOpen: false,
      activeRoute: null,
      jamaratOpen: null,
    }));
  };

  const endEarly = () => {
    dispatch({ type: 'END_EARLY' });
    setUi((current) => ({ ...current, endEarlyOpen: false, menuOpen: false }));
  };

  const exitToMenu = () => {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {
      // abaikan
    }
    setSaved(null);
    setUi(DEFAULT_UI);
    prevFinished.current = false;
    dispatch({ type: 'EXIT_TO_MENU' });
  };

  const restart = () => {
    const mode = state.mode;
    const gender = state.gender;
    start(mode, gender);
  };

  const openRestoreConfirm = () => {
    setUi((current) => ({ ...current, restoreOpen: true, menuOpen: false, guideOpen: false }));
  };

  if (!state.started) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <StartScreen saved={saved} onStart={start} onResume={resume} onDiscard={discard} />
      </>
    );
  }

  const report = state.finished ? buildReport(state) : null;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className="min-h-screen bg-[#050a08] text-slate-100">
        <div className="mx-auto min-h-screen w-full max-w-[480px] bg-[#060c09] shadow-[0_0_90px_rgba(0,0,0,.65)] sm:border-x sm:border-white/[.06]">
          <TopBar
            state={state}
            onMenu={() => setUi((current) => ({ ...current, menuOpen: true }))}
            onGuide={openGuide}
            onHistory={openHistory}
            onReport={openReport}
          />
          <ResourceStrip state={state} dispatch={dispatch} onRestore={openRestoreConfirm} />

          <main className="px-3 py-3">
            <div className="mb-3">
              <PhaseRail state={state} compact />
            </div>
            <div className="space-y-3">
              <PhaseHero
                state={state}
                onAdvance={() => setUi((current) => ({ ...current, advanceOpen: true }))}
                onFinish={() => setUi((current) => ({ ...current, finishOpen: true }))}
                onRestore={openRestoreConfirm}
                onReport={openReport}
              />
              <ScenePanel state={state} ui={ui} setUi={setUi} dispatch={dispatch} />
              <ActionsPanel state={state} dispatch={dispatch} ui={ui} setUi={setUi} onRestore={openRestoreConfirm} />
              <SidePanel
                state={state}
                ui={ui}
                setUi={setUi}
                dispatch={dispatch}
                onRestore={openRestoreConfirm}
              />
            </div>
          </main>

          <footer className="px-4 pb-6 pt-1">
            <div className="flex flex-col gap-2 border-t border-white/[.05] pt-3 text-[9px] text-slate-600">
              <p>
                Manasik Tamattu · prototipe edukasi · sumber {report?.source.short || RULE_SOURCE.short} · bukan fatwa
              </p>
              <p className="font-mono">state v{SAVE_VERSION} · local-only · {state.turn} turn</p>
            </div>
          </footer>
        </div>
      </div>

      <RemedyModal state={state} dispatch={dispatch} />
      <JamaratModal state={state} ui={ui} setUi={setUi} dispatch={dispatch} />
      <AuditModal
        mode="advance"
        open={ui.advanceOpen}
        state={state}
        onClose={() => setUi((current) => ({ ...current, advanceOpen: false }))}
        onConfirm={confirmAdvance}
      />
      <AuditModal
        mode="finish"
        open={ui.finishOpen}
        state={state}
        onClose={() => setUi((current) => ({ ...current, finishOpen: false }))}
        onConfirm={confirmFinish}
      />
      <GuideModal
        open={ui.guideOpen}
        onClose={() => setUi((current) => ({ ...current, guideOpen: false }))}
        state={state}
        onRestore={openRestoreConfirm}
      />
      <MenuModal
        open={ui.menuOpen}
        state={state}
        onClose={() => setUi((current) => ({ ...current, menuOpen: false }))}
        onGuide={openGuide}
        onHistory={openHistory}
        onReport={openReport}
        onRestore={openRestoreConfirm}
        onEndEarly={() => setUi((current) => ({ ...current, menuOpen: false, endEarlyOpen: true }))}
        onExit={() => setUi((current) => ({ ...current, menuOpen: false, exitOpen: true }))}
      />
      <ConfirmModal
        open={ui.restoreOpen}
        onClose={() => setUi((current) => ({ ...current, restoreOpen: false }))}
        onConfirm={restore}
        title="Pulihkan checkpoint fase?"
        description={`State akan kembali ke awal fase “${state.checkpoint?.label || '—'}”. Log dan riwayat tetap disimpan, tetapi ritual dan pelanggaran setelah checkpoint akan hilang dari state aktif.`}
        confirmLabel="Pulihkan checkpoint"
        tone="sky"
        Icon={RotateCcw}
      />
      <ConfirmModal
        open={ui.endEarlyOpen}
        onClose={() => setUi((current) => ({ ...current, endEarlyOpen: false }))}
        onConfirm={endEarly}
        title="Akhiri sesi lebih awal?"
        description="Laporan akan ditandai “tidak diselesaikan”. Status ini bukan salah satu dari tiga outcome final dan tidak dihitung sebagai Selesai."
        confirmLabel="Akhiri sesi"
        tone="amber"
        Icon={LogOut}
      />
      <ConfirmModal
        open={ui.exitOpen}
        onClose={() => setUi((current) => ({ ...current, exitOpen: false }))}
        onConfirm={exitToMenu}
        title="Keluar ke menu?"
        description="Simpanan lokal sesi ini akan dihapus. Laporan yang sudah diunduh tetap ada di perangkat."
        confirmLabel="Hapus & keluar"
        tone="rose"
        Icon={Trash2}
      />

      {ui.reportOpen && report && (
        <ReportView
          state={state}
          report={report}
          onClose={() => setUi((current) => ({ ...current, reportOpen: false }))}
          onRestart={restart}
          onExit={exitToMenu}
          onRestore={restore}
        />
      )}
    </>
  );
}

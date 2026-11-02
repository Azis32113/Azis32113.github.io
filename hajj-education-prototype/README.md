# Manasik Tamattu — Prototype

Prototipe edukasi interaktif **Haji Tamattu** dalam satu file React (`src/App.jsx`). Semua state engine, data aturan, UI, dan styling aplikasi berada di file itu; sisanya hanya bootstrap Vite/Tailwind.

## Menjalankan

```bash
npm install
npm run dev
```

Vite membuka `http://localhost:5173/dev.html`. Halaman `index.html` adalah build produksi yang dipakai GitHub Pages, jadi perubahan sumber tidak muncul di sana sampai build ulang.

Build produksi:

```bash
npm run build
```

Perintah ini menjalankan Vite lalu menyalin hasil build ke folder ini:

- `dist/assets/app.js` dan `dist/assets/app.css` → `assets/`
- `dist/favicon.svg` → `favicon.svg`
- `dist/.nojekyll` → `.nojekyll`

Nama aset sengaja stabil (`app.js`/`app.css`) agar `index.html` yang di-commit tetap valid. `dist/` tetap diabaikan Git; yang di-commit adalah `index.html`, `assets/`, `favicon.svg`, dan `.nojekyll`.

Pratinjau hasil build (menyajikan `dist/`):

```bash
npm run preview
```

## Yang bisa dicoba

- **Dua mode**: `Latihan` (checkpoint per fase, kuis bisa diulang) dan `Simulasi` (percobaan pertama dikunci, tanpa rollback).
- **Sembilan fase**: miqat, umrah, 8 Dzulhijjah, Arafah, Muzdalifah, 10 Dzulhijjah, 11–12 Dzulhijjah, Tawaf Wada.
- **Dua puluh dua ritual** dengan klasifikasi `rukn` / `wajib` / `sunnah` dan audit keluar fase.
- **Simulator tawaf**: tujuh putaran, arah searah, penolakan arah berlawanan, larangan memotong Mataf, purity sebagai syarat.
- **Simulator Sa'i**: tujuh leg, mulai Safa, arah bergantian, leg ketujuh berakhir di Marwah.
- **Papan lontar**: 49 kerikil, Aqabah pada 10 Dzulhijjah, tiga jumrah pada 11–12.
- **Ihram dua episode**, ledger pelanggaran, pemilihan kafarat (dam / puasa / sadaqah), dam tertunda, dan penyelesaian kewajiban.
- **Kuis zona** dengan skor percobaan pertama, varian pertanyaan per gender, dan pembahasan bersitasi.
- **Laporan** dengan tiga outcome (`Selesai`, `Selesai dengan dam`, `Hajj tidak sah`) plus penanda `tidak diselesaikan`, metrik berpenyebut, rute tervalidasi, jejak kuis, dan debrief.
- **Riwayat/replay** read-only dari snapshot JSON, serta checkpoint fase khusus mode Latihan.
- **Penyimpanan lokal** berversi (`hajj-tamattu-prototype-v1`) dengan tombol lanjutkan sesi.

## Deploy ke GitHub Pages

Folder ini adalah bagian dari user site `Azis32113.github.io`, dan Pages men-deploy langsung dari branch `main` (root repository). Situs ini tersedia di:

```text
https://azis32113.github.io/hajj-education-prototype/
```

Karena GitHub Pages menyajikan file apa adanya (tanpa langkah build), hasil build ikut di-commit:

1. Ubah sumber di `src/`.
2. Jalankan `npm run build`.
3. Commit `index.html`, `assets/`, `favicon.svg`, dan `.nojekyll` beserta perubahan sumber.
4. Push ke `main`; GitHub Pages akan menyajikan versi baru.

Jangan meng-commit `dist/` (sudah diabaikan lewat `.gitignore`). `index.html` di root folder ini sengaja menunjuk ke `./assets/app.js` dan `./assets/app.css`, sehingga URL-nya benar baik di `https://<user>.github.io/<repo>/` maupun saat folder dijadikan root repository sendiri.

Workflow `.github/workflows/deploy.yml` hanya terpakai jika folder ini dipisah menjadi repository sendiri dan dijadikan root, lalu **Settings → Pages → Source** diubah ke **GitHub Actions**. Untuk struktur user site saat ini, deployment dari branch sudah cukup.

Catatan: `localStorage` terikat pada **origin**, bukan path. Di GitHub Pages, semua project site di bawah `<user>.github.io` berbagi origin yang sama. Aplikasi memakai key `hajj-tamattu-prototype-v1` agar tidak bertabrakan dengan aplikasi lain. Pindah ke custom domain akan memulai penyimpanan baru. Tidak ada backend; seluruh data tetap di browser pengunjung.

## Struktur

```
hajj-education-prototype/
├── .github/workflows/deploy.yml
├── .nojekyll              # hasil build: menonaktifkan pemrosesan Jekyll
├── assets/                # hasil build: app.js + app.css (di-commit)
├── dev.html               # entry Vite untuk pengembangan
├── index.html             # halaman produksi yang disajikan GitHub Pages
├── scripts/publish-pages.mjs
├── favicon.svg            # hasil build
├── package.json
├── public/favicon.svg
├── public/.nojekyll
├── src/
│   ├── App.jsx        # seluruh data, reducer, UI, dan styling aplikasi
│   ├── index.css      # direktif Tailwind
│   └── main.jsx       # bootstrap React
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Catatan model

- Sumber aturan sesi ini adalah **Kemenag 2023** (*Tuntunan Manasik Haji dan Umrah*, 1444 H/2023 M) sebagai satu tabel aturan, bukan pemilih madzhab.
- Konten fiqh prototipe **belum ditinjau ulama** dan bukan fatwa. Beberapa nomor halaman sitasi adalah aproksimasi untuk kebutuhan prototipe.
- Tidak ada backend, akun, telemetri, atau mata uang permainan. Data sesi hanya ada di `localStorage` perangkat.
- Tampilan memakai Tailwind CSS, ikon `lucide-react`, dan ilustrasi SVG skematik. Ilustrasi bukan peta atau penggambaran Masjidil Haram yang akurat.

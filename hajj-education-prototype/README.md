# Manasik Tamattu — Prototype

Prototipe edukasi interaktif **Haji Tamattu** dalam satu file React (`src/App.jsx`). Semua state engine, data aturan, UI, dan styling aplikasi berada di file itu; sisanya hanya bootstrap Vite/Tailwind.

## Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

Build produksi:

```bash
npm run build
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

Build ini statis, jadi bisa langsung dipasang di GitHub Pages. Vite memakai `base: './'`, sehingga aset tetap benar baik di `https://<user>.github.io/<repo>/` maupun di `https://<user>.github.io/`.

Workflow siap pakai ada di `.github/workflows/deploy.yml`.

1. Jadikan folder ini root repository (bukan folder induk `Hajj-Education`).
2. Push ke branch `main`:

   ```bash
   git init
   git add .
   git commit -m "Hajj Tamattu prototype"
   git branch -M main
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```

3. Di repository GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Setiap push ke `main` akan menjalankan build dan deploy otomatis.
5. Situs tersedia di `https://<user>.github.io/<repo>/`.

Jika repository memakai branch `master`, ubah `branches: [main]` di workflow menjadi `[master]`. Jika folder ini bukan root repo, tambahkan `working-directory` dan sesuaikan `path` artifact di workflow.

Catatan: `localStorage` terikat pada **origin**, bukan path. Di GitHub Pages, semua project site di bawah `<user>.github.io` berbagi origin yang sama. Aplikasi memakai key `hajj-tamattu-prototype-v1` agar tidak bertabrakan dengan aplikasi lain. Pindah ke custom domain akan memulai penyimpanan baru. Tidak ada backend; seluruh data tetap di browser pengunjung.

## Struktur

```
hajj-education-prototype/
├── .github/workflows/deploy.yml
├── index.html
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

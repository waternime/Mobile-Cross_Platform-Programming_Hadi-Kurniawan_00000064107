# Week 12 - Notifications

Project Expo React Native untuk praktikum Modul 12 versi sederhana. Aplikasi ini melanjutkan Week 11: mengambil foto, membaca lokasi, upload ke Supabase Storage, insert data ke tabel Supabase, lalu menampilkan local notification ketika data berhasil atau gagal masuk database. Isi notifikasi menyertakan `latitude` dan `longitude`.

## Run

```bash
npm install
npm start
```

Konfigurasi Supabase ada di `.env`, client Supabase ada di `lib/supabase.ts`, dan implementasi utama ada di `app/index.tsx`.

Firebase/FCM/EAS tidak dipakai pada versi ini supaya aplikasi bisa langsung dites di Expo Go.

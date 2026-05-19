# Week 13 - Redux State Management

Project Expo React Native untuk praktikum Modul 13. Aplikasi ini memodifikasi Week 12 dengan Redux Toolkit untuk menyimpan jumlah proses `success` dan `failed`. Counter tersebut dipakai pada proses upload Supabase dan local notification, lalu angka totalnya ikut muncul di isi notifikasi seperti contoh notifikasi Bluetooth pada modul.

## Run

```bash
npm install
npm start
```

File Redux ada di `store/store.ts`, `store/rootReducer.ts`, `store/counter.slice.ts`, dan `store/hooks.ts`. Komponen counter ada di `components/Counter.tsx`, sedangkan implementasi utama tetap di `app/index.tsx`.

Konfigurasi Supabase ada di `.env` dan client Supabase ada di `lib/supabase.ts`. Firebase/FCM/EAS tidak dipakai pada versi ini supaya aplikasi bisa langsung dites di Expo Go.

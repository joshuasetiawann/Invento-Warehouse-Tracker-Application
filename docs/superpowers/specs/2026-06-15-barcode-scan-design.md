# Design — Barcode scan untuk Barang Masuk & Keluar

**Tanggal:** 2026-06-15 · **Status:** Disetujui (Pendekatan A) · **Bahasa UI:** Indonesia

## Tujuan

Memungkinkan operator memilih produk dengan **scan barcode** (bukan hanya dropdown)
saat mencatat **Barang Masuk** dan **Barang Keluar**. Mendukung tiga input sekaligus:
**kamera** (HP/webcam), **scanner gun** (keyboard-wedge USB/Bluetooth), dan **ketik manual**.
Sesuai konsep scanner pada desain Google Stitch ("Invento").

## Keputusan (disetujui user)

1. **Metode scan:** kamera + scanner gun + ketik manual (ketiganya).
2. **Pencocokan:** tambah kolom **`barcode`** khusus di tabel `products` (selain `sku`).
   Scan mencocokkan `barcode` **atau** `sku` (supaya kode lama tetap kebaca).
3. **Penempatan (Pendekatan A):** scan menyatu di dialog Barang Masuk/Keluar yang ada,
   lewat satu komponen `BarcodeScanner` yang reusable (siap dipakai ulang nanti untuk
   halaman scan full-screen bila diperlukan — di luar scope sekarang).

## Arsitektur & unit

### 1. Data layer (migrasi `supabase/migrations/0002_products_barcode.sql`)
- `alter table public.products add column barcode text;`
- Unique parsial per user: `create unique index products_user_barcode_key on public.products (user_id, barcode) where barcode is not null;`
- RLS/grant tidak berubah (policy & grant level-tabel sudah mencakup kolom baru).
- `scripts/seed.mjs`: isi `barcode` (EAN-13 dummy) untuk 8 produk demo agar bisa langsung dicoba.
- `src/types/database.ts`: tambah `barcode: string | null` ke `Product`.
- `src/lib/actions/products.ts`: `parseProduct` baca `barcode` (opsional, dinormalisasi null).
- `getProducts`/`getProduct` sudah `select("*")` → otomatis ikut.

### 2. Komponen `BarcodeScanner` (client, `src/components/scan/barcode-scanner.tsx`)
- Props: `{ onDetected: (code: string) => void }`.
- **Kamera:** `@zxing/browser` `BrowserMultiFormatReader.decodeFromVideoDevice`. Viewport
  custom sesuai Stitch: bingkai sudut + garis scan ber-pulse (transform/opacity saja).
- **Manual / scanner gun:** input ter-fokus "Atau ketik kode box" — gun mengetik kode + Enter;
  Enter/tombol Cari memanggil `onDetected`.
- **Fallback:** kamera tak didukung / izin ditolak → sembunyikan video, sisakan input manual + catatan.
- Debounce hasil scan beruntun; matikan kamera saat dialog ditutup (cleanup di `useEffect`).

### 3. Helper murni (`src/lib/match.ts`)
- `matchProductByCode(products, code)`: cocokkan `barcode === code || sku === code`
  (trim, case-insensitive). Murni → mudah dites tanpa DOM.

### 4. Integrasi `MovementForm` + alur data
- `movements/page.tsx` `productOptions` & `MovementForm` props ditambah `barcode`.
- Pencocokan **di klien** dari daftar `products` yang sudah dimuat (instan, tanpa server call).
- Ketemu → `product_id` ter-set + panel konfirmasi (nama + stok kini). Tak ketemu → toast error
  "Kode `…` tidak ditemukan". Dropdown produk tetap ada sebagai alternatif.
- `createMovement` **tidak berubah** (tetap submit `product_id`).

### 5. Form & tabel Produk
- `product-form.tsx`: field "Barcode (opsional)".
- `products-client.tsx`: tampilkan barcode (mono) di baris produk bila ada.

## Error handling
- Kamera unsupported/izin ditolak → mode manual saja + catatan.
- Kode tak ditemukan → toast error, scanner tetap aktif.
- Scan ganda cepat → debounce.

## Dependensi
- `@zxing/browser` (+ `@zxing/library`). Kamera butuh HTTPS (Vercel) / localhost (dev).

## Verifikasi
- Unit test ringan untuk `matchProductByCode` (pure).
- `npm run build` lulus.
- Screenshot ulang alur Barang Masuk dengan panel scanner.

## Di luar scope (sekarang)
- Halaman scan full-screen khusus (Pendekatan B) — bisa nyusul memakai `BarcodeScanner` yang sama.
- Cetak label QR/box.

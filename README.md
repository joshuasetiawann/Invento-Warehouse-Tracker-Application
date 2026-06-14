# Invento — Warehouse Tracker

Aplikasi pelacak gudang (inventory management) berbasis **Next.js 16 (App Router)** + **Supabase**. Kelola produk, catat barang masuk & keluar, pantau stok menipis, dan lihat ringkasan di dashboard — dengan UI modern dan skeleton loader di setiap halaman.

## ✨ Fitur

- 🔐 **Autentikasi** — daftar / masuk dengan email & password (Supabase Auth)
- 📦 **Manajemen Produk** — CRUD produk lengkap (SKU, harga, satuan, stok minimum) + pencarian & filter kategori
- 🔄 **Stok Masuk & Keluar** — catat pergerakan stok; stok produk terupdate otomatis (lewat trigger DB) dengan riwayat transaksi
- 🏷️ **Kategori & Lokasi** — kelompokkan produk dan lacak posisi penyimpanannya
- 📊 **Dashboard** — total produk, total unit, nilai inventori, dan low-stock alert
- 💀 **Skeleton Loaders** — loading state di setiap rute (`loading.tsx`)
- 🛡️ **Aman** — Row Level Security (RLS) per pengguna di semua tabel

## 🚀 Setup

### 1. Buat project Supabase
Buat project gratis di [supabase.com/dashboard](https://supabase.com/dashboard).

### 2. Jalankan skema database
Buka **SQL Editor** di dashboard Supabase, lalu jalankan isi file:

```
supabase/migrations/0001_init.sql
```

Ini membuat tabel `profiles`, `categories`, `locations`, `products`, `stock_movements`, beserta RLS, trigger auto-update stok, dan auto-create profil saat signup.

### 3. Konfigurasi environment
Salin `.env.example` menjadi `.env.local` dan isi dari **Project Settings → API**:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 4. Jalankan
```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000), daftar akun, dan mulai kelola gudang Anda.

> 💡 Jika `.env.local` belum diisi, aplikasi akan menampilkan panduan setup alih-alih crash.

## 🧱 Tech Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Server Actions) |
| Bahasa | TypeScript |
| Styling | Tailwind CSS v4 |
| Ikon | lucide-react |
| Backend | Supabase (Postgres, Auth, RLS) |

## 📁 Struktur

```
src/
├─ app/
│  ├─ (auth)/            # login & register
│  └─ (app)/             # dashboard, products, movements, categories, locations, settings
│     └─ */loading.tsx   # skeleton loaders per rute
├─ components/
│  ├─ ui/                # design system (button, card, dialog, skeleton, toast, …)
│  ├─ layout/            # sidebar, topbar, app shell
│  └─ <feature>/         # komponen per fitur
├─ lib/
│  ├─ supabase/          # client / server / middleware
│  ├─ actions/           # Server Actions (CRUD)
│  └─ data.ts            # query functions
└─ types/database.ts     # tipe data
supabase/migrations/     # skema SQL
```

## 📜 Lisensi
MIT

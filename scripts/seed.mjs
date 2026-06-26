/**
 * Seed demo data into a Supabase project.
 *
 * Usage:
 *   SUPABASE_URL=... SERVICE_ROLE_KEY=... node scripts/seed.mjs
 *
 * Creates a demo user (demo@invento.app / demo123456) and a realistic set of
 * categories, locations, products, and stock movements owned by that user.
 * Stock quantities are built up purely through movements so the ledger and the
 * displayed quantity stay consistent (the DB trigger applies each movement).
 */
import { createClient } from "@supabase/supabase-js";

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SERVICE_ROLE_KEY;
if (!URL || !KEY) {
  console.error("Missing SUPABASE_URL or SERVICE_ROLE_KEY env.");
  process.exit(1);
}

const admin = createClient(URL, KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const EMAIL = "demo@invento.app";
const PASSWORD = "demo123456";

async function getOrCreateUser() {
  // Try to find existing demo user first.
  const { data: list } = await admin.auth.admin.listUsers();
  const existing = list?.users?.find((u) => u.email === EMAIL);
  if (existing) return existing.id;

  const { data, error } = await admin.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: "Joshua Setiawan" },
  });
  if (error) throw error;
  return data.user.id;
}

async function main() {
  const userId = await getOrCreateUser();
  console.log("Demo user:", EMAIL, userId);

  // Clean slate (idempotent re-seed).
  await admin.from("stock_movements").delete().eq("user_id", userId);
  await admin.from("products").delete().eq("user_id", userId);
  await admin.from("categories").delete().eq("user_id", userId);
  await admin.from("locations").delete().eq("user_id", userId);

  // Categories
  const categories = [
    { name: "Elektronik", description: "Perangkat & aksesoris elektronik" },
    { name: "Alat Tulis", description: "ATK dan perlengkapan kantor" },
    { name: "Pangan", description: "Makanan & minuman" },
    { name: "Perkakas", description: "Peralatan & tools gudang" },
  ].map((c) => ({ ...c, user_id: userId }));
  const { data: cats, error: catErr } = await admin
    .from("categories")
    .insert(categories)
    .select("id, name");
  if (catErr) throw catErr;
  const cat = Object.fromEntries(cats.map((c) => [c.name, c.id]));

  // Locations
  const locations = [
    { name: "Gudang Utama", code: "A-01", description: "Area penyimpanan utama" },
    { name: "Rak B", code: "B-02", description: "Rak barang kecil" },
    { name: "Cold Storage", code: "C-03", description: "Penyimpanan dingin" },
  ].map((l) => ({ ...l, user_id: userId }));
  const { data: locs } = await admin
    .from("locations")
    .insert(locations)
    .select("id, name");
  const loc = Object.fromEntries(locs.map((l) => [l.name, l.id]));

  // Products (quantity starts at 0 — built up via movements below)
  const products = [
    { name: "Laptop Asus Vivobook", sku: "ELC-001", barcode: "8991234500017", unit: "unit", price: 8500000, cost: 7600000, min_stock: 5, category: "Elektronik", location: "Gudang Utama", in: 15, out: 3 },
    { name: "Mouse Wireless Logitech", sku: "ELC-002", barcode: "8991234500024", unit: "pcs", price: 150000, cost: 110000, min_stock: 10, category: "Elektronik", location: "Rak B", in: 10, out: 7 },
    { name: "Kertas A4 80gsm", sku: "ATK-001", barcode: "8991234500031", unit: "rim", price: 55000, cost: 45000, min_stock: 20, category: "Alat Tulis", location: "Gudang Utama", in: 50, out: 50 },
    { name: "Pulpen Standard Hitam", sku: "ATK-002", barcode: "8991234500048", unit: "pcs", price: 3000, cost: 1800, min_stock: 50, category: "Alat Tulis", location: "Rak B", in: 250, out: 10 },
    { name: "Air Mineral 600ml", sku: "PGN-001", barcode: "8991234500055", unit: "botol", price: 3500, cost: 2200, min_stock: 100, category: "Pangan", location: "Cold Storage", in: 120, out: 35 },
    { name: "Kopi Sachet 25g", sku: "PGN-002", barcode: "8991234500062", unit: "sachet", price: 1500, cost: 900, min_stock: 50, category: "Pangan", location: "Gudang Utama", in: 600, out: 0 },
    { name: "Obeng Set 6 in 1", sku: "PRK-001", barcode: "8991234500079", unit: "set", price: 85000, cost: 60000, min_stock: 8, category: "Perkakas", location: "Rak B", in: 20, out: 5 },
    { name: "Lakban Coklat 2 inch", sku: "PRK-002", barcode: "8991234500086", unit: "roll", price: 12000, cost: 8000, min_stock: 30, category: "Perkakas", location: "Gudang Utama", in: 30, out: 8 },
  ];

  for (const p of products) {
    const { data: inserted } = await admin
      .from("products")
      .insert({
        user_id: userId,
        name: p.name,
        sku: p.sku,
        barcode: p.barcode,
        unit: p.unit,
        price: p.price,
        cost: p.cost,
        min_stock: p.min_stock,
        quantity: 0,
        category_id: cat[p.category],
        location_id: loc[p.location],
      })
      .select("id")
      .single();

    const moves = [];
    if (p.in > 0)
      moves.push({ user_id: userId, product_id: inserted.id, type: "in", quantity: p.in, note: "Pembelian dari supplier" });
    if (p.out > 0)
      moves.push({ user_id: userId, product_id: inserted.id, type: "out", quantity: p.out, note: "Pengiriman ke pelanggan" });
    if (moves.length) await admin.from("stock_movements").insert(moves);
  }

  console.log(`Seeded ${products.length} products with movements ✅`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

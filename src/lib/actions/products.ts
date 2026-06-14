"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  error?: string;
  success?: boolean;
}

function parseProduct(formData: FormData) {
  const num = (key: string) => {
    const v = formData.get(key);
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };
  const str = (key: string) => {
    const v = String(formData.get(key) ?? "").trim();
    return v.length ? v : null;
  };
  return {
    name: String(formData.get("name") ?? "").trim(),
    sku: String(formData.get("sku") ?? "").trim(),
    barcode: str("barcode"),
    description: str("description"),
    category_id: str("category_id"),
    location_id: str("location_id"),
    unit: String(formData.get("unit") ?? "pcs").trim() || "pcs",
    quantity: Math.max(0, Math.trunc(num("quantity"))),
    price: Math.max(0, num("price")),
    cost: Math.max(0, num("cost")),
    min_stock: Math.max(0, Math.trunc(num("min_stock"))),
    image_url: str("image_url"),
  };
}

export async function createProduct(formData: FormData): Promise<ActionResult> {
  const payload = parseProduct(formData);
  if (!payload.name || !payload.sku) {
    return { error: "Nama dan SKU wajib diisi." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("products").insert(payload);

  if (error) {
    if (error.code === "23505") {
      return {
        error: /barcode/i.test(error.message)
          ? "Barcode sudah dipakai produk lain."
          : "SKU sudah dipakai produk lain.",
      };
    }
    return { error: error.message };
  }

  revalidatePath("/products");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateProduct(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const payload = parseProduct(formData);
  if (!payload.name || !payload.sku) {
    return { error: "Nama dan SKU wajib diisi." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return {
        error: /barcode/i.test(error.message)
          ? "Barcode sudah dipakai produk lain."
          : "SKU sudah dipakai produk lain.",
      };
    }
    return { error: error.message };
  }

  revalidatePath("/products");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/products");
  revalidatePath("/dashboard");
  return { success: true };
}

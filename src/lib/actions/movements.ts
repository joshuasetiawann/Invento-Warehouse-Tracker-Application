"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { MovementType } from "@/types/database";

export interface ActionResult {
  error?: string;
  success?: boolean;
}

export async function createMovement(formData: FormData): Promise<ActionResult> {
  const product_id = String(formData.get("product_id") ?? "").trim();
  const type = String(formData.get("type") ?? "") as MovementType;
  const quantity = Math.trunc(Number(formData.get("quantity")));
  const note = String(formData.get("note") ?? "").trim() || null;

  if (!product_id) return { error: "Pilih produk terlebih dahulu." };
  if (!["in", "out", "adjustment"].includes(type)) {
    return { error: "Tipe pergerakan tidak valid." };
  }
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { error: "Jumlah harus lebih dari 0." };
  }

  const supabase = await createClient();

  // Guard against overselling for 'out' movements.
  if (type === "out") {
    const { data: product } = await supabase
      .from("products")
      .select("quantity")
      .eq("id", product_id)
      .single();
    if (product && product.quantity < quantity) {
      return { error: `Stok tidak cukup. Tersedia ${product.quantity}.` };
    }
  }

  const { error } = await supabase.from("stock_movements").insert({
    product_id,
    type,
    quantity,
    note,
  });

  if (error) return { error: error.message };

  revalidatePath("/movements");
  revalidatePath("/products");
  revalidatePath("/dashboard");
  return { success: true };
}

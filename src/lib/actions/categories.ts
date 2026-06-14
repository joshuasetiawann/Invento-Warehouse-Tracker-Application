"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  error?: string;
  success?: boolean;
}

export async function createCategory(formData: FormData): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  if (!name) return { error: "Nama kategori wajib diisi." };

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert({ name, description });
  if (error) return { error: error.message };

  revalidatePath("/categories");
  revalidatePath("/products");
  return { success: true };
}

export async function updateCategory(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  if (!name) return { error: "Nama kategori wajib diisi." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ name, description })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/categories");
  revalidatePath("/products");
  return { success: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/categories");
  revalidatePath("/products");
  return { success: true };
}

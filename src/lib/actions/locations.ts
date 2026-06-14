"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  error?: string;
  success?: boolean;
}

export async function createLocation(formData: FormData): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  if (!name) return { error: "Nama lokasi wajib diisi." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("locations")
    .insert({ name, code, description });
  if (error) return { error: error.message };

  revalidatePath("/locations");
  revalidatePath("/products");
  return { success: true };
}

export async function updateLocation(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  if (!name) return { error: "Nama lokasi wajib diisi." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("locations")
    .update({ name, code, description })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/locations");
  revalidatePath("/products");
  return { success: true };
}

export async function deleteLocation(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("locations").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/locations");
  revalidatePath("/products");
  return { success: true };
}

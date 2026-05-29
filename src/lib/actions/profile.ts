"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  error?: string;
  success?: boolean;
}

export async function updateProfile(formData: FormData): Promise<ActionResult> {
  const full_name = String(formData.get("full_name") ?? "").trim();
  if (!full_name) return { error: "Nama tidak boleh kosong." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sesi berakhir, silakan masuk lagi." };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name })
    .eq("id", user.id);
  if (error) return { error: error.message };

  // Keep auth metadata in sync (used as a fallback display name).
  await supabase.auth.updateUser({ data: { full_name } });

  revalidatePath("/", "layout");
  return { success: true };
}

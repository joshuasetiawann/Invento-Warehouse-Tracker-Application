import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function Home() {
  if (!isSupabaseConfigured) redirect("/login");
  const user = await getCurrentUser();
  redirect(user ? "/dashboard" : "/login");
}

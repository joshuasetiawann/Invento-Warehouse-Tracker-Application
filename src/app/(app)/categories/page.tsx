import { PageHeader } from "@/components/ui/page-header";
import { CategoriesClient } from "@/components/categories/categories-client";
import { getCategories, getProducts } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function CategoriesPage() {
  if (!isSupabaseConfigured) return null;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const counts: Record<string, number> = {};
  for (const p of products) {
    if (p.category_id) counts[p.category_id] = (counts[p.category_id] ?? 0) + 1;
  }

  return (
    <div className="animate-[fade-in_0.3s_ease]">
      <PageHeader
        title="Kategori"
        description="Kelompokkan produk berdasarkan jenisnya."
      />
      <CategoriesClient categories={categories} counts={counts} />
    </div>
  );
}

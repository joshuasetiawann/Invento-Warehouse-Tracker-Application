import { createClient } from "@/lib/supabase/server";
import type {
  Category,
  Location,
  MovementWithProduct,
  Product,
  ProductWithRelations,
} from "@/types/database";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return data;
}

export async function getProducts(opts?: {
  search?: string;
  categoryId?: string;
  locationId?: string;
}): Promise<ProductWithRelations[]> {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(
      "*, category:categories(id, name), location:locations(id, name)",
    )
    .order("created_at", { ascending: false });

  if (opts?.search) {
    query = query.or(`name.ilike.%${opts.search}%,sku.ilike.%${opts.search}%`);
  }
  if (opts?.categoryId) query = query.eq("category_id", opts.categoryId);
  if (opts?.locationId) query = query.eq("location_id", opts.locationId);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as ProductWithRelations[];
}

export async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  return data ?? [];
}

export async function getLocations(): Promise<Location[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("locations")
    .select("*")
    .order("name");
  return data ?? [];
}

export async function getMovements(limit = 50): Promise<MovementWithProduct[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("stock_movements")
    .select("*, product:products(id, name, sku, unit)")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as unknown as MovementWithProduct[];
}

export interface DashboardStats {
  totalProducts: number;
  totalUnits: number;
  inventoryValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  categoriesCount: number;
}

export async function getDashboardStats(): Promise<{
  stats: DashboardStats;
  lowStock: ProductWithRelations[];
  recentMovements: MovementWithProduct[];
}> {
  const supabase = await createClient();

  const [{ data: products }, { data: categories }, recentMovements] =
    await Promise.all([
      supabase.from("products").select("*, category:categories(id, name), location:locations(id, name)"),
      supabase.from("categories").select("id"),
      getMovements(6),
    ]);

  const list = (products ?? []) as unknown as ProductWithRelations[];

  const stats: DashboardStats = {
    totalProducts: list.length,
    totalUnits: list.reduce((sum, p) => sum + p.quantity, 0),
    inventoryValue: list.reduce((sum, p) => sum + p.quantity * Number(p.price), 0),
    lowStockCount: list.filter((p) => p.quantity > 0 && p.quantity <= p.min_stock)
      .length,
    outOfStockCount: list.filter((p) => p.quantity <= 0).length,
    categoriesCount: categories?.length ?? 0,
  };

  const lowStock = list
    .filter((p) => p.quantity <= p.min_stock)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 5);

  return { stats, lowStock, recentMovements };
}

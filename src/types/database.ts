/**
 * Hand-written database types for the Invento schema.
 * Mirrors `supabase/migrations/0001_init.sql`.
 */

export type MovementType = "in" | "out" | "adjustment";
export type UserRole = "admin" | "staff";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  user_id: string;
  name: string;
  code: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  sku: string;
  barcode: string | null;
  description: string | null;
  category_id: string | null;
  location_id: string | null;
  quantity: number;
  unit: string;
  price: number;
  cost: number;
  min_stock: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: string;
  user_id: string;
  product_id: string;
  type: MovementType;
  quantity: number;
  note: string | null;
  created_at: string;
}

/** Product joined with its category & location names. */
export interface ProductWithRelations extends Product {
  category: Pick<Category, "id" | "name"> | null;
  location: Pick<Location, "id" | "name"> | null;
}

/** Stock movement joined with the related product. */
export interface MovementWithProduct extends StockMovement {
  product: Pick<Product, "id" | "name" | "sku" | "unit"> | null;
}

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export function getStockStatus(product: Pick<Product, "quantity" | "min_stock">): StockStatus {
  if (product.quantity <= 0) return "out_of_stock";
  if (product.quantity <= product.min_stock) return "low_stock";
  return "in_stock";
}

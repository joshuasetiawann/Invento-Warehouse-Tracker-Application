import type { Product } from "@/types/database";

/** Minimal product shape needed to resolve a scanned/typed code. */
export type ScannableProduct = Pick<
  Product,
  "id" | "name" | "sku" | "unit" | "quantity" | "barcode"
>;

/**
 * Resolve a scanned or typed code to a product. Matches on `barcode` first,
 * then falls back to `sku` (both trimmed, case-insensitive). Returns null if
 * the code is empty or no product matches.
 */
export function matchProductByCode<
  T extends Pick<Product, "sku" | "barcode">,
>(products: T[], code: string): T | null {
  const q = code.trim().toLowerCase();
  if (!q) return null;
  return (
    products.find((p) => (p.barcode ?? "").trim().toLowerCase() === q) ??
    products.find((p) => p.sku.trim().toLowerCase() === q) ??
    null
  );
}

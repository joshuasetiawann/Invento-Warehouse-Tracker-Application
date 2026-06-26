-- ---------------------------------------------------------------------------
-- 0002_products_barcode
-- Add an optional dedicated `barcode` column to products so stock movements can
-- be recorded by scanning (camera / scanner gun / manual). Distinct from `sku`
-- (which stays the internal code); barcode holds the printed/manufacturer code
-- (e.g. EAN-13). Table-level RLS already covers the new column.
-- ---------------------------------------------------------------------------

alter table public.products
  add column if not exists barcode text;

-- One barcode per owner (nulls allowed and not constrained).
create unique index if not exists products_user_barcode_key
  on public.products (user_id, barcode)
  where barcode is not null;

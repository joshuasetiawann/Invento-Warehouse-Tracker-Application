-- ============================================================================
-- Invento — Warehouse Tracker schema
-- Run this in the Supabase SQL Editor (or `supabase db push`).
-- Every table has RLS enabled and is scoped to the authenticated user.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Helper: keep updated_at fresh
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles  (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  avatar_url  text,
  role        text not null default 'staff' check (role in ('admin', 'staff')),
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by the owner"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

-- Auto-create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Categories are selectable by owner"
  on public.categories for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Categories are insertable by owner"
  on public.categories for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Categories are updatable by owner"
  on public.categories for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Categories are deletable by owner"
  on public.categories for delete to authenticated
  using ((select auth.uid()) = user_id);

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- locations
-- ---------------------------------------------------------------------------
create table if not exists public.locations (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null,
  code        text,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.locations enable row level security;

create policy "Locations are selectable by owner"
  on public.locations for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Locations are insertable by owner"
  on public.locations for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Locations are updatable by owner"
  on public.locations for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Locations are deletable by owner"
  on public.locations for delete to authenticated
  using ((select auth.uid()) = user_id);

create trigger locations_set_updated_at
  before update on public.locations
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name         text not null,
  sku          text not null,
  description  text,
  category_id  uuid references public.categories (id) on delete set null,
  location_id  uuid references public.locations (id) on delete set null,
  quantity     integer not null default 0,
  unit         text not null default 'pcs',
  price        numeric(14, 2) not null default 0,
  cost         numeric(14, 2) not null default 0,
  min_stock    integer not null default 0,
  image_url    text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id, sku)
);

alter table public.products enable row level security;

create policy "Products are selectable by owner"
  on public.products for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Products are insertable by owner"
  on public.products for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Products are updatable by owner"
  on public.products for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Products are deletable by owner"
  on public.products for delete to authenticated
  using ((select auth.uid()) = user_id);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create index if not exists products_user_id_idx on public.products (user_id);
create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists products_location_id_idx on public.products (location_id);

-- ---------------------------------------------------------------------------
-- stock_movements  (immutable ledger; trigger keeps product.quantity in sync)
-- ---------------------------------------------------------------------------
create table if not exists public.stock_movements (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  product_id  uuid not null references public.products (id) on delete cascade,
  type        text not null check (type in ('in', 'out', 'adjustment')),
  quantity    integer not null check (quantity > 0),
  note        text,
  created_at  timestamptz not null default now()
);

alter table public.stock_movements enable row level security;

create policy "Movements are selectable by owner"
  on public.stock_movements for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Movements are insertable by owner"
  on public.stock_movements for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Movements are deletable by owner"
  on public.stock_movements for delete to authenticated
  using ((select auth.uid()) = user_id);

create index if not exists movements_user_id_idx on public.stock_movements (user_id);
create index if not exists movements_product_id_idx on public.stock_movements (product_id);

-- Apply a movement to the product's quantity.
create or replace function public.apply_stock_movement()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.type = 'in' then
    update public.products
      set quantity = quantity + new.quantity
      where id = new.product_id and user_id = new.user_id;
  elsif new.type = 'out' then
    update public.products
      set quantity = greatest(0, quantity - new.quantity)
      where id = new.product_id and user_id = new.user_id;
  elsif new.type = 'adjustment' then
    update public.products
      set quantity = new.quantity
      where id = new.product_id and user_id = new.user_id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_stock_movement on public.stock_movements;
create trigger on_stock_movement
  after insert on public.stock_movements
  for each row execute function public.apply_stock_movement();

-- ---------------------------------------------------------------------------
-- Table privileges
-- The app authenticates every request (no anonymous access), so grant the
-- `authenticated` role table access. Row visibility is still governed by the
-- RLS policies above. `service_role` is granted for trusted server-side tasks
-- (e.g. seeding). `anon` is intentionally NOT granted.
-- ---------------------------------------------------------------------------
grant usage on schema public to authenticated, service_role;

grant select, insert, update, delete on
  public.profiles,
  public.categories,
  public.locations,
  public.products,
  public.stock_movements
to authenticated, service_role;

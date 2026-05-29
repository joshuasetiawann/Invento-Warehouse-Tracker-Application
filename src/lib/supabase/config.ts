/**
 * Whether the Supabase env vars are present. Safe to read on both server and
 * client because both are `NEXT_PUBLIC_` and inlined at build time.
 */
export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client (Client Components).
 * Uses the public (publishable / anon) key — safe to expose to the browser.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

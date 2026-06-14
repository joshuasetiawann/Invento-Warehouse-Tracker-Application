import { Database, ExternalLink } from "lucide-react";

export function SetupNotice() {
  return (
    <div className="animate-[fade-in_0.4s_ease] rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Database className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-xl font-bold text-foreground">
        Hubungkan Supabase dulu
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Aplikasi belum terhubung ke database. Ikuti 3 langkah singkat berikut:
      </p>
      <ol className="mt-4 space-y-3 text-sm text-foreground">
        <li className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
            1
          </span>
          <span>
            Buat project gratis di{" "}
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              supabase.com <ExternalLink className="h-3 w-3" />
            </a>
          </span>
        </li>
        <li className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
            2
          </span>
          <span>
            Jalankan SQL di{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              supabase/migrations/0001_init.sql
            </code>{" "}
            lewat SQL Editor.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
            3
          </span>
          <span>
            Isi{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              .env.local
            </code>{" "}
            dengan URL & anon key, lalu jalankan ulang{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              npm run dev
            </code>
            .
          </span>
        </li>
      </ol>
    </div>
  );
}

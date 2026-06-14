"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { login } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SetupNotice } from "@/components/setup-notice";

function LoginForm() {
  const params = useSearchParams();
  const redirectTo = params.get("redirectTo") ?? "/dashboard";
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <div className="animate-[fade-in_0.4s_ease]">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Selamat datang 👋</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Masuk untuk mengelola gudang Anda.
        </p>
      </div>

      {state?.error && (
        <div className="mb-5 flex items-center gap-2 rounded-lg bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="nama@perusahaan.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
        </div>
        <Button type="submit" size="lg" loading={pending} className="w-full">
          Masuk
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  if (!isSupabaseConfigured) return <SetupNotice />;
  return (
    <Suspense fallback={<div className="h-80" />}>
      <LoginForm />
    </Suspense>
  );
}

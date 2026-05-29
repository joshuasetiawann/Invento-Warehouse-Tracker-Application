"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { register } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SetupNotice } from "@/components/setup-notice";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, undefined);

  if (!isSupabaseConfigured) return <SetupNotice />;

  return (
    <div className="animate-[fade-in_0.4s_ease]">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Buat akun baru</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Mulai kelola inventori gudang Anda dalam hitungan menit.
        </p>
      </div>

      {state?.error && (
        <div className="mb-5 flex items-center gap-2 rounded-lg bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="fullName">Nama lengkap</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Joshua Setiawan"
            required
          />
        </div>
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
            autoComplete="new-password"
            placeholder="Minimal 6 karakter"
            required
          />
        </div>
        <Button type="submit" size="lg" loading={pending} className="w-full">
          Daftar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}

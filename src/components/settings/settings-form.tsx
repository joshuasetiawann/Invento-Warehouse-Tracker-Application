"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, FormRow } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { getInitials } from "@/lib/utils";
import { updateProfile } from "@/lib/actions/profile";

export function SettingsForm({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = React.useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.error) {
        toast({ title: "Gagal menyimpan", description: result.error, tone: "error" });
        return;
      }
      toast({ title: "Profil tersimpan" });
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-xl font-semibold text-white">
          {getInitials(fullName || email)}
        </span>
        <div>
          <p className="font-semibold text-foreground">{fullName || "—"}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>

      <FormRow label="Nama lengkap" htmlFor="full_name">
        <Input
          id="full_name"
          name="full_name"
          defaultValue={fullName}
          placeholder="Nama Anda"
          required
        />
      </FormRow>

      <FormRow label="Email" htmlFor="email" hint="Email tidak dapat diubah.">
        <Input id="email" value={email} disabled />
      </FormRow>

      <div className="flex justify-end">
        <Button type="submit" loading={pending}>
          Simpan perubahan
        </Button>
      </div>
    </form>
  );
}

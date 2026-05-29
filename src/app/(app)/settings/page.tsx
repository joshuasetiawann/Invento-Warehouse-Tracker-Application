import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsForm } from "@/components/settings/settings-form";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();

  return (
    <div className="animate-[fade-in_0.3s_ease]">
      <PageHeader
        title="Pengaturan"
        description="Kelola informasi akun Anda."
      />
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
          </CardHeader>
          <CardContent>
            <SettingsForm
              fullName={profile?.full_name ?? ""}
              email={user?.email ?? ""}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

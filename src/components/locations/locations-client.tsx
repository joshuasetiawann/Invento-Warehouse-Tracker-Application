"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Warehouse, Pencil, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea, FormRow } from "@/components/ui/field";
import { Dialog, ConfirmDialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import {
  createLocation,
  updateLocation,
  deleteLocation,
} from "@/lib/actions/locations";
import type { Location } from "@/types/database";

export function LocationsClient({
  locations,
  counts,
}: {
  locations: Location[];
  counts: Record<string, number>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Location | null>(null);
  const [deleting, setDeleting] = React.useState<Location | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();
  const [deletePending, setDeletePending] = React.useState(false);

  function openAdd() {
    setEditing(null);
    setError(null);
    setFormOpen(true);
  }
  function openEdit(l: Location) {
    setEditing(l);
    setError(null);
    setFormOpen(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = editing
        ? await updateLocation(editing.id, formData)
        : await createLocation(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      toast({ title: editing ? "Lokasi diperbarui" : "Lokasi ditambahkan" });
      router.refresh();
      setFormOpen(false);
    });
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeletePending(true);
    const result = await deleteLocation(deleting.id);
    setDeletePending(false);
    if (result.error) {
      toast({ title: "Gagal menghapus", description: result.error, tone: "error" });
      return;
    }
    toast({ title: "Lokasi dihapus", description: deleting.name });
    setDeleting(null);
    router.refresh();
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Tambah Lokasi
        </Button>
      </div>

      {locations.length === 0 ? (
        <EmptyState
          icon={Warehouse}
          title="Belum ada lokasi"
          description="Tambahkan rak, gudang, atau area penyimpanan untuk melacak posisi barang."
          action={
            <Button onClick={openAdd}>
              <Plus className="h-4 w-4" />
              Tambah Lokasi
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((l) => (
            <Card key={l.id} className="p-5">
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-info-soft text-info">
                  <Warehouse className="h-5 w-5" />
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(l)}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-primary"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleting(l)}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-danger-soft hover:text-danger"
                    aria-label="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{l.name}</h3>
                {l.code && <Badge tone="neutral">{l.code}</Badge>}
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {l.description || "Tanpa deskripsi"}
              </p>
              <p className="mt-3 text-xs font-medium text-info">
                {counts[l.id] ?? 0} produk
              </p>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit Lokasi" : "Tambah Lokasi"}
        className="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormRow label="Nama lokasi" htmlFor="name" className="sm:col-span-2">
              <Input
                id="name"
                name="name"
                defaultValue={editing?.name}
                placeholder="Mis. Gudang Utama"
                required
              />
            </FormRow>
            <FormRow label="Kode" htmlFor="code">
              <Input
                id="code"
                name="code"
                defaultValue={editing?.code ?? ""}
                placeholder="A-01"
              />
            </FormRow>
          </div>
          <FormRow label="Deskripsi (opsional)" htmlFor="description">
            <Textarea
              id="description"
              name="description"
              defaultValue={editing?.description ?? ""}
            />
          </FormRow>
          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
              Batal
            </Button>
            <Button type="submit" loading={pending}>
              {editing ? "Simpan" : "Tambah"}
            </Button>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        loading={deletePending}
        title="Hapus lokasi?"
        description={`"${deleting?.name}" akan dihapus. Produk terkait tidak ikut terhapus, hanya lokasinya dikosongkan.`}
      />
    </>
  );
}

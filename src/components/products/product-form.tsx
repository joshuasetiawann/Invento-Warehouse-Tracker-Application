"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea, FormRow } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { createProduct, updateProduct } from "@/lib/actions/products";
import type { Category, Location, Product } from "@/types/database";

export function ProductForm({
  open,
  onClose,
  product,
  categories,
  locations,
}: {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
  categories: Category[];
  locations: Location[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();
  const isEdit = Boolean(product);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = isEdit
        ? await updateProduct(product!.id, formData)
        : await createProduct(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      toast({
        title: isEdit ? "Produk diperbarui" : "Produk ditambahkan",
        description: String(formData.get("name")),
      });
      router.refresh();
      onClose();
    });
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Produk" : "Tambah Produk"}
      description={
        isEdit
          ? "Perbarui detail produk. Stok diubah lewat menu Stok Masuk & Keluar."
          : "Tambahkan produk baru ke inventori gudang Anda."
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormRow label="Nama produk" htmlFor="name" className="sm:col-span-2">
            <Input
              id="name"
              name="name"
              defaultValue={product?.name}
              placeholder="Contoh: Kardus Box 40×40"
              required
            />
          </FormRow>

          <FormRow label="SKU" htmlFor="sku">
            <Input
              id="sku"
              name="sku"
              defaultValue={product?.sku}
              placeholder="SKU-0001"
              required
            />
          </FormRow>

          <FormRow label="Satuan" htmlFor="unit">
            <Input
              id="unit"
              name="unit"
              defaultValue={product?.unit ?? "pcs"}
              placeholder="pcs / box / kg"
            />
          </FormRow>

          <FormRow label="Kategori" htmlFor="category_id">
            <Select
              id="category_id"
              name="category_id"
              defaultValue={product?.category_id ?? ""}
            >
              <option value="">— Tanpa kategori —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </FormRow>

          <FormRow label="Lokasi" htmlFor="location_id">
            <Select
              id="location_id"
              name="location_id"
              defaultValue={product?.location_id ?? ""}
            >
              <option value="">— Tanpa lokasi —</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </Select>
          </FormRow>

          <FormRow label="Harga jual (Rp)" htmlFor="price">
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="1"
              defaultValue={product?.price ?? 0}
            />
          </FormRow>

          <FormRow label="Harga modal (Rp)" htmlFor="cost">
            <Input
              id="cost"
              name="cost"
              type="number"
              min="0"
              step="1"
              defaultValue={product?.cost ?? 0}
            />
          </FormRow>

          {isEdit ? (
            <input type="hidden" name="quantity" value={product?.quantity ?? 0} />
          ) : (
            <FormRow label="Stok awal" htmlFor="quantity">
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                step="1"
                defaultValue={0}
              />
            </FormRow>
          )}

          <FormRow label="Stok minimum" htmlFor="min_stock">
            <Input
              id="min_stock"
              name="min_stock"
              type="number"
              min="0"
              step="1"
              defaultValue={product?.min_stock ?? 0}
            />
          </FormRow>

          <FormRow label="Deskripsi" htmlFor="description" className="sm:col-span-2">
            <Textarea
              id="description"
              name="description"
              defaultValue={product?.description ?? ""}
              placeholder="Catatan opsional tentang produk…"
            />
          </FormRow>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" loading={pending}>
            {isEdit ? "Simpan perubahan" : "Tambah produk"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

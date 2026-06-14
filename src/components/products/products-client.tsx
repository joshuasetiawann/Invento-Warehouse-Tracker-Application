"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Package,
  Pencil,
  Trash2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import { StockBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { ProductForm } from "./product-form";
import { deleteProduct } from "@/lib/actions/products";
import { getStockStatus } from "@/types/database";
import type {
  Category,
  Location,
  Product,
  ProductWithRelations,
} from "@/types/database";
import { formatCurrency } from "@/lib/utils";

export function ProductsClient({
  products,
  categories,
  locations,
}: {
  products: ProductWithRelations[];
  categories: Category[];
  locations: Location[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Product | null>(null);
  const [deleting, setDeleting] = React.useState<ProductWithRelations | null>(null);
  const [deletePending, setDeletePending] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.barcode?.toLowerCase().includes(q) ?? false);
      const matchCat = !categoryId || p.category_id === categoryId;
      return matchSearch && matchCat;
    });
  }, [products, search, categoryId]);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(p: Product) {
    setEditing(p);
    setFormOpen(true);
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeletePending(true);
    const result = await deleteProduct(deleting.id);
    setDeletePending(false);
    if (result.error) {
      toast({ title: "Gagal menghapus", description: result.error, tone: "error" });
      return;
    }
    toast({ title: "Produk dihapus", description: deleting.name });
    setDeleting(null);
    router.refresh();
  }

  return (
    <>
      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, SKU, atau barcode…"
            className="pl-9"
          />
        </div>
        <Select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="sm:w-56"
        >
          <option value="">Semua kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <Button onClick={openAdd} className="shrink-0">
          <Plus className="h-4 w-4" />
          Tambah Produk
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title={products.length === 0 ? "Belum ada produk" : "Tidak ditemukan"}
          description={
            products.length === 0
              ? "Tambahkan produk pertama Anda untuk mulai melacak stok."
              : "Coba ubah kata kunci pencarian atau filter kategori."
          }
          action={
            products.length === 0 ? (
              <Button onClick={openAdd}>
                <Plus className="h-4 w-4" />
                Tambah Produk
              </Button>
            ) : undefined
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-semibold">Produk</th>
                  <th className="px-5 py-3 font-semibold">Kategori</th>
                  <th className="px-5 py-3 font-semibold">Lokasi</th>
                  <th className="px-5 py-3 text-right font-semibold">Harga</th>
                  <th className="px-5 py-3 text-right font-semibold">Stok</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                          <Package className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-medium text-foreground">{p.name}</p>
                          <p className="font-mono text-xs text-muted-foreground tabular">
                            {p.sku}
                            {p.barcode ? ` · ${p.barcode}` : ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {p.category?.name ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {p.location ? (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {p.location.name}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-medium text-foreground tabular">
                      {formatCurrency(Number(p.price))}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-foreground">
                      <span className="font-mono tabular">{p.quantity}</span>{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        {p.unit}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StockBadge status={getStockStatus(p)} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-primary"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleting(p)}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-danger-soft hover:text-danger"
                          aria-label="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <ProductForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        product={editing}
        categories={categories}
        locations={locations}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        loading={deletePending}
        title="Hapus produk?"
        description={`"${deleting?.name}" akan dihapus permanen beserta riwayat stoknya.`}
      />
    </>
  );
}

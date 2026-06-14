"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea, FormRow } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { createMovement } from "@/lib/actions/movements";
import type { MovementType, Product } from "@/types/database";

export function MovementForm({
  open,
  onClose,
  type,
  products,
}: {
  open: boolean;
  onClose: () => void;
  type: MovementType;
  products: Pick<Product, "id" | "name" | "sku" | "unit" | "quantity">[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();

  const isIn = type === "in";
  const title = isIn ? "Catat Barang Masuk" : "Catat Barang Keluar";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("type", type);
    startTransition(async () => {
      const result = await createMovement(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      toast({
        title: isIn ? "Barang masuk dicatat" : "Barang keluar dicatat",
        tone: "success",
      });
      router.refresh();
      onClose();
    });
  }

  return (
    <Dialog open={open} onClose={onClose} title={title} className="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div
          className={`flex items-center gap-3 rounded-xl p-3.5 ${
            isIn ? "bg-success-soft" : "bg-danger-soft"
          }`}
        >
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              isIn ? "bg-success text-white" : "bg-danger text-white"
            }`}
          >
            {isIn ? (
              <ArrowDownLeft className="h-5 w-5" />
            ) : (
              <ArrowUpRight className="h-5 w-5" />
            )}
          </span>
          <p className={`text-sm ${isIn ? "text-success" : "text-danger"}`}>
            {isIn
              ? "Stok produk akan bertambah sesuai jumlah."
              : "Stok produk akan berkurang sesuai jumlah."}
          </p>
        </div>

        <FormRow label="Produk" htmlFor="product_id">
          <Select id="product_id" name="product_id" required defaultValue="">
            <option value="" disabled>
              Pilih produk…
            </option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku}) — stok {p.quantity} {p.unit}
              </option>
            ))}
          </Select>
        </FormRow>

        <FormRow label="Jumlah" htmlFor="quantity">
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            step="1"
            defaultValue={1}
            required
          />
        </FormRow>

        <FormRow label="Catatan (opsional)" htmlFor="note">
          <Textarea
            id="note"
            name="note"
            placeholder={isIn ? "Mis. pembelian dari supplier" : "Mis. pengiriman ke pelanggan"}
          />
        </FormRow>

        <div className="flex justify-end gap-3 pt-1">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="submit"
            loading={pending}
            variant={isIn ? "primary" : "danger"}
          >
            Simpan
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

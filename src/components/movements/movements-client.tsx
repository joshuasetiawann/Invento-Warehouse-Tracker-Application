"use client";

import * as React from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  SlidersHorizontal,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { MovementForm } from "./movement-form";
import type { MovementType, MovementWithProduct } from "@/types/database";
import type { ScannableProduct } from "@/lib/match";
import { formatDateTime } from "@/lib/utils";

const meta: Record<
  MovementType,
  { label: string; icon: typeof ArrowDownLeft; cls: string; tone: "success" | "danger" | "info" }
> = {
  in: { label: "Masuk", icon: ArrowDownLeft, cls: "bg-success-soft text-success", tone: "success" },
  out: { label: "Keluar", icon: ArrowUpRight, cls: "bg-danger-soft text-danger", tone: "danger" },
  adjustment: {
    label: "Penyesuaian",
    icon: SlidersHorizontal,
    cls: "bg-info-soft text-info",
    tone: "info",
  },
};

export function MovementsClient({
  movements,
  products,
}: {
  movements: MovementWithProduct[];
  products: ScannableProduct[];
}) {
  const [formType, setFormType] = React.useState<MovementType | null>(null);
  const noProducts = products.length === 0;

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={() => setFormType("in")}
          disabled={noProducts}
          className="flex-1 sm:flex-none"
        >
          <ArrowDownLeft className="h-4 w-4" />
          Barang Masuk
        </Button>
        <Button
          onClick={() => setFormType("out")}
          variant="danger"
          disabled={noProducts}
          className="flex-1 sm:flex-none"
        >
          <ArrowUpRight className="h-4 w-4" />
          Barang Keluar
        </Button>
      </div>

      {noProducts ? (
        <EmptyState
          icon={History}
          title="Belum ada produk"
          description="Tambahkan produk terlebih dahulu sebelum mencatat pergerakan stok."
        />
      ) : movements.length === 0 ? (
        <EmptyState
          icon={History}
          title="Belum ada pergerakan stok"
          description="Catat barang masuk atau keluar untuk melihat riwayatnya di sini."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-semibold">Produk</th>
                  <th className="px-5 py-3 font-semibold">Tipe</th>
                  <th className="px-5 py-3 text-right font-semibold">Jumlah</th>
                  <th className="px-5 py-3 font-semibold">Catatan</th>
                  <th className="px-5 py-3 text-right font-semibold">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {movements.map((m) => {
                  const mt = meta[m.type];
                  return (
                    <tr key={m.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-xl ${mt.cls}`}
                          >
                            <mt.icon className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="font-medium text-foreground">
                              {m.product?.name ?? "Produk dihapus"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {m.product?.sku ?? "—"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge tone={mt.tone}>{mt.label}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-foreground">
                        {m.type === "out" ? "−" : "+"}
                        {m.quantity}{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          {m.product?.unit ?? ""}
                        </span>
                      </td>
                      <td className="max-w-[220px] truncate px-5 py-3.5 text-muted-foreground">
                        {m.note ?? "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right text-muted-foreground">
                        {formatDateTime(m.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {formType && (
        <MovementForm
          open
          onClose={() => setFormType(null)}
          type={formType}
          products={products}
        />
      )}
    </>
  );
}

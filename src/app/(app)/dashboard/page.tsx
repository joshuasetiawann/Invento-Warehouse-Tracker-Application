import Link from "next/link";
import {
  Package,
  Boxes,
  Wallet,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  SlidersHorizontal,
  TriangleAlert,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, StockBadge } from "@/components/ui/badge";
import { getDashboardStats } from "@/lib/data";
import { getStockStatus, type MovementType } from "@/types/database";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/utils";

const movementMeta: Record<
  MovementType,
  { label: string; icon: typeof ArrowDownLeft; cls: string }
> = {
  in: { label: "Masuk", icon: ArrowDownLeft, cls: "bg-success-soft text-success" },
  out: { label: "Keluar", icon: ArrowUpRight, cls: "bg-danger-soft text-danger" },
  adjustment: {
    label: "Penyesuaian",
    icon: SlidersHorizontal,
    cls: "bg-info-soft text-info",
  },
};

export default async function DashboardPage() {
  const { stats, lowStock, recentMovements } = await getDashboardStats();

  return (
    <div className="animate-[fade-in_0.3s_ease]">
      <PageHeader
        title="Dashboard"
        description="Ringkasan kondisi inventori gudang Anda hari ini."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Produk"
          value={formatNumber(stats.totalProducts)}
          hint={`${stats.categoriesCount} kategori`}
          icon={Package}
          tone="primary"
        />
        <StatCard
          label="Total Unit Stok"
          value={formatNumber(stats.totalUnits)}
          hint="Akumulasi seluruh produk"
          icon={Boxes}
          tone="success"
        />
        <StatCard
          label="Nilai Inventori"
          value={formatCurrency(stats.inventoryValue)}
          hint="Qty × harga jual"
          icon={Wallet}
          tone="warning"
        />
        <StatCard
          label="Perlu Perhatian"
          value={formatNumber(stats.lowStockCount + stats.outOfStockCount)}
          hint={`${stats.lowStockCount} menipis · ${stats.outOfStockCount} habis`}
          icon={AlertTriangle}
          tone="danger"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Low stock */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Stok Menipis</CardTitle>
            <Link
              href="/products"
              className="text-sm font-medium text-primary hover:underline"
            >
              Lihat semua
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {lowStock.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success-soft text-success">
                  <Boxes className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Semua stok aman 🎉
                </p>
                <p className="text-sm text-muted-foreground">
                  Tidak ada produk yang menipis atau habis.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {lowStock.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-4 px-5 py-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        <TriangleAlert className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {p.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {p.sku} · {p.category?.name ?? "Tanpa kategori"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-foreground">
                        {p.quantity} {p.unit}
                      </span>
                      <StockBadge status={getStockStatus(p)} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Recent movements */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <Link
              href="/movements"
              className="text-sm font-medium text-primary hover:underline"
            >
              Riwayat
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentMovements.length === 0 ? (
              <p className="px-5 py-12 text-center text-sm text-muted-foreground">
                Belum ada aktivitas stok.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {recentMovements.map((m) => {
                  const meta = movementMeta[m.type];
                  return (
                    <li key={m.id} className="flex items-center gap-3 px-5 py-3.5">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${meta.cls}`}
                      >
                        <meta.icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {m.product?.name ?? "Produk dihapus"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(m.created_at)}
                        </p>
                      </div>
                      <Badge tone={m.type === "in" ? "success" : m.type === "out" ? "danger" : "info"}>
                        {m.type === "out" ? "−" : "+"}
                        {m.quantity}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

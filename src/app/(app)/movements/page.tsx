import { PageHeader } from "@/components/ui/page-header";
import { MovementsClient } from "@/components/movements/movements-client";
import { getMovements, getProducts } from "@/lib/data";

export default async function MovementsPage() {
  const [movements, products] = await Promise.all([
    getMovements(100),
    getProducts(),
  ]);

  const productOptions = products.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    unit: p.unit,
    quantity: p.quantity,
  }));

  return (
    <div className="animate-[fade-in_0.3s_ease]">
      <PageHeader
        title="Stok Masuk & Keluar"
        description="Catat pergerakan stok dan pantau riwayat transaksinya."
      />
      <MovementsClient movements={movements} products={productOptions} />
    </div>
  );
}

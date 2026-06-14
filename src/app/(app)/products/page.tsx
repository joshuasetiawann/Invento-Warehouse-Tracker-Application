import { PageHeader } from "@/components/ui/page-header";
import { ProductsClient } from "@/components/products/products-client";
import { getCategories, getLocations, getProducts } from "@/lib/data";

export default async function ProductsPage() {
  const [products, categories, locations] = await Promise.all([
    getProducts(),
    getCategories(),
    getLocations(),
  ]);

  return (
    <div className="animate-[fade-in_0.3s_ease]">
      <PageHeader
        title="Produk"
        description={`${products.length} produk dalam inventori Anda.`}
      />
      <ProductsClient
        products={products}
        categories={categories}
        locations={locations}
      />
    </div>
  );
}

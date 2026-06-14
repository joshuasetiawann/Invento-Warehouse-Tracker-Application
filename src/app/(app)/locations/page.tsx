import { PageHeader } from "@/components/ui/page-header";
import { LocationsClient } from "@/components/locations/locations-client";
import { getLocations, getProducts } from "@/lib/data";

export default async function LocationsPage() {
  const [locations, products] = await Promise.all([
    getLocations(),
    getProducts(),
  ]);

  const counts: Record<string, number> = {};
  for (const p of products) {
    if (p.location_id) counts[p.location_id] = (counts[p.location_id] ?? 0) + 1;
  }

  return (
    <div className="animate-[fade-in_0.3s_ease]">
      <PageHeader
        title="Lokasi"
        description="Kelola rak, gudang, dan area penyimpanan."
      />
      <LocationsClient locations={locations} counts={counts} />
    </div>
  );
}

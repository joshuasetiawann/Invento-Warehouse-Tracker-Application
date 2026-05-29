import { Boxes, PackageCheck, TrendingUp, ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-sidebar p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #4f46e5 0, transparent 40%), radial-gradient(circle at 80% 80%, #6366f1 0, transparent 45%)",
          }}
        />
        <div className="relative flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Boxes className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">Invento</span>
        </div>

        <div className="relative">
          <h1 className="text-4xl font-bold leading-tight">
            Kelola gudang Anda,
            <br />
            tanpa ribet.
          </h1>
          <p className="mt-4 max-w-md text-slate-300">
            Lacak stok, catat barang masuk & keluar, dan pantau performa
            inventori secara real-time dalam satu dashboard.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-slate-200">
            {[
              { icon: PackageCheck, text: "Manajemen produk & SKU lengkap" },
              { icon: TrendingUp, text: "Laporan stok & low-stock alert" },
              { icon: ShieldCheck, text: "Data aman dengan kontrol akses" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="h-4 w-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-slate-400">
          © {new Date().getFullYear()} Invento — Warehouse Tracker
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

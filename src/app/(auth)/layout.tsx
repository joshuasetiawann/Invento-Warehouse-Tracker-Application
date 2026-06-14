import { Boxes, PackageCheck, TrendingUp, ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[100dvh] lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel — Tidal Blue */}
      <div
        className="relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between"
        style={{
          background:
            "linear-gradient(150deg, var(--color-brand-deep) 0%, var(--color-primary) 100%)",
        }}
      >
        {/* Faint architectural line-art */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(circle at 75% 30%, #000 0, transparent 70%)",
          }}
        />
        <div className="relative flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] bg-white/15 backdrop-blur">
            <Boxes className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">Invento</span>
        </div>

        <div className="relative">
          <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight">
            Manajemen operasional
            <br />
            gudang yang presisi.
          </h1>
          <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-white/80">
            Lacak stok, catat barang masuk &amp; keluar, dan pantau performa
            inventori secara real-time dalam satu konsol.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-white/90">
            {[
              { icon: PackageCheck, text: "Manajemen produk & SKU lengkap" },
              { icon: TrendingUp, text: "Laporan stok & peringatan stok menipis" },
              { icon: ShieldCheck, text: "Data aman dengan kontrol akses" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-control)] bg-white/10">
                  <Icon className="h-4 w-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs font-medium uppercase tracking-wider text-white/60">
          Sistem Inventaris Terpadu
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/nav";

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <Boxes className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Invento
            </span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-sidebar-muted hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-muted">
            Menu
          </p>
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-white shadow-sm shadow-primary/30"
                    : "text-sidebar-foreground hover:bg-white/5 hover:text-white",
                )}
              >
                <item.icon className="h-[1.15rem] w-[1.15rem]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-xl bg-white/5 p-4">
          <p className="text-sm font-semibold text-white">Butuh bantuan?</p>
          <p className="mt-1 text-xs text-sidebar-muted">
            Lihat panduan setup Supabase di README proyek.
          </p>
        </div>
      </aside>
    </>
  );
}

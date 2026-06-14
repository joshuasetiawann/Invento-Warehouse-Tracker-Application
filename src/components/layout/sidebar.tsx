"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, X } from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { navItems } from "@/lib/nav";

export function Sidebar({
  open,
  onClose,
  name,
  email,
}: {
  open: boolean;
  onClose: () => void;
  name: string | null;
  email: string;
}) {
  const pathname = usePathname();
  const display = name || email.split("@")[0];

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-foreground/30 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-control)] bg-primary text-primary-foreground">
              <Boxes className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Invento
            </span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-[var(--radius-control)] p-1.5 text-sidebar-muted hover:bg-muted hover:text-foreground lg:hidden"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <p className="px-3 pb-2 text-[0.7rem] font-semibold uppercase tracking-wider text-sidebar-muted">
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
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-[var(--radius-control)] px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-sidebar-active-bg font-semibold text-sidebar-active"
                    : "font-medium text-sidebar-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-[1.15rem] w-[1.15rem]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User profile */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-[var(--radius-control)] px-2 py-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {getInitials(name || email)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {display}
              </p>
              <p className="truncate text-xs text-sidebar-muted">{email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

"use client";

import * as React from "react";
import { Menu, LogOut, ChevronDown, Bell } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { signOut } from "@/lib/actions/auth";

export function Topbar({
  onMenu,
  name,
  email,
}: {
  onMenu: () => void;
  name: string | null;
  email: string;
}) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const display = name || email.split("@")[0];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-card/80 px-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onMenu}
        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
        aria-label="Buka menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
        <button
          className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Notifikasi"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
        </button>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-xl py-1.5 pl-1.5 pr-2.5 hover:bg-muted"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
              {getInitials(name || email)}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-medium leading-tight text-foreground">
                {display}
              </span>
              <span className="block text-xs leading-tight text-muted-foreground">
                {email}
              </span>
            </span>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-lg animate-[fade-in_0.15s_ease]">
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-medium text-foreground">{display}</p>
                <p className="truncate text-xs text-muted-foreground">{email}</p>
              </div>
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-danger hover:bg-danger-soft"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

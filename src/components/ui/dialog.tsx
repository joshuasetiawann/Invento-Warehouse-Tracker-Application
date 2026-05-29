"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-[fade-in_0.2s_ease]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 w-full max-w-lg rounded-t-2xl bg-card shadow-2xl animate-[fade-in_0.25s_ease] sm:rounded-2xl",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            {description && (
              <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5 scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Hapus",
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  loading?: boolean;
}) {
  return (
    <Dialog open={open} onClose={onClose} title={title} description={description} className="max-w-md">
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="h-10 rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="h-10 rounded-lg bg-danger px-4 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Memproses…" : confirmLabel}
        </button>
      </div>
    </Dialog>
  );
}

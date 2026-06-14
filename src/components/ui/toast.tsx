"use client";

import * as React from "react";
import { CheckCircle2, AlertTriangle, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "info";
interface Toast {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
}

interface ToastContextValue {
  toast: (t: { title: string; description?: string; tone?: ToastTone }) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

const toneStyles: Record<ToastTone, { icon: React.ReactNode; ring: string }> = {
  success: {
    icon: <CheckCircle2 className="h-5 w-5 text-success" />,
    ring: "border-l-success",
  },
  error: {
    icon: <AlertTriangle className="h-5 w-5 text-danger" />,
    ring: "border-l-danger",
  },
  info: {
    icon: <Info className="h-5 w-5 text-info" />,
    ring: "border-l-info",
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const counter = React.useRef(0);

  const remove = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback<ToastContextValue["toast"]>(
    ({ title, description, tone = "success" }) => {
      const id = ++counter.current;
      setToasts((prev) => [...prev, { id, title, description, tone }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl border border-l-4 border-border bg-card p-4 shadow-lg animate-[fade-in_0.2s_ease]",
              toneStyles[t.tone].ring,
            )}
          >
            {toneStyles[t.tone].icon}
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {t.description}
                </p>
              )}
            </div>
            <button
              onClick={() => remove(t.id)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Tutup"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

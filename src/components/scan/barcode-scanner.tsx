"use client";

import * as React from "react";
import { Camera, ScanLine, Search, X } from "lucide-react";
import { Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScannerControls {
  stop: () => void;
}

/**
 * Barcode input for stock movements. Supports three ways to enter a code:
 *  - camera (live decode via @zxing/browser),
 *  - scanner gun (keyboard-wedge — types into the focused manual input + Enter),
 *  - manual typing.
 * Camera is opt-in; if unavailable/denied it falls back to the manual input.
 */
export function BarcodeScanner({
  onDetected,
}: {
  onDetected: (code: string) => void;
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const controlsRef = React.useRef<ScannerControls | null>(null);
  const lastRef = React.useRef<{ code: string; t: number }>({ code: "", t: 0 });
  const [cameraOn, setCameraOn] = React.useState(false);
  const [starting, setStarting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [manual, setManual] = React.useState("");

  const stopCamera = React.useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setCameraOn(false);
  }, []);

  // Stop the camera if the component unmounts (e.g. dialog closes).
  React.useEffect(() => () => controlsRef.current?.stop(), []);

  const emit = React.useCallback(
    (code: string) => {
      const c = code.trim();
      if (!c) return;
      const now = Date.now();
      // Debounce repeated reads of the same code.
      if (lastRef.current.code === c && now - lastRef.current.t < 1500) return;
      lastRef.current = { code: c, t: now };
      onDetected(c);
    },
    [onDetected],
  );

  async function startCamera() {
    setError(null);
    setStarting(true);
    try {
      const { BrowserMultiFormatReader } = await import("@zxing/browser");
      const reader = new BrowserMultiFormatReader();
      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current!,
        (result) => {
          if (result) emit(result.getText());
        },
      );
      controlsRef.current = controls;
      setCameraOn(true);
    } catch {
      setError(
        "Kamera tidak tersedia atau izinnya ditolak. Gunakan input manual / scanner di bawah.",
      );
      setCameraOn(false);
    } finally {
      setStarting(false);
    }
  }

  function onManualKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      emit(manual);
      setManual("");
    }
  }

  return (
    <div className="space-y-3">
      {/* Camera viewport */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-foreground/[0.04]">
        <video
          ref={videoRef}
          className={cn("h-full w-full object-cover", !cameraOn && "hidden")}
          muted
          playsInline
        />

        {cameraOn ? (
          <>
            {/* Scan frame: corner brackets + moving scan line */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative h-40 w-60">
                <span className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-primary" />
                <span className="absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-primary" />
                <span className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-primary" />
                <span className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-primary" />
                <span className="absolute inset-x-1 top-0 h-0.5 animate-scanline bg-primary shadow-[0_0_8px_var(--color-primary)]" />
              </div>
            </div>
            <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-xs font-medium text-white drop-shadow">
              Arahkan barcode ke dalam bingkai
            </p>
            <button
              type="button"
              onClick={stopCamera}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-foreground/60 text-white hover:bg-foreground/80"
              aria-label="Matikan kamera"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary">
              <Camera className="h-5 w-5" />
            </span>
            <p className="text-sm text-muted-foreground">
              Scan barcode dengan kamera
            </p>
            <Button type="button" size="sm" onClick={startCamera} loading={starting}>
              <ScanLine className="h-4 w-4" />
              Aktifkan Kamera
            </Button>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-danger">{error}</p>}

      {/* Manual / scanner-gun input (no nested <form> — handle Enter inline) */}
      <div className="flex gap-2">
        <Input
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          onKeyDown={onManualKeyDown}
          placeholder="Atau ketik / scan kode box…"
          className="font-mono"
          autoComplete="off"
          aria-label="Kode barcode atau SKU"
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            emit(manual);
            setManual("");
          }}
          aria-label="Cari kode"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-lg border border-rose/30 bg-rose/[0.06] p-8 text-center">
      <h2 className="text-xl font-bold text-rose mb-2">
        Algo salió mal
      </h2>
      <p className="text-sm text-rose/80 mb-1">{error.message}</p>
      {error.digest && (
        <p className="text-xs text-muted-foreground mb-4 font-mono">
          Digest: {error.digest}
        </p>
      )}
      <Button variant="destructive" size="sm" onClick={reset} className="mt-3">
        <RotateCcw className="size-3.5" />
        Reintentar
      </Button>
    </div>
  );
}

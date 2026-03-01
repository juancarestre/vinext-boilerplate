"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTrpcTransport } from "@/lib/trpc-react";
import type { Locale } from "@/lib/i18n";

export default function TransportSwitch({ locale }: { locale: Locale }) {
  const isEs = locale === "es";
  const { mode, setMode } = useTrpcTransport();

  return (
    <div className="mb-4 rounded-lg border border-border bg-card/60 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {isEs ? "Transporte de cliente" : "Client transport"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {isEs
              ? "El navegador no usa service binding directo; modo binding usa proxy local /api/trpc en el Web Worker."
              : "The browser cannot call service bindings directly; binding mode uses local /api/trpc proxy on the Web Worker."}
          </p>
        </div>
        <Badge
          variant="secondary"
          className={
            mode === "binding-proxy"
              ? "border border-emerald/30 bg-emerald/10 text-emerald"
              : "border border-sky/30 bg-sky/10 text-sky"
          }
        >
          {mode === "binding-proxy"
            ? isEs
              ? "Modo: binding proxy"
              : "Mode: binding proxy"
            : isEs
              ? "Modo: externo"
              : "Mode: external"}
        </Badge>
      </div>

      <div className="mt-3 inline-flex rounded-md border border-border bg-muted/30 p-1">
        <Button
          type="button"
          size="sm"
          variant={mode === "external" ? "default" : "ghost"}
          className="h-7 px-2.5 text-xs"
          onClick={() => setMode("external")}
        >
          {isEs ? "Externo" : "External"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "binding-proxy" ? "default" : "ghost"}
          className="h-7 px-2.5 text-xs"
          onClick={() => setMode("binding-proxy")}
        >
          {isEs ? "Binding proxy" : "Binding proxy"}
        </Button>
      </div>
    </div>
  );
}

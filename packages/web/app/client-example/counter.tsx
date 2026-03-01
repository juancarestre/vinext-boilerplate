"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SectionExplainer } from "@/components/page-shell";
import { Minus, Plus, RotateCcw } from "lucide-react";
import type { Locale } from "@/lib/i18n";

export default function Counter({ locale }: { locale: Locale }) {
  const isEs = locale === "es";
  const dateLocale = isEs ? "es-ES" : "en-US";

  const [count, setCount] = useState(0);
  const [clicks, setClicks] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);
  const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    setMounted(true);
    setWindowSize({ w: window.innerWidth, h: window.innerHeight });

    const handleResize = () => {
      setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = (delta: number) => {
    setCount((prev) => prev + delta);
    setClicks((prev) => [...prev.slice(-4), Date.now()]);
  };

  const rows = [
    {
      label: isEs ? "¿Hidratado?" : "Hydrated?",
      value: mounted ? (isEs ? "Sí" : "Yes") : "No (SSR)",
      valueClass: mounted ? "text-emerald" : "text-rose",
    },
    {
      label: isEs ? "Agente de usuario" : "User Agent",
      value: mounted ? navigator.userAgent.split(" ").slice(-2).join(" ") : "...",
    },
    {
      label: isEs ? "Ventana" : "Window",
      value: mounted ? `${windowSize.w} x ${windowSize.h}` : "...",
    },
    {
      label: isEs ? "Últimos clics" : "Recent clicks",
      value:
        clicks.length > 0
          ? clicks.map((t) => new Date(t).toLocaleTimeString(dateLocale)).join(", ")
          : isEs
            ? "ninguno"
            : "none",
    },
  ];

  return (
    <div>
      {/* Counter */}
      <div className="rounded-lg border border-border bg-card p-8 text-center mb-4">
        <p className="text-sm text-muted-foreground mb-2">
          {isEs ? "Contador (useState + onClick)" : "Counter (useState + onClick)"}
        </p>
        <p className="text-5xl font-extrabold tabular-nums my-4">{count}</p>
        <div className="flex gap-2 justify-center">
          <Button variant="outline" size="sm" onClick={() => handleClick(-1)}>
            <Minus className="size-3.5" /> 1
          </Button>
          <Button size="sm" onClick={() => handleClick(1)}>
            <Plus className="size-3.5" /> 1
          </Button>
          <Button size="sm" onClick={() => handleClick(5)}>
            <Plus className="size-3.5" /> 5
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCount(0);
              setClicks([]);
            }}
          >
            <RotateCcw className="size-3.5" /> Reset
          </Button>
        </div>
      </div>

      {/* Browser info */}
      <div className="rounded-lg border border-border bg-card overflow-hidden mb-4">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between px-4 py-3 ${
              i < rows.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <span className="text-sm text-muted-foreground">{row.label}</span>
            <span
              className={`text-sm font-mono truncate max-w-[280px] ${
                row.valueClass ?? ""
              }`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <SectionExplainer
        locale={locale}
        title={isEs ? "¿Por qué Client Component?" : "Why Client Component?"}
        items={[
          <>
            {isEs ? "Necesitas " : "You need "}
            <code className="font-mono text-xs">useState</code>,{" "}
            <code className="font-mono text-xs">useEffect</code>, o event handlers
          </>,
          <>
            {isEs ? "Acceso a APIs del navegador (" : "Access to browser APIs ("}
            <code className="font-mono text-xs">window</code>,{" "}
            <code className="font-mono text-xs">navigator</code>)
          </>,
          <>{isEs ? "Interactividad en tiempo real sin recargar" : "Real-time interactivity without reloads"}</>,
          <>{isEs ? "El JavaScript de este componente sí se envía al navegador" : "This component's JavaScript is sent to the browser"}</>,
          <>{isEs ? "Se hidrata sobre el HTML pre-renderizado del servidor" : "It hydrates on top of server pre-rendered HTML"}</>,
        ]}
      />
    </div>
  );
}

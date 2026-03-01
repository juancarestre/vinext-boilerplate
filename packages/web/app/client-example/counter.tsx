"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SectionExplainer } from "@/components/page-shell";
import { Minus, Plus, RotateCcw } from "lucide-react";

export default function Counter() {
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
      label: "Hidratado?",
      value: mounted ? "Si" : "No (SSR)",
      valueClass: mounted ? "text-emerald" : "text-rose",
    },
    {
      label: "User Agent",
      value: mounted ? navigator.userAgent.split(" ").slice(-2).join(" ") : "...",
    },
    {
      label: "Ventana",
      value: mounted ? `${windowSize.w} x ${windowSize.h}` : "...",
    },
    {
      label: "Ultimos clicks",
      value:
        clicks.length > 0
          ? clicks.map((t) => new Date(t).toLocaleTimeString()).join(", ")
          : "ninguno",
    },
  ];

  return (
    <div>
      {/* Counter */}
      <div className="rounded-lg border border-border bg-card p-8 text-center mb-4">
        <p className="text-sm text-muted-foreground mb-2">
          Contador (useState + onClick)
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
        title="Por que Client Component?"
        items={[
          <>
            Necesitas <code className="font-mono text-xs">useState</code>,{" "}
            <code className="font-mono text-xs">useEffect</code>, o event handlers
          </>,
          <>
            Acceso a APIs del navegador (
            <code className="font-mono text-xs">window</code>,{" "}
            <code className="font-mono text-xs">navigator</code>)
          </>,
          <>Interactividad en tiempo real sin recargar</>,
          <>El JavaScript de este componente SI se envía al navegador</>,
          <>Se hidrata sobre el HTML que el servidor pre-renderizó</>,
        ]}
      />
    </div>
  );
}

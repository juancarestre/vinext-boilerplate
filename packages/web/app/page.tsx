import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ArrowRight,
  Zap,
  Server,
  Monitor,
  Layers,
  Wind,
  AlertTriangle,
  FileText,
  Route,
  CloudCog,
} from "lucide-react";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      {/* Hero */}
      <header className="mb-14 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 rounded-lg bg-primary/15 flex items-center justify-center">
            <Zap className="size-5 text-primary" />
          </div>
          <Badge variant="outline" className="font-mono text-[10px] tracking-wider uppercase">
            v0.1.0
          </Badge>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3 leading-[1.1]">
          Vinext
          <span className="text-primary"> Boilerplate</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
          Monorepo full-stack: frontend Vinext + backend Hono/tRPC, ambos
          desplegados como Cloudflare Workers con type safety end-to-end.
        </p>
      </header>

      {/* tRPC Highlight */}
      <Link
        href="/trpc-demo"
        prefetch={false}
        className="group block mb-8 animate-slide-up"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="relative rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] via-card to-violet/[0.04] p-6 transition-all hover:border-primary/40 hover:glow-primary overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-primary">
                tRPC — Type-safe API
              </h2>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-lg">
              Hono + tRPC backend Worker con React Query en el frontend. Modelos
              Zod compartidos, queries/mutations interactivas, zero codegen.
            </p>
            <div className="flex gap-2 flex-wrap">
              {["Hono", "tRPC", "React Query", "Zod", "Monorepo"].map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="font-mono text-[10px] tracking-wider"
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Link>

      {/* Demo Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 animate-slide-up"
        style={{ animationDelay: "0.2s" }}
      >
        <DemoCard
          href="/server-example"
          icon={<Server className="size-4" />}
          title="Server Component"
          description="Async data, zero client JS"
          color="var(--color-emerald)"
        />
        <DemoCard
          href="/client-example"
          icon={<Monitor className="size-4" />}
          title="Client Component"
          description="useState, event handlers"
          color="var(--color-violet)"
        />
        <DemoCard
          href="/streaming"
          icon={<Layers className="size-4" />}
          title="Streaming SSR"
          description="Suspense, progressive render"
          color="var(--color-sky)"
        />
        <DemoCard
          href="/error-example"
          icon={<AlertTriangle className="size-4" />}
          title="Error Boundary"
          description="error.tsx con recovery"
          color="var(--color-rose)"
        />
        <DemoCard
          href="/server-actions"
          icon={<FileText className="size-4" />}
          title="Server Actions"
          description="'use server' forms"
          color="var(--color-amber)"
        />
        <DemoCard
          href="/posts"
          icon={<Route className="size-4" />}
          title="Dynamic Routes"
          description="[slug] params, notFound()"
          color="var(--color-teal)"
        />
      </div>

      {/* Architecture */}
      <section
        className="mb-10 animate-slide-up"
        style={{ animationDelay: "0.3s" }}
      >
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Stack
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <Zap className="size-4" />, label: "Vinext", sub: "Vite + RSC" },
            { icon: <CloudCog className="size-4" />, label: "Workers", sub: "Edge global" },
            { icon: <Server className="size-4" />, label: "Hono", sub: "API framework" },
            { icon: <Layers className="size-4" />, label: "tRPC", sub: "Type safety" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-border bg-card/50 p-4 text-center"
            >
              <div className="mx-auto mb-2 size-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                {item.icon}
              </div>
              <div className="text-sm font-semibold">{item.label}</div>
              <div className="text-xs text-muted-foreground">{item.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Links */}
      <nav
        className="flex flex-wrap gap-4 pt-6 border-t border-border text-sm animate-slide-up"
        style={{ animationDelay: "0.4s" }}
      >
        <Link href="/about" prefetch={false} className="text-muted-foreground hover:text-foreground transition-colors">
          About
        </Link>
        <Link href="/api/hello" prefetch={false} className="text-muted-foreground hover:text-foreground transition-colors">
          API route
        </Link>
        <a href="https://github.com/cloudflare/vinext" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
          Vinext
        </a>
        <a href="https://hono.dev" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
          Hono
        </a>
        <a href="https://trpc.io" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
          tRPC
        </a>
      </nav>
    </main>
  );
}

function DemoCard({
  href,
  icon,
  title,
  description,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Link href={href} prefetch={false} className="group block">
      <Card className="h-full transition-all hover:border-[color:var(--_c)] hover:bg-[color:var(--_c)]/[0.04]" style={{ "--_c": color } as React.CSSProperties}>
        <CardHeader className="p-4">
          <div className="flex items-center gap-2.5 mb-1">
            <div
              className="size-7 rounded-md flex items-center justify-center"
              style={{ background: `${color}18`, color }}
            >
              {icon}
            </div>
            <CardTitle className="text-sm">{title}</CardTitle>
          </div>
          <CardDescription className="text-xs leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { getLocale } from "@/lib/i18n-server";

export const metadata = {
  title: "About | Vinext Boilerplate",
};

export default async function AboutPage() {
  const locale = await getLocale();
  const isEs = locale === "es";

  const stackItems = isEs
    ? [
        { label: "App Router", desc: "con nested layouts y error boundaries" },
        { label: "React Server Components", desc: "via @vitejs/plugin-rsc" },
        { label: "Hono + tRPC", desc: "backend API Worker con type safety" },
        { label: "Zod", desc: "modelos compartidos en paquete shared" },
        { label: "React Query", desc: "para client-side data fetching" },
        { label: "shadcn/ui", desc: "componentes accesibles con Tailwind CSS" },
        { label: "Server Actions", desc: "'use server' forms sin API routes" },
        { label: "API Routes", desc: "handler en /api/hello" },
        { label: "Cloudflare Workers", desc: "deploy via wrangler.jsonc" },
        { label: "TypeScript", desc: "configurado out of the box" },
      ]
    : [
        { label: "App Router", desc: "with nested layouts and error boundaries" },
        { label: "React Server Components", desc: "via @vitejs/plugin-rsc" },
        { label: "Hono + tRPC", desc: "API Worker backend with type safety" },
        { label: "Zod", desc: "shared models in the shared package" },
        { label: "React Query", desc: "for client-side data fetching" },
        { label: "shadcn/ui", desc: "accessible components with Tailwind CSS" },
        { label: "Server Actions", desc: "'use server' forms without API routes" },
        { label: "API Routes", desc: "handler at /api/hello" },
        { label: "Cloudflare Workers", desc: "deploy via wrangler.jsonc" },
        { label: "TypeScript", desc: "configured out of the box" },
      ];

  return (
    <PageShell title={isEs ? "Acerca de" : "About"} locale={locale}>
      <p className="text-muted-foreground leading-relaxed mb-6">
        {isEs
          ? "Este es un monorepo boilerplate que demuestra "
          : "This is a monorepo boilerplate that demonstrates "}
        <a
          href="https://github.com/cloudflare/vinext"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          vinext
        </a>{" "}
        {isEs
          ? "— la API de Next.js reimplementada sobre Vite, desplegada a Cloudflare Workers — junto con un backend Hono+tRPC para type safety end-to-end."
          : "— the Next.js API reimplemented on top of Vite, deployed to Cloudflare Workers — together with a Hono+tRPC backend for end-to-end type safety."}
      </p>

      <h2 className="text-lg font-semibold mb-3">
        {isEs ? "Stack incluido" : "Included stack"}
      </h2>

      <div className="space-y-2 mb-8">
        {stackItems.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <Badge variant="secondary" className="font-mono text-[10px] shrink-0 w-fit">
              {item.label}
            </Badge>
            <span className="text-sm text-muted-foreground">{item.desc}</span>
          </div>
        ))}
      </div>

      <Link href="/" prefetch={false} className="text-sm text-primary hover:underline">
        {isEs ? "\u2190 Volver al inicio" : "\u2190 Back to home"}
      </Link>
    </PageShell>
  );
}

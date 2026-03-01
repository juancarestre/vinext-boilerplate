import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "About | Vinext Boilerplate",
};

export default function AboutPage() {
  return (
    <PageShell title="About">
      <p className="text-muted-foreground leading-relaxed mb-6">
        Este es un monorepo boilerplate que demuestra{" "}
        <a
          href="https://github.com/cloudflare/vinext"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          vinext
        </a>{" "}
        — la API de Next.js reimplementada sobre Vite, desplegada a Cloudflare
        Workers — junto con un backend Hono+tRPC para type safety end-to-end.
      </p>

      <h2 className="text-lg font-semibold mb-3">Stack incluido</h2>

      <div className="space-y-2 mb-8">
        {[
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
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <Badge variant="secondary" className="font-mono text-[10px] shrink-0 w-fit">
              {item.label}
            </Badge>
            <span className="text-sm text-muted-foreground">{item.desc}</span>
          </div>
        ))}
      </div>

      <Link href="/" prefetch={false} className="text-sm text-primary hover:underline">
        &larr; Back to home
      </Link>
    </PageShell>
  );
}

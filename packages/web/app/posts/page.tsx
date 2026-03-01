import Link from "next/link";
import { PageShell, SectionExplainer } from "@/components/page-shell";
import { ChevronRight } from "lucide-react";

const posts = [
  {
    slug: "que-es-vinext",
    title: "Que es Vinext?",
    excerpt: "Next.js reimplementado sobre Vite con deploy a Cloudflare Workers.",
  },
  {
    slug: "server-vs-client",
    title: "Server vs Client Components",
    excerpt: "Cuando usar cada uno y como afecta el bundle size.",
  },
  {
    slug: "deploy-workers",
    title: "Deploy a Cloudflare Workers",
    excerpt: "Zero cold starts, edge global, y bindings a KV, R2, D1.",
  },
  {
    slug: "vite-plugins",
    title: "Vite Plugin Ecosystem",
    excerpt: "Como aprovechar el ecosistema de Vite dentro de vinext.",
  },
];

export const metadata = {
  title: "Posts | Vinext Boilerplate",
};

export default function PostsPage() {
  return (
    <PageShell
      title="Dynamic Routes"
      accentColor="oklch(0.7 0.12 185)"
      description={
        <>
          Cada post usa <code className="font-mono text-xs">/posts/[slug]</code>{" "}
          — una ruta dinámica que extrae el parámetro de la URL automáticamente.
        </>
      }
    >
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {posts.map((post, i) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            prefetch={false}
            className="group block"
          >
            <div
              className={`flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-muted/50 ${
                i < posts.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div>
                <h2 className="text-sm font-medium group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {post.excerpt}
                </p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground shrink-0 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>

      <SectionExplainer
        items={[
          <>Rutas dinámicas con <code className="font-mono text-xs">[slug]</code> en el filesystem</>,
          <>Parámetros extraídos automáticamente via <code className="font-mono text-xs">params</code></>,
          <><code className="font-mono text-xs">generateMetadata</code> para SEO dinámico por página</>,
          <>Rutas inexistentes caen en <code className="font-mono text-xs">notFound()</code> automáticamente</>,
        ]}
      />
    </PageShell>
  );
}

import Link from "next/link";
import { PageShell, SectionExplainer } from "@/components/page-shell";
import { ChevronRight } from "lucide-react";
import { getLocale } from "@/lib/i18n-server";

export const metadata = {
  title: "Posts | Vinext Boilerplate",
};

export default async function PostsPage() {
  const locale = await getLocale();
  const isEs = locale === "es";

  const posts = isEs
    ? [
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
      ]
    : [
        {
          slug: "que-es-vinext",
          title: "What is Vinext?",
          excerpt: "Next.js reimplemented on top of Vite with Cloudflare Workers deploy.",
        },
        {
          slug: "server-vs-client",
          title: "Server vs Client Components",
          excerpt: "When to use each one and how it affects bundle size.",
        },
        {
          slug: "deploy-workers",
          title: "Deploy to Cloudflare Workers",
          excerpt: "Zero cold starts, global edge, and native KV, R2, D1 bindings.",
        },
        {
          slug: "vite-plugins",
          title: "Vite Plugin Ecosystem",
          excerpt: "How to leverage the Vite ecosystem inside vinext.",
        },
      ];

  return (
    <PageShell
      title={isEs ? "Rutas Dinámicas" : "Dynamic Routes"}
      locale={locale}
      accentColor="oklch(0.7 0.12 185)"
      description={
        <>
          {isEs ? "Cada post usa " : "Each post uses "}
          <code className="font-mono text-xs">/posts/[slug]</code>{" "}
          {isEs
            ? "— una ruta dinámica que extrae el parámetro de la URL automáticamente."
            : "— a dynamic route that extracts the URL parameter automatically."}
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
        locale={locale}
        items={[
          <>
            {isEs ? "Rutas dinámicas con " : "Dynamic routes with "}
            <code className="font-mono text-xs">[slug]</code>
            {isEs ? " en el filesystem" : " in the filesystem"}
          </>,
          <>
            {isEs ? "Parámetros extraídos automáticamente vía " : "Parameters extracted automatically via "}
            <code className="font-mono text-xs">params</code>
          </>,
          <>
            <code className="font-mono text-xs">generateMetadata</code>
            {isEs ? " para SEO dinámico por página" : " for dynamic per-page SEO"}
          </>,
          <>
            {isEs ? "Rutas inexistentes caen en " : "Unknown routes automatically fall into "}
            <code className="font-mono text-xs">notFound()</code>
          </>,
        ]}
      />
    </PageShell>
  );
}

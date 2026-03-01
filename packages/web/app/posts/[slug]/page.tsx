import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

const posts: Record<string, { title: string; content: string; date: string }> = {
  "que-es-vinext": {
    title: "Que es Vinext?",
    date: "2026-02-27",
    content:
      "Vinext es un plugin de Vite que reimplementa la API de Next.js. Permite correr aplicaciones Next.js sobre Vite con deploy a Cloudflare Workers. Cubre ~94% de la API surface de Next.js 16, incluyendo App Router, Pages Router, RSC, Server Actions, ISR, Metadata API y más.",
  },
  "server-vs-client": {
    title: "Server vs Client Components",
    date: "2026-02-26",
    content:
      "Los Server Components se ejecutan solo en el servidor — zero JS al cliente. Son ideales para data fetching, acceso a DB, y lógica sensible. Los Client Components ('use client') se hidratan en el navegador con interactividad completa: useState, useEffect, event handlers. La clave es usar Server Components por defecto y Client Components solo donde necesitas interactividad.",
  },
  "deploy-workers": {
    title: "Deploy a Cloudflare Workers",
    date: "2026-02-25",
    content:
      "Cloudflare Workers ofrece zero cold starts, edge global en 300+ ciudades, y bindings nativos a KV (key-value), R2 (object storage), D1 (SQL), AI (Workers AI), Vectorize, y más. Con vinext deploy, el build y deploy ocurre en un solo comando.",
  },
  "vite-plugins": {
    title: "Vite Plugin Ecosystem",
    date: "2026-02-24",
    content:
      "Vite tiene un ecosistema rico de plugins. Al correr sobre Vite, vinext puede aprovechar cualquier plugin de Vite — MDX, PWA, SVG components, image optimization, y más. Además, el HMR de Vite es significativamente más rápido que webpack/Turbopack para la mayoría de proyectos.",
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} | Vinext Boilerplate`,
    description: post.content.slice(0, 160),
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    notFound();
  }

  console.log(`\x1b[34m[server]\x1b[0m Rendering post: ${slug}`);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 animate-fade-in">
      <Link
        href="/posts"
        prefetch={false}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        &larr; Back to posts
      </Link>

      <article className="mt-6">
        <time className="text-sm text-muted-foreground font-mono" dateTime={post.date}>
          {post.date}
        </time>
        <h1 className="text-3xl font-bold tracking-tight mt-2 mb-6">
          {post.title}
        </h1>
        <p className="text-muted-foreground leading-relaxed">{post.content}</p>
      </article>

      <div className="mt-8 rounded-lg border border-border bg-card px-4 py-3 flex items-center gap-3">
        <Badge variant="secondary" className="font-mono text-[10px]">
          slug
        </Badge>
        <code className="text-sm font-mono text-muted-foreground">{slug}</code>
        <span className="text-xs text-muted-foreground">
          — extraído de la URL via{" "}
          <code className="font-mono">[slug]/page.tsx</code>
        </span>
      </div>
    </main>
  );
}

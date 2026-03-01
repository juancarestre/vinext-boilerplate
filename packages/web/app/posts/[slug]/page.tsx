import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { localeTag } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

const posts: Record<
  string,
  { date: string; title: { en: string; es: string }; content: { en: string; es: string } }
> = {
  "que-es-vinext": {
    date: "2026-02-27",
    title: { es: "Que es Vinext?", en: "What is Vinext?" },
    content: {
      es: "Vinext es un plugin de Vite que reimplementa la API de Next.js. Permite correr aplicaciones Next.js sobre Vite con deploy a Cloudflare Workers. Cubre ~94% de la API surface de Next.js 16, incluyendo App Router, Pages Router, RSC, Server Actions, ISR, Metadata API y más.",
      en: "Vinext is a Vite plugin that reimplements the Next.js API. It lets you run Next.js apps on top of Vite with Cloudflare Workers deploy. It covers ~94% of Next.js 16 API surface, including App Router, Pages Router, RSC, Server Actions, ISR, Metadata API, and more.",
    },
  },
  "server-vs-client": {
    date: "2026-02-26",
    title: { es: "Server vs Client Components", en: "Server vs Client Components" },
    content: {
      es: "Los Server Components se ejecutan solo en el servidor — zero JS al cliente. Son ideales para data fetching, acceso a DB, y lógica sensible. Los Client Components ('use client') se hidratan en el navegador con interactividad completa: useState, useEffect, event handlers. La clave es usar Server Components por defecto y Client Components solo donde necesitas interactividad.",
      en: "Server Components run only on the server, sending zero JS to the client. They are ideal for data fetching, DB access, and sensitive logic. Client Components ('use client') hydrate in the browser with full interactivity: useState, useEffect, and event handlers. The key is to use Server Components by default and Client Components only where interactivity is needed.",
    },
  },
  "deploy-workers": {
    date: "2026-02-25",
    title: { es: "Deploy a Cloudflare Workers", en: "Deploy to Cloudflare Workers" },
    content: {
      es: "Cloudflare Workers ofrece zero cold starts, edge global en 300+ ciudades, y bindings nativos a KV (key-value), R2 (object storage), D1 (SQL), AI (Workers AI), Vectorize, y más. Con vinext deploy, el build y deploy ocurre en un solo comando.",
      en: "Cloudflare Workers offers zero cold starts, global edge in 300+ cities, and native bindings to KV (key-value), R2 (object storage), D1 (SQL), AI (Workers AI), Vectorize, and more. With vinext deploy, build and deploy happen in a single command.",
    },
  },
  "vite-plugins": {
    date: "2026-02-24",
    title: { es: "Vite Plugin Ecosystem", en: "Vite Plugin Ecosystem" },
    content: {
      es: "Vite tiene un ecosistema rico de plugins. Al correr sobre Vite, vinext puede aprovechar cualquier plugin de Vite — MDX, PWA, SVG components, image optimization, y más. Además, el HMR de Vite es significativamente más rápido que webpack/Turbopack para la mayoría de proyectos.",
      en: "Vite has a rich plugin ecosystem. By running on top of Vite, vinext can use virtually any Vite plugin, including MDX, PWA, SVG components, image optimization, and more. Also, Vite's HMR is significantly faster than webpack/Turbopack for most projects.",
    },
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return { title: "Post not found" };
  const locale = await getLocale();
  return {
    title: `${post.title[locale]} | Vinext Boilerplate`,
    description: post.content[locale].slice(0, 160),
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const isEs = locale === "es";
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
        {isEs ? "\u2190 Volver a posts" : "\u2190 Back to posts"}
      </Link>

      <article className="mt-6">
        <time className="text-sm text-muted-foreground font-mono" dateTime={post.date}>
          {new Date(post.date).toLocaleDateString(localeTag(locale))}
        </time>
        <h1 className="text-3xl font-bold tracking-tight mt-2 mb-6">
          {post.title[locale]}
        </h1>
        <p className="text-muted-foreground leading-relaxed">{post.content[locale]}</p>
      </article>

      <div className="mt-8 rounded-lg border border-border bg-card px-4 py-3 flex items-center gap-3">
        <Badge variant="secondary" className="font-mono text-[10px]">
          slug
        </Badge>
        <code className="text-sm font-mono text-muted-foreground">{slug}</code>
        <span className="text-xs text-muted-foreground">
          {isEs ? "— extraído de la URL vía " : "— extracted from the URL via "}
          <code className="font-mono">[slug]/page.tsx</code>
        </span>
      </div>
    </main>
  );
}

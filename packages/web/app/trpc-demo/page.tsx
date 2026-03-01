import { api } from "@/lib/trpc";
import { PageShell, SectionExplainer } from "@/components/page-shell";
import UserManager from "./user-manager";
import PostExplorer from "./post-explorer";
import TransportSwitch from "./transport-switch";
import { getLocale } from "@/lib/i18n-server";

export const metadata = {
  title: "tRPC Demo | Vinext Boilerplate",
};

export default async function TrpcDemoPage() {
  const locale = await getLocale();
  const isEs = locale === "es";
  let users: Awaited<ReturnType<typeof api.users.list.query>> = [];
  let posts: Awaited<ReturnType<typeof api.posts.list.query>> = [];
  let loadError = false;

  try {
    [users, posts] = await Promise.all([
      api.users.list.query(),
      api.posts.list.query(),
    ]);
  } catch (error) {
    loadError = true;
    console.error("[trpc-demo] Failed to fetch server-side data", {
      message: error instanceof Error ? error.message : String(error),
    });
  }

  return (
    <PageShell
      title="tRPC — Type-safe API"
      locale={locale}
      accentColor="oklch(0.7 0.14 230)"
      description={
        <>
          {isEs ? "Este frontend llama al backend Hono+tRPC Worker con " : "This frontend calls the Hono+tRPC Worker backend with "}
          <strong>{isEs ? "type safety end-to-end" : "end-to-end type safety"}</strong>.
          {isEs
            ? " Los tipos se comparten vía el monorepo, sin codegen ni schemas duplicados."
            : " Types are shared through the monorepo, without codegen or duplicated schemas."}
        </>
      }
    >
      {/* Server-rendered stats */}
      <section className="mb-8">
        {loadError ? (
          <div className="mb-4 rounded-lg border border-amber/40 bg-amber/10 px-3 py-2 text-sm text-amber">
            <p>
              {isEs
                ? "No se pudo cargar el API en server render. Revisa `VITE_API_URL` y la disponibilidad de `https://vinext-api.peto.dev`."
                : "Failed to load the API during server render. Check `VITE_API_URL` and the availability of `https://vinext-api.peto.dev`."}
            </p>
            <p className="mt-2">
              <a className="underline decoration-amber/60 underline-offset-2" href="/trpc-demo">
                {isEs ? "Reintentar carga" : "Retry load"}
              </a>
            </p>
          </div>
        ) : null}
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          {isEs ? "Server Component — pre-renderizado" : "Server Component — pre-rendered"}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {isEs ? "Datos obtenidos en el servidor vía " : "Data fetched on the server via "}
          <code className="font-mono text-sky bg-sky/10 px-1.5 py-0.5 rounded text-xs">
            api.users.list.query()
          </code>{" "}
          {isEs ? "— cero JS al cliente para esta sección." : "— zero client JS for this section."}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-card p-5 text-center">
            <div className="text-3xl font-extrabold text-emerald tabular-nums">
              {users.length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{isEs ? "Usuarios" : "Users"}</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 text-center">
            <div className="text-3xl font-extrabold text-sky tabular-nums">
              {posts.length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{isEs ? "Posts" : "Posts"}</div>
          </div>
        </div>
      </section>

      {/* Client interactive section */}
      <section className="mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          {isEs ? "Client Components — React Query + tRPC" : "Client Components — React Query + tRPC"}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {isEs ? "Componentes interactivos con " : "Interactive components with "}
          <code className="font-mono text-violet bg-violet/10 px-1.5 py-0.5 rounded text-xs">
            trpc.users.list.useQuery()
          </code>{" "}
          {isEs ? "— cache, refetch automático, mutations type-safe." : "— caching, automatic refetch, type-safe mutations."}
        </p>

        <TransportSwitch locale={locale} />
        <UserManager locale={locale} />
        <div className="mt-3">
          <PostExplorer locale={locale} />
        </div>
      </section>

      <SectionExplainer
        locale={locale}
        items={[
          <>
            <strong>{isEs ? "Type sharing en monorepo" : "Monorepo type sharing"}</strong> —{" "}
            <code className="font-mono text-xs">AppRouter</code>{" "}
            {isEs ? "importado del paquete API, modelos Zod del paquete shared" : "imported from the API package, with Zod models from the shared package"}
          </>,
          <>
            <strong>Server Components</strong> —{" "}
            {isEs ? "datos pre-renderizados con el cliente tRPC vanilla, cero bundle JS" : "pre-rendered data with the vanilla tRPC client, zero JS bundle"}
          </>,
          <>
            <strong>Client Components</strong> —{" "}
            <code className="font-mono text-xs">@trpc/react-query</code> para
            {isEs ? " queries/mutations interactivas" : " interactive queries/mutations"}
          </>,
          <>
            <strong>{isEs ? "Validación compartida" : "Shared validation"}</strong> — schemas Zod en{" "}
            <code className="font-mono text-xs">@vinext-boilerplate/shared</code>{" "}
            {isEs ? "usados en API y frontend" : "used in API and frontend"}
          </>,
          <>
            <strong>{isEs ? "Hono + tRPC en Workers" : "Hono + tRPC on Workers"}</strong> —{" "}
            {isEs ? "API corriendo como Cloudflare Worker separado" : "API running as a separate Cloudflare Worker"}
          </>,
        ]}
      />
    </PageShell>
  );
}

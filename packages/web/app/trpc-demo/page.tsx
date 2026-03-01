import { api } from "@/lib/trpc";
import { PageShell, SectionExplainer } from "@/components/page-shell";
import UserManager from "./user-manager";
import PostExplorer from "./post-explorer";

export const metadata = {
  title: "tRPC Demo | Vinext Boilerplate",
};

export default async function TrpcDemoPage() {
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
      accentColor="oklch(0.7 0.14 230)"
      description={
        <>
          Este frontend llama al backend Hono+tRPC Worker con{" "}
          <strong>type safety end-to-end</strong>. Los tipos se comparten via el
          monorepo — sin codegen, sin schemas duplicados.
        </>
      }
    >
      {/* Server-rendered stats */}
      <section className="mb-8">
        {loadError ? (
          <div className="mb-4 rounded-lg border border-amber/40 bg-amber/10 px-3 py-2 text-sm text-amber">
            <p>
              No se pudo cargar el API en server render. Revisa `VITE_API_URL` y la
              disponibilidad de `https://vinext-api.peto.dev`.
            </p>
            <p className="mt-2">
              <a className="underline decoration-amber/60 underline-offset-2" href="/trpc-demo">
                Reintentar carga
              </a>
            </p>
          </div>
        ) : null}
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Server Component — pre-renderizado
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Datos obtenidos en el servidor via{" "}
          <code className="font-mono text-sky bg-sky/10 px-1.5 py-0.5 rounded text-xs">
            api.users.list.query()
          </code>{" "}
          — zero JS al cliente para esta sección.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-card p-5 text-center">
            <div className="text-3xl font-extrabold text-emerald tabular-nums">
              {users.length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Usuarios</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 text-center">
            <div className="text-3xl font-extrabold text-sky tabular-nums">
              {posts.length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Posts</div>
          </div>
        </div>
      </section>

      {/* Client interactive section */}
      <section className="mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Client Components — React Query + tRPC
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Componentes interactivos con{" "}
          <code className="font-mono text-violet bg-violet/10 px-1.5 py-0.5 rounded text-xs">
            trpc.users.list.useQuery()
          </code>{" "}
          — cache, refetch automático, mutations type-safe.
        </p>

        <UserManager />
        <div className="mt-3">
          <PostExplorer />
        </div>
      </section>

      <SectionExplainer
        items={[
          <>
            <strong>Monorepo type sharing</strong> —{" "}
            <code className="font-mono text-xs">AppRouter</code> importado del paquete API,
            modelos Zod del paquete shared
          </>,
          <>
            <strong>Server Components</strong> — datos pre-renderizados con el
            vanilla tRPC client, zero bundle JS
          </>,
          <>
            <strong>Client Components</strong> —{" "}
            <code className="font-mono text-xs">@trpc/react-query</code> para
            queries/mutations interactivas
          </>,
          <>
            <strong>Validación compartida</strong> — schemas Zod en{" "}
            <code className="font-mono text-xs">@vinext-boilerplate/shared</code>{" "}
            usados en API y frontend
          </>,
          <>
            <strong>Hono + tRPC en Workers</strong> — API corriendo como
            Cloudflare Worker separado
          </>,
        ]}
      />
    </PageShell>
  );
}

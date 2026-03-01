import Link from "next/link";
import { PageShell, SectionExplainer } from "@/components/page-shell";

let lastFetchTime = 0;

async function getServerData() {
  const start = performance.now();

  const data = {
    serverTime: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform,
    pid: process.pid,
    memoryUsage: Math.round(process.memoryUsage().rss / 1024 / 1024),
    env: process.env.NODE_ENV ?? "unknown",
  };

  await new Promise((r) => setTimeout(r, 100));

  const queryTime = Math.round(performance.now() - start);
  const now = Date.now();

  if (now - lastFetchTime > 500) {
    lastFetchTime = now;
    console.log(
      `\x1b[36m[server]\x1b[0m Fetching server data... done in \x1b[33m${queryTime}ms\x1b[0m (pid: ${data.pid})`
    );
  }

  return { ...data, queryTime };
}

export const metadata = {
  title: "Server Component | Vinext Boilerplate",
};

export default async function ServerExamplePage() {
  const data = await getServerData();

  const rows = [
    { label: "Hora del servidor", value: data.serverTime },
    { label: "Node.js version", value: data.nodeVersion },
    { label: "Plataforma", value: data.platform },
    { label: "Process ID", value: String(data.pid) },
    { label: "Memoria RSS", value: `${data.memoryUsage} MB` },
    { label: "NODE_ENV", value: data.env },
    { label: "Tiempo de query", value: `${data.queryTime} ms` },
  ];

  return (
    <PageShell
      title="Server Component"
      accentColor="oklch(0.7 0.17 160)"
      description={
        <>
          Este componente se ejecuta <strong>solo en el servidor</strong>. No se
          envía JavaScript al navegador para este componente.
        </>
      }
    >
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Datos obtenidos en el servidor
      </h2>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between px-4 py-3 ${
              i < rows.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <span className="text-sm text-muted-foreground">{row.label}</span>
            <span className="text-sm font-mono">{row.value}</span>
          </div>
        ))}
      </div>

      <SectionExplainer
        title="Por que Server Component?"
        items={[
          <>Acceso directo a <code className="font-mono text-xs">process.env</code>, filesystem, base de datos</>,
          <>Zero KB de JavaScript enviado al cliente para este componente</>,
          <>Datos sensibles (API keys, queries) nunca llegan al navegador</>,
          <>Puede usar <code className="font-mono text-xs">async/await</code> directamente en el componente</>,
          <>Recarga la pagina para ver como cambia la hora y el PID</>,
        ]}
      />

      <div className="mt-6">
        <Link
          href="/client-example"
          prefetch={false}
          className="text-sm text-primary hover:underline"
        >
          Ver Client Component &rarr;
        </Link>
      </div>
    </PageShell>
  );
}

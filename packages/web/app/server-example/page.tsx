import Link from "next/link";
import { PageShell, SectionExplainer } from "@/components/page-shell";
import { getLocale } from "@/lib/i18n-server";

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
  const locale = await getLocale();
  const isEs = locale === "es";
  const data = await getServerData();

  const rows = [
    { label: isEs ? "Hora del servidor" : "Server time", value: data.serverTime },
    { label: "Node.js version", value: data.nodeVersion },
    { label: isEs ? "Plataforma" : "Platform", value: data.platform },
    { label: "Process ID", value: String(data.pid) },
    { label: isEs ? "Memoria RSS" : "RSS memory", value: `${data.memoryUsage} MB` },
    { label: "NODE_ENV", value: data.env },
    { label: isEs ? "Tiempo de query" : "Query time", value: `${data.queryTime} ms` },
  ];

  return (
    <PageShell
      title="Server Component"
      locale={locale}
      accentColor="oklch(0.7 0.17 160)"
      description={
        <>
          {isEs ? "Este componente se ejecuta " : "This component runs "}
          <strong>{isEs ? "solo en el servidor" : "only on the server"}</strong>.
          {isEs
            ? " No se envía JavaScript al navegador para este componente."
            : " No JavaScript is sent to the browser for this component."}
        </>
      }
    >
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        {isEs ? "Datos obtenidos en el servidor" : "Data fetched on the server"}
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
        locale={locale}
        title={isEs ? "¿Por qué Server Component?" : "Why Server Component?"}
        items={[
          <>
            {isEs ? "Acceso directo a " : "Direct access to "}
            <code className="font-mono text-xs">process.env</code>
            {isEs ? ", filesystem y base de datos" : ", filesystem, and databases"}
          </>,
          <>{isEs ? "Cero KB de JavaScript enviado al cliente para este componente" : "Zero KB of JavaScript sent to the client for this component"}</>,
          <>{isEs ? "Datos sensibles (API keys, queries) nunca llegan al navegador" : "Sensitive data (API keys, queries) never reaches the browser"}</>,
          <>
            {isEs ? "Puedes usar " : "You can use "}
            <code className="font-mono text-xs">async/await</code>
            {isEs ? " directamente en el componente" : " directly in the component"}
          </>,
          <>{isEs ? "Recarga la página para ver cómo cambia la hora y el PID" : "Reload the page to see time and PID change"}</>,
        ]}
      />

      <div className="mt-6">
        <Link
          href="/client-example"
          prefetch={false}
          className="text-sm text-primary hover:underline"
        >
          {isEs ? "Ver Client Component \u2192" : "See Client Component \u2192"}
        </Link>
      </div>
    </PageShell>
  );
}

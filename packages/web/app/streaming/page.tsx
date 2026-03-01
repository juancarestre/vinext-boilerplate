import { Suspense } from "react";
import { PageShell, SectionExplainer } from "@/components/page-shell";

export const metadata = {
  title: "Streaming SSR | Vinext Boilerplate",
};

async function FastData() {
  await new Promise((r) => setTimeout(r, 200));
  return (
    <div className="rounded-lg border border-emerald/20 bg-emerald/[0.06] p-5">
      <h3 className="text-sm font-semibold text-emerald mb-1">
        Base de datos (200ms)
      </h3>
      <p className="text-sm text-emerald/80">
        Usuarios activos: <strong className="text-emerald">1,247</strong>
      </p>
      <p className="text-xs text-emerald/50 mt-2 font-mono">
        {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}

async function MediumData() {
  await new Promise((r) => setTimeout(r, 1000));
  return (
    <div className="rounded-lg border border-sky/20 bg-sky/[0.06] p-5">
      <h3 className="text-sm font-semibold text-sky mb-1">
        API externa (1s)
      </h3>
      <p className="text-sm text-sky/80">
        Revenue del mes: <strong className="text-sky">$48,230</strong>
      </p>
      <p className="text-xs text-sky/50 mt-2 font-mono">
        {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}

async function SlowData() {
  await new Promise((r) => setTimeout(r, 3000));
  return (
    <div className="rounded-lg border border-violet/20 bg-violet/[0.06] p-5">
      <h3 className="text-sm font-semibold text-violet mb-1">
        ML inference (3s)
      </h3>
      <p className="text-sm text-violet/80">
        Churn prediction: <strong className="text-violet">12.4%</strong> risk
      </p>
      <p className="text-xs text-violet/50 mt-2 font-mono">
        {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}

function Skeleton({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-pulse">
      <h3 className="text-sm font-semibold text-muted-foreground mb-2">
        {label}
      </h3>
      <div className="h-4 bg-muted rounded w-3/5" />
    </div>
  );
}

export default function StreamingPage() {
  return (
    <PageShell
      title="Streaming SSR"
      accentColor="oklch(0.7 0.14 230)"
      description={
        <>
          Cada sección se renderiza independientemente con{" "}
          <code className="font-mono text-xs">&lt;Suspense&gt;</code>. El HTML
          se envía al navegador progresivamente — no espera a que todo esté
          listo.
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <Suspense fallback={<Skeleton label="Cargando datos de DB..." />}>
          <FastData />
        </Suspense>

        <Suspense fallback={<Skeleton label="Cargando API externa..." />}>
          <MediumData />
        </Suspense>

        <Suspense fallback={<Skeleton label="Cargando ML inference..." />}>
          <SlowData />
        </Suspense>
      </div>

      <SectionExplainer
        items={[
          <><code className="font-mono text-xs">&lt;Suspense&gt;</code> wrappea cada sección async independientemente</>,
          <>El shell HTML se envía inmediatamente al navegador</>,
          <>Cada sección aparece cuando sus datos están listos (200ms, 1s, 3s)</>,
          <>Los skeletons se muestran como fallback mientras se resuelve cada promise</>,
          <>No hay waterfall — las 3 fuentes de datos cargan en paralelo</>,
        ]}
      />
    </PageShell>
  );
}

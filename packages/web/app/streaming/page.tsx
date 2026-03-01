import { Suspense } from "react";
import { PageShell, SectionExplainer } from "@/components/page-shell";
import { localeTag, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const metadata = {
  title: "Streaming SSR | Vinext Boilerplate",
};

async function FastData({ locale }: { locale: Locale }) {
  const isEs = locale === "es";
  await new Promise((r) => setTimeout(r, 200));
  return (
    <div className="rounded-lg border border-emerald/20 bg-emerald/[0.06] p-5">
      <h3 className="text-sm font-semibold text-emerald mb-1">
        {isEs ? "Base de datos (200ms)" : "Database (200ms)"}
      </h3>
      <p className="text-sm text-emerald/80">
        {isEs ? "Usuarios activos: " : "Active users: "}
        <strong className="text-emerald">1,247</strong>
      </p>
      <p className="text-xs text-emerald/50 mt-2 font-mono">
        {new Date().toLocaleTimeString(localeTag(locale))}
      </p>
    </div>
  );
}

async function MediumData({ locale }: { locale: Locale }) {
  const isEs = locale === "es";
  await new Promise((r) => setTimeout(r, 1000));
  return (
    <div className="rounded-lg border border-sky/20 bg-sky/[0.06] p-5">
      <h3 className="text-sm font-semibold text-sky mb-1">
        {isEs ? "API externa (1s)" : "External API (1s)"}
      </h3>
      <p className="text-sm text-sky/80">
        {isEs ? "Ingresos del mes: " : "Monthly revenue: "}
        <strong className="text-sky">$48,230</strong>
      </p>
      <p className="text-xs text-sky/50 mt-2 font-mono">
        {new Date().toLocaleTimeString(localeTag(locale))}
      </p>
    </div>
  );
}

async function SlowData({ locale }: { locale: Locale }) {
  const isEs = locale === "es";
  await new Promise((r) => setTimeout(r, 3000));
  return (
    <div className="rounded-lg border border-violet/20 bg-violet/[0.06] p-5">
      <h3 className="text-sm font-semibold text-violet mb-1">
        ML inference (3s)
      </h3>
      <p className="text-sm text-violet/80">
        {isEs ? "Predicción de churn: " : "Churn prediction: "}
        <strong className="text-violet">12.4%</strong> {isEs ? "riesgo" : "risk"}
      </p>
      <p className="text-xs text-violet/50 mt-2 font-mono">
        {new Date().toLocaleTimeString(localeTag(locale))}
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

export default async function StreamingPage() {
  const locale = await getLocale();
  const isEs = locale === "es";

  return (
    <PageShell
      title="Streaming SSR"
      locale={locale}
      accentColor="oklch(0.7 0.14 230)"
      description={
        <>
          {isEs ? "Cada sección se renderiza de forma independiente con " : "Each section renders independently with "}
          <code className="font-mono text-xs">&lt;Suspense&gt;</code>. El HTML
          {isEs
            ? " se envía al navegador progresivamente — no espera a que todo esté listo."
            : " is streamed progressively to the browser without waiting for everything to finish."}
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <Suspense fallback={<Skeleton label={isEs ? "Cargando datos de DB..." : "Loading DB data..."} />}>
          <FastData locale={locale} />
        </Suspense>

        <Suspense fallback={<Skeleton label={isEs ? "Cargando API externa..." : "Loading external API..."} />}>
          <MediumData locale={locale} />
        </Suspense>

        <Suspense fallback={<Skeleton label={isEs ? "Cargando inferencia ML..." : "Loading ML inference..."} />}>
          <SlowData locale={locale} />
        </Suspense>
      </div>

      <SectionExplainer
        locale={locale}
        items={[
          <>
            <code className="font-mono text-xs">&lt;Suspense&gt;</code>
            {isEs ? " envuelve cada sección async de forma independiente" : " wraps each async section independently"}
          </>,
          <>{isEs ? "El shell HTML se envía inmediatamente al navegador" : "The HTML shell is sent to the browser immediately"}</>,
          <>{isEs ? "Cada sección aparece cuando sus datos están listos (200ms, 1s, 3s)" : "Each section appears when its data is ready (200ms, 1s, 3s)"}</>,
          <>{isEs ? "Los skeletons se muestran como fallback mientras se resuelve cada promesa" : "Skeletons are shown as fallback while each promise resolves"}</>,
          <>{isEs ? "No hay waterfall: las 3 fuentes de datos cargan en paralelo" : "No waterfall: all 3 data sources load in parallel"}</>,
        ]}
      />
    </PageShell>
  );
}

import { PageShell, SectionExplainer } from "@/components/page-shell";
import RiskyComponent from "./risky-component";
import { getLocale } from "@/lib/i18n-server";

export const metadata = {
  title: "Error Boundary | Vinext Boilerplate",
};

export default async function ErrorExamplePage() {
  const locale = await getLocale();
  const isEs = locale === "es";

  return (
    <PageShell
      title="Error Boundary"
      locale={locale}
      accentColor="oklch(0.65 0.2 15)"
      description={
        <>
          <code className="font-mono text-xs">error.tsx</code>
          {isEs
            ? " captura errores en runtime y muestra un fallback con opción de reintentar, sin romper el resto de la app."
            : " catches runtime errors and shows a fallback with retry, without breaking the rest of the app."}
        </>
      }
    >
      <RiskyComponent locale={locale} />

      <SectionExplainer
        locale={locale}
        items={[
          <>
            <code className="font-mono text-xs">error.tsx</code>
            {isEs
              ? " actúa como React Error Boundary automático"
              : " acts as an automatic React Error Boundary"}
          </>,
          <>
            {isEs ? "Debe ser " : "It must be "}
            <code className="font-mono text-xs">&quot;use client&quot;</code>
            {isEs ? " porque React necesita hidratarlo" : " because React needs to hydrate it"}
          </>,
          <>
            {isEs ? "Recibe " : "It receives "}
            <code className="font-mono text-xs">error</code> {isEs ? "y" : "and"}{" "}
            <code className="font-mono text-xs">reset</code>
            {isEs ? " (función para reintentar)" : " (retry function)"}
          </>,
          <>{isEs ? "Solo afecta al segmento de ruta; el layout y otras páginas siguen funcionando" : "It only affects the route segment; layout and other pages keep working"}</>,
          <>{isEs ? 'Presiona "Lanzar error" para verlo en acción' : 'Click "Throw error" to see it in action'}</>,
        ]}
      />
    </PageShell>
  );
}

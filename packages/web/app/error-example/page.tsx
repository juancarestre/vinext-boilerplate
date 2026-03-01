import { PageShell, SectionExplainer } from "@/components/page-shell";
import RiskyComponent from "./risky-component";

export const metadata = {
  title: "Error Boundary | Vinext Boilerplate",
};

export default function ErrorExamplePage() {
  return (
    <PageShell
      title="Error Boundary"
      accentColor="oklch(0.65 0.2 15)"
      description={
        <>
          <code className="font-mono text-xs">error.tsx</code> captura errores
          en runtime y muestra un fallback con opción de reintentar — sin romper
          el resto de la app.
        </>
      }
    >
      <RiskyComponent />

      <SectionExplainer
        items={[
          <><code className="font-mono text-xs">error.tsx</code> actúa como React Error Boundary automático</>,
          <>Debe ser <code className="font-mono text-xs">&quot;use client&quot;</code> porque React necesita hidratarlo</>,
          <>Recibe <code className="font-mono text-xs">error</code> y <code className="font-mono text-xs">reset</code> (función para reintentar)</>,
          <>Solo afecta al segmento de ruta — el layout y otras páginas siguen funcionando</>,
          <>Presiona &quot;Lanzar error&quot; para ver el boundary en acción</>,
        ]}
      />
    </PageShell>
  );
}

import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import Counter from "./counter";

export const metadata = {
  title: "Client Component | Vinext Boilerplate",
};

export default function ClientExamplePage() {
  return (
    <PageShell
      title="Client Component"
      accentColor="oklch(0.65 0.18 295)"
      description={
        <>
          Este componente tiene <code className="font-mono text-xs">&quot;use client&quot;</code>{" "}
          — se hidrata en el <strong>navegador</strong> con interactividad completa.
        </>
      }
    >
      <Counter />

      <div className="mt-6">
        <Link
          href="/server-example"
          prefetch={false}
          className="text-sm text-primary hover:underline"
        >
          &larr; Ver Server Component
        </Link>
      </div>
    </PageShell>
  );
}

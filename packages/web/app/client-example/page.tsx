import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import Counter from "./counter";
import { getLocale } from "@/lib/i18n-server";

export const metadata = {
  title: "Client Component | Vinext Boilerplate",
};

export default async function ClientExamplePage() {
  const locale = await getLocale();
  const isEs = locale === "es";

  return (
    <PageShell
      title="Client Component"
      locale={locale}
      accentColor="oklch(0.65 0.18 295)"
      description={
        <>
          {isEs ? "Este componente tiene " : "This component has "}
          <code className="font-mono text-xs">&quot;use client&quot;</code>{" "}
          {isEs
            ? "— se hidrata en el "
            : "— it hydrates in the "}
          <strong>{isEs ? "navegador" : "browser"}</strong>
          {isEs ? " con interactividad completa." : " with full interactivity."}
        </>
      }
    >
      <Counter locale={locale} />

      <div className="mt-6">
        <Link
          href="/server-example"
          prefetch={false}
          className="text-sm text-primary hover:underline"
        >
          {isEs ? "\u2190 Ver Server Component" : "\u2190 See Server Component"}
        </Link>
      </div>
    </PageShell>
  );
}

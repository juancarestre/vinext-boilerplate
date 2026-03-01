import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function PageShell({
  children,
  title,
  description,
  accentColor,
  backHref = "/",
}: {
  children: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  accentColor?: string;
  backHref?: string;
}) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 animate-fade-in">
      <Link
        href={backHref}
        prefetch={false}
        className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
        Back
      </Link>

      <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>

      {description && (
        <div
          className="rounded-lg border px-4 py-3 text-sm mb-8"
          style={{
            borderColor: accentColor ? `${accentColor}33` : undefined,
            background: accentColor ? `${accentColor}0a` : undefined,
            color: accentColor,
          }}
        >
          {description}
        </div>
      )}

      {children}
    </main>
  );
}

export function SectionExplainer({
  title = "Que demuestra esto?",
  items,
}: {
  title?: string;
  items: React.ReactNode[];
}) {
  return (
    <section className="mt-10 rounded-lg border border-border bg-card/50 p-5">
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      <ul className="space-y-1.5 text-sm text-muted-foreground">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-primary mt-0.5 shrink-0">&#x2023;</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

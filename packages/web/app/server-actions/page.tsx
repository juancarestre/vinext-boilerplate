import { PageShell, SectionExplainer } from "@/components/page-shell";
import { getMessages, deleteMessage } from "./actions";
import GuestbookForm from "./guestbook-form";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { localeTag } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const metadata = {
  title: "Server Actions | Vinext Boilerplate",
};

export default async function ServerActionsPage() {
  const locale = await getLocale();
  const isEs = locale === "es";
  const messages = await getMessages();

  return (
    <PageShell
      title="Server Actions"
      locale={locale}
      accentColor="oklch(0.75 0.16 75)"
      description={
        <>
          {isEs ? "Formularios que llaman funciones " : "Forms that call "}
          <code className="font-mono text-xs">&quot;use server&quot;</code>{" "}
          {isEs
            ? "directamente. Sin API routes, sin fetch manual. El servidor re-renderiza la página automáticamente."
            : "functions directly. No API routes, no manual fetch. The server automatically re-renders the page."}
        </>
      }
    >
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Guestbook
      </h2>

      <GuestbookForm locale={locale} />

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {messages.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground text-center">
            {isEs ? "No hay mensajes aún." : "No messages yet."}
          </p>
        ) : (
          messages.map((msg, i) => (
            <div
              key={msg.id}
              className={`flex items-center justify-between px-4 py-3 ${
                i < messages.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="min-w-0">
                <span className="text-sm font-medium">{msg.author}</span>
                <span className="text-muted-foreground mx-2">—</span>
                <span className="text-sm">{msg.text}</span>
                <span className="text-xs text-muted-foreground ml-3 font-mono">
                  {new Date(msg.createdAt).toLocaleTimeString(localeTag(locale))}
                </span>
              </div>
              {msg.id !== "1" && (
                <form action={deleteMessage}>
                  <input type="hidden" name="id" value={msg.id} />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </form>
              )}
            </div>
          ))
        )}
      </div>

      <SectionExplainer
        locale={locale}
        items={[
          <>
            <code className="font-mono text-xs">&quot;use server&quot;</code>
            {isEs
              ? " convierte funciones en endpoints automáticos"
              : " turns functions into automatic endpoints"}
          </>,
          <>
            {isEs ? "Los forms usan " : "Forms use "}
            <code className="font-mono text-xs">action=&#123;serverFunction&#125;</code>
            {isEs ? " sin JavaScript manual" : " without manual JavaScript"}
          </>,
          <>{isEs ? "Tras ejecutar la action, la página se re-renderiza con datos frescos" : "After executing the action, the page re-renders with fresh data"}</>,
          <>{isEs ? "Funciona con progressive enhancement (sin JS del cliente también)" : "Works with progressive enhancement (also without client JS)"}</>,
          <>{isEs ? "Los logs aparecen en la terminal del servidor, no en el navegador" : "Logs appear in the server terminal, not the browser"}</>,
        ]}
      />
    </PageShell>
  );
}

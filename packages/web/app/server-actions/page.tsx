import { PageShell, SectionExplainer } from "@/components/page-shell";
import { getMessages, deleteMessage } from "./actions";
import GuestbookForm from "./guestbook-form";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export const metadata = {
  title: "Server Actions | Vinext Boilerplate",
};

export default async function ServerActionsPage() {
  const messages = await getMessages();

  return (
    <PageShell
      title="Server Actions"
      accentColor="oklch(0.75 0.16 75)"
      description={
        <>
          Formularios que llaman funciones{" "}
          <code className="font-mono text-xs">&quot;use server&quot;</code>{" "}
          directamente. Sin API routes, sin fetch manual. El servidor
          re-renderiza la página automáticamente.
        </>
      }
    >
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Guestbook
      </h2>

      <GuestbookForm />

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {messages.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground text-center">
            No hay mensajes aún.
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
                  {new Date(msg.createdAt).toLocaleTimeString()}
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
        items={[
          <><code className="font-mono text-xs">&quot;use server&quot;</code> convierte funciones en endpoints automáticos</>,
          <>Los forms usan <code className="font-mono text-xs">action=&#123;serverFunction&#125;</code> sin JavaScript manual</>,
          <>Tras ejecutar la action, la página se re-renderiza con datos frescos</>,
          <>Funciona con progressive enhancement (sin JS del cliente también)</>,
          <>Los logs aparecen en la terminal del servidor, no en el navegador</>,
        ]}
      />
    </PageShell>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getLocale } from "@/lib/i18n-server";

export default async function PostNotFound() {
  const locale = await getLocale();
  const isEs = locale === "es";

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="text-3xl font-bold mb-2">
        {isEs ? "Post no encontrado" : "Post not found"}
      </h1>
      <p className="text-muted-foreground mb-6">
        {isEs
          ? "El slug no coincide con ningún post existente."
          : "The slug does not match any existing post."}
      </p>
      <Button variant="outline" asChild>
        <Link href="/posts" prefetch={false}>
          <ArrowLeft className="size-3.5" />
          {isEs ? "Volver a posts" : "Back to posts"}
        </Link>
      </Button>
    </main>
  );
}

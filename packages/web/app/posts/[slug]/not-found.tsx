import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PostNotFound() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="text-3xl font-bold mb-2">Post no encontrado</h1>
      <p className="text-muted-foreground mb-6">
        El slug no coincide con ningún post existente.
      </p>
      <Button variant="outline" asChild>
        <Link href="/posts" prefetch={false}>
          <ArrowLeft className="size-3.5" />
          Volver a posts
        </Link>
      </Button>
    </main>
  );
}

"use client";

import { useRef } from "react";
import { addMessage } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import type { Locale } from "@/lib/i18n";

export default function GuestbookForm({ locale }: { locale: Locale }) {
  const isEs = locale === "es";
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await addMessage(formData);
    formRef.current?.reset();
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 mb-4"
    >
      <Input name="author" placeholder={isEs ? "Tu nombre" : "Your name"} required />
      <Input name="text" placeholder={isEs ? "Escribe un mensaje..." : "Write a message..."} required />
      <Button type="submit" size="sm" className="self-start">
        <Send className="size-3.5" />
        {isEs ? "Enviar mensaje" : "Send message"}
      </Button>
    </form>
  );
}

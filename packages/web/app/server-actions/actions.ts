"use server";

// Server Actions — funciones que se ejecutan en el servidor
// pero se pueden llamar directamente desde el cliente (sin API routes)

export type Message = {
  id: string;
  text: string;
  author: string;
  createdAt: string;
};

// Almacén en memoria (en producción sería D1, KV, etc.)
const messages: Message[] = [
  {
    id: "1",
    text: "Bienvenido al guestbook de vinext!",
    author: "Sistema",
    createdAt: new Date().toISOString(),
  },
];

export async function getMessages(): Promise<Message[]> {
  // Simula latencia de DB
  await new Promise((r) => setTimeout(r, 50));
  return [...messages].reverse();
}

export async function addMessage(formData: FormData): Promise<void> {
  const text = formData.get("text") as string;
  const author = formData.get("author") as string;

  if (!text?.trim() || !author?.trim()) {
    throw new Error("Text and author are required");
  }

  console.log(
    `\x1b[33m[action]\x1b[0m addMessage: "${text}" by ${author}`
  );

  messages.push({
    id: String(Date.now()),
    text: text.trim(),
    author: author.trim(),
    createdAt: new Date().toISOString(),
  });

  // Simula escritura a DB
  await new Promise((r) => setTimeout(r, 100));
}

export async function deleteMessage(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  const index = messages.findIndex((m) => m.id === id);

  if (index !== -1) {
    console.log(
      `\x1b[33m[action]\x1b[0m deleteMessage: id=${id}`
    );
    messages.splice(index, 1);
  }
}

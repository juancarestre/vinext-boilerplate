import { z } from "zod";

// ---------- Schemas ----------

export const MessageSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Mensaje no puede estar vacío"),
  author: z.string().min(1, "Autor requerido"),
  createdAt: z.string().datetime(),
});

export const CreateMessageSchema = MessageSchema.omit({
  id: true,
  createdAt: true,
});

// ---------- Types ----------

export type Message = z.infer<typeof MessageSchema>;
export type CreateMessage = z.infer<typeof CreateMessageSchema>;

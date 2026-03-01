import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import {
  CreateMessageSchema,
  type Message,
} from "@vinext-boilerplate/shared";

// In-memory store
const messages: Map<string, Message> = new Map([
  [
    "1",
    {
      id: "1",
      text: "Bienvenido al guestbook!",
      author: "Sistema",
      createdAt: new Date("2026-02-27").toISOString(),
    },
  ],
]);

export const guestbookRouter = router({
  list: publicProcedure.query(() => {
    return Array.from(messages.values()).reverse();
  }),

  create: publicProcedure
    .input(CreateMessageSchema)
    .mutation(({ input }) => {
      const id = String(Date.now());
      const message: Message = {
        id,
        ...input,
        createdAt: new Date().toISOString(),
      };
      messages.set(id, message);
      return message;
    }),

  delete: publicProcedure
    .input(z.string())
    .mutation(({ input }) => {
      const existed = messages.delete(input);
      return { success: existed };
    }),
});

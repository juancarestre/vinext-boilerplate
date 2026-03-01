import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import {
  UserSchema,
  CreateUserSchema,
  UpdateUserSchema,
  type User,
} from "@vinext-boilerplate/shared";

// In-memory store (en producción sería D1 o KV)
const users: Map<string, User> = new Map([
  [
    "1",
    {
      id: "1",
      name: "Ada Lovelace",
      email: "ada@example.com",
      role: "admin",
      createdAt: new Date("2026-01-01").toISOString(),
    },
  ],
  [
    "2",
    {
      id: "2",
      name: "Alan Turing",
      email: "alan@example.com",
      role: "user",
      createdAt: new Date("2026-01-15").toISOString(),
    },
  ],
  [
    "3",
    {
      id: "3",
      name: "Grace Hopper",
      email: "grace@example.com",
      role: "viewer",
      createdAt: new Date("2026-02-01").toISOString(),
    },
  ],
]);

export const usersRouter = router({
  list: publicProcedure.query(() => {
    return Array.from(users.values());
  }),

  getById: publicProcedure
    .input(z.string())
    .query(({ input }) => {
      const user = users.get(input);
      if (!user) throw new Error(`User ${input} not found`);
      return user;
    }),

  create: publicProcedure
    .input(CreateUserSchema)
    .mutation(({ input }) => {
      const id = String(Date.now());
      const user: User = {
        id,
        ...input,
        createdAt: new Date().toISOString(),
      };
      users.set(id, user);
      return user;
    }),

  update: publicProcedure
    .input(z.object({ id: z.string(), data: UpdateUserSchema }))
    .mutation(({ input }) => {
      const existing = users.get(input.id);
      if (!existing) throw new Error(`User ${input.id} not found`);
      const updated = { ...existing, ...input.data };
      users.set(input.id, updated);
      return updated;
    }),

  delete: publicProcedure
    .input(z.string())
    .mutation(({ input }) => {
      const existed = users.delete(input);
      return { success: existed };
    }),
});

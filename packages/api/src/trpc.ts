import { initTRPC } from "@trpc/server";

// Context disponible en cada procedimiento
export type Context = {
  // Aquí irían bindings de Cloudflare (D1, KV, etc.)
};

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

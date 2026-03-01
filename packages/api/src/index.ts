import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./router";
import type { Context } from "./trpc";

const app = new Hono();

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

// Health check
app.get("/", (c) => {
  return c.json({
    name: "vinext-boilerplate-api",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// tRPC handler montado en /trpc
app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (): Context => ({}),
  })
);

export default app;

// Re-exportar el tipo del router para que el frontend lo importe
export type { AppRouter } from "./router";

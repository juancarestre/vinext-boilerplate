import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@vinext-boilerplate/api";

function getBaseUrl() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Local dev fallback only.
  if (import.meta.env.DEV) {
    return "http://localhost:8787";
  }

  // Extra guard for local browser sessions.
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:8787";
    }
  }

  throw new Error(
    "VITE_API_URL is required in production for server-side tRPC calls"
  );
}

export const api = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,
    }),
  ],
});

export type { AppRouter };

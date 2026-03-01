import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@vinext-boilerplate/api";

const DEFAULT_PROD_API_URL = "https://vinext-api.peto.dev";

function getBaseUrl() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Client-side: local dev fallback
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:8787";
    }
  }

  // Server-side (RSC in Workers): use production API domain by default
  return DEFAULT_PROD_API_URL;
}

export const api = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,
    }),
  ],
});

export type { AppRouter };

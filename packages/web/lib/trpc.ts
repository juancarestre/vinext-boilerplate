import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@vinext-boilerplate/api";

function getBaseUrl() {
  // Client-side: Vite exposes VITE_ prefixed vars via import.meta.env
  if (typeof window !== "undefined") {
    return import.meta.env.VITE_API_URL ?? "http://localhost:8787";
  }
  // Server-side (RSC in Workers): fall back to localhost during dev
  return import.meta.env.VITE_API_URL ?? "http://localhost:8787";
}

export const api = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,
    }),
  ],
});

export type { AppRouter };

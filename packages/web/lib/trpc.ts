import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@vinext-boilerplate/api";
import { createServerBindingAwareBatchLinkOptions } from "./trpc-server-transport";

export const api = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink(createServerBindingAwareBatchLinkOptions()),
  ],
});

export type { AppRouter };

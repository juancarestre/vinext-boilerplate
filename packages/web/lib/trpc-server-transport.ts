import { getExternalApiBaseUrl } from "./trpc-transport";

type ServiceBindingFetcher = {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
};

const BINDING_ORIGIN = "http://api-service";
const PLACEHOLDER_ORIGIN = "http://trpc-placeholder";

function getInputUrl(input: RequestInfo | URL): URL {
  if (input instanceof URL) {
    return input;
  }

  if (typeof input === "string") {
    return new URL(input);
  }

  return new URL(input.url);
}

function getBindingTargetUrl(input: RequestInfo | URL): string {
  const incoming = getInputUrl(input);
  return `${BINDING_ORIGIN}${incoming.pathname}${incoming.search}`;
}

function getExternalTargetUrl(input: RequestInfo | URL): string {
  const incoming = getInputUrl(input);
  const externalBaseUrl = getExternalApiBaseUrl("server");
  return `${externalBaseUrl}${incoming.pathname}${incoming.search}`;
}

let apiBindingPromise: Promise<ServiceBindingFetcher | null> | null = null;

async function resolveApiBinding(): Promise<ServiceBindingFetcher | null> {
  if (!apiBindingPromise) {
    apiBindingPromise = (async () => {
      try {
        const cloudflareWorkers = await import("cloudflare:workers");
        const binding = (cloudflareWorkers as { env?: { API_SERVICE?: unknown } })
          .env?.API_SERVICE;

        if (binding && typeof (binding as { fetch?: unknown }).fetch === "function") {
          return binding as ServiceBindingFetcher;
        }
      } catch {
        // Fallback to external HTTP when running outside Workers runtime.
      }

      return null;
    })();
  }

  return apiBindingPromise;
}

export function createServerBindingAwareBatchLinkOptions() {
  return {
    // URL placeholder; real destination is resolved in custom fetch.
    url: `${PLACEHOLDER_ORIGIN}/trpc`,
    fetch: serverApiFetch,
  };
}

export async function serverApiFetch(input: RequestInfo | URL, init?: RequestInit) {
  const apiBinding = await resolveApiBinding();

  if (apiBinding) {
    const bindingTarget = getBindingTargetUrl(input);
    return apiBinding.fetch(bindingTarget, init);
  }

  const externalTarget = getExternalTargetUrl(input);
  return fetch(externalTarget, init);
}

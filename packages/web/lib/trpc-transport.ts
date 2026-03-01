type RuntimeSide = "server" | "client";
export type ClientTransportMode = "external" | "binding-proxy";

const DEV_API_URL = "http://localhost:8787";
const LOCAL_PROXY_TRPC_PATH = "/api/trpc";

function isLocalHostname(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function getExternalApiBaseUrl(side: RuntimeSide): string {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (import.meta.env.DEV) {
    return DEV_API_URL;
  }

  if (typeof window !== "undefined" && isLocalHostname(window.location.hostname)) {
    return DEV_API_URL;
  }

  throw new Error(
    `VITE_API_URL is required in production for ${side}-side tRPC calls`
  );
}

export function createExternalHttpBatchLinkOptions(
  side: RuntimeSide
) {
  return {
    url: `${getExternalApiBaseUrl(side)}/trpc`,
  };
}

export function createClientHttpBatchLinkOptions(mode: ClientTransportMode) {
  if (mode === "binding-proxy") {
    return {
      url: LOCAL_PROXY_TRPC_PATH,
    };
  }

  return createExternalHttpBatchLinkOptions("client");
}

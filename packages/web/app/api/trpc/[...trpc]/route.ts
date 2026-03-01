import { serverApiFetch } from "@/lib/trpc-server-transport";

type RouteContext = {
  params: Promise<{ trpc: string[] }>;
};

function buildTrpcTarget(requestUrl: string, trpcPath: string[]) {
  const url = new URL(requestUrl);
  const path = trpcPath.join("/");
  const search = url.search;
  return `http://trpc-placeholder/trpc/${path}${search}`;
}

async function proxyTrpcRequest(request: Request, context: RouteContext) {
  const { trpc } = await context.params;
  const target = buildTrpcTarget(request.url, trpc);

  const headers = new Headers(request.headers);
  headers.delete("host");

  const body = request.method === "GET" || request.method === "HEAD"
    ? undefined
    : await request.arrayBuffer();

  const upstreamResponse = await serverApiFetch(target, {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  });

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: upstreamResponse.headers,
  });
}

export async function GET(request: Request, context: RouteContext) {
  return proxyTrpcRequest(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  return proxyTrpcRequest(request, context);
}

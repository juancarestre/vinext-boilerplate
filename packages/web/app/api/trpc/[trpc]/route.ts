import { NextResponse } from "next/server";

const LOCAL_API_URL = "http://localhost:8787";

function getApiBaseUrl() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  return LOCAL_API_URL;
}

function buildTargetUrl(requestUrl: string, trpcPath: string) {
  const source = new URL(requestUrl);
  const target = new URL(`${getApiBaseUrl()}/trpc/${trpcPath}`);
  target.search = source.search;
  return target.toString();
}

export async function GET(
  request: Request,
  context: { params: Promise<{ trpc: string }> }
) {
  const { trpc } = await context.params;
  const upstream = await fetch(buildTargetUrl(request.url, trpc), {
    method: "GET",
    headers: {
      "content-type": request.headers.get("content-type") ?? "application/json",
    },
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
    },
  });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ trpc: string }> }
) {
  const { trpc } = await context.params;
  const upstream = await fetch(buildTargetUrl(request.url, trpc), {
    method: "POST",
    headers: {
      "content-type": request.headers.get("content-type") ?? "application/json",
    },
    body: await request.arrayBuffer(),
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
    },
  });
}

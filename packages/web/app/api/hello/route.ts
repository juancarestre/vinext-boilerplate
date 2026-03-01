import { NextResponse } from "next/server";

export async function GET() {
  console.log("\x1b[35m[api]\x1b[0m GET /api/hello");

  const payload = {
    message: "Hello from vinext on Cloudflare Workers!",
    timestamp: new Date().toISOString(),
  };

  console.log("\x1b[35m[api]\x1b[0m Response:", JSON.stringify(payload));

  return NextResponse.json(payload);
}

import type { Metadata } from "next";
import { TRPCProvider } from "@/lib/trpc-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vinext Boilerplate",
  description:
    "Monorepo: Vinext frontend + Hono/tRPC backend on Cloudflare Workers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background noise-overlay">
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}

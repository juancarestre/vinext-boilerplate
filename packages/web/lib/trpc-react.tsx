"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import type { AppRouter } from "@vinext-boilerplate/api";
import {
  createClientHttpBatchLinkOptions,
  type ClientTransportMode,
} from "./trpc-transport";

export const trpc = createTRPCReact<AppRouter>();

const TRANSPORT_MODE_KEY = "trpc-transport-mode";

type TrpcTransportContextValue = {
  mode: ClientTransportMode;
  setMode: (mode: ClientTransportMode) => void;
};

const TrpcTransportContext = createContext<TrpcTransportContextValue | null>(null);

export function TRPCProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [mode, setMode] = useState<ClientTransportMode>("external");

  useEffect(() => {
    const stored = window.localStorage.getItem(TRANSPORT_MODE_KEY);
    if (stored === "external" || stored === "binding-proxy") {
      setMode(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(TRANSPORT_MODE_KEY, mode);
    // Ensure queries are re-run through the selected transport.
    queryClient.clear();
  }, [mode, queryClient]);

  const trpcClient = useMemo(
    () =>
      trpc.createClient({
        links: [httpBatchLink(createClientHttpBatchLinkOptions(mode))],
      }),
    [mode]
  );

  const transportValue = useMemo<TrpcTransportContextValue>(
    () => ({
      mode,
      setMode,
    }),
    [mode]
  );

  return (
    <TrpcTransportContext.Provider value={transportValue}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </trpc.Provider>
    </TrpcTransportContext.Provider>
  );
}

export function useTrpcTransport() {
  const context = useContext(TrpcTransportContext);
  if (!context) {
    throw new Error("useTrpcTransport must be used within TRPCProvider");
  }

  return context;
}

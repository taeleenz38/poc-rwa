"use client";

import React, { ReactNode } from "react";
import { config, projectId } from "@/config";

import { createWeb3Modal } from "@web3modal/wagmi/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { State, WagmiProvider } from "wagmi";

const queryClient = new QueryClient();

import { Provider as UrQlProvider } from "urql";
import { client } from "../lib/urql";

if (!projectId) throw new Error("Project ID is not defined");

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeVariables: {
    "--w3m-accent": "#9571f6",
    "--w3m-border-radius-master": "20px",
    "--w3m-font-size-master": "9.5px"
  },
});

export default function Web3ModalProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <UrQlProvider value={client}>
      <WagmiProvider config={config} initialState={initialState}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </UrQlProvider>
  );
}

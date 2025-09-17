"use client";

import type { ReactNode } from "react";
import type { DehydratedState } from "@tanstack/react-query";
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
} from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export interface ReactQueryProviderProps {
  children: ReactNode;
  dehydratedState?: DehydratedState;
}

// Create QueryClient once outside the component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 30 seconds
    },
  },
});

export default function ReactQueryProvider({
  children,
  dehydratedState,
}: ReactQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        {children}
      </HydrationBoundary>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}

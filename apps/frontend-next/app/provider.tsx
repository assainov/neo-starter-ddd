'use client';

import { Notifications } from './_shared/notifications';
import { env } from './_config/env';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { MainErrorFallback } from './_components/error';

type AppProviderProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

export const AppProvider = ({ children }: AppProviderProps) => (
  <ErrorBoundary FallbackComponent={MainErrorFallback}>
    <QueryClientProvider client={queryClient}>
      {env.isDevelopment ? <ReactQueryDevtools /> : null}
      <Notifications />
      {children}
    </QueryClientProvider>
  </ErrorBoundary>
);
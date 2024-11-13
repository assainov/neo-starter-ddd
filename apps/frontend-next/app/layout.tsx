import localFont from 'next/font/local';
import './_styles/globals.css';
import { AppProvider } from './provider';
import Navbar from './_components/navbar';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getUserDetailsQueryOptions } from './account/_api/queries';

const geistSans = localFont({
  src: './_assets/fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './_assets/fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const RootLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(getUserDetailsQueryOptions());

  const dehydratedState = dehydrate(queryClient);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${geistSans.className} antialiased`}
      >
        <AppProvider>
          <HydrationBoundary state={dehydratedState}>
            <Navbar />
            {children}
          </HydrationBoundary>
        </AppProvider>
      </body>
    </html>
  );
};

export default RootLayout;
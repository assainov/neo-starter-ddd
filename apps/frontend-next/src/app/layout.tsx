import localFont from 'next/font/local';
import './globals.css';
import Navbar from '@/components/@layout/navbar';
import { AppProvider } from './app-provider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang="en">
    <body
      className={`${geistSans.variable} ${geistMono.variable} ${geistSans.className} antialiased`}
    >
      <AppProvider>
        <Navbar />
        {children}
      </AppProvider>
    </body>
  </html>
);

export default RootLayout;
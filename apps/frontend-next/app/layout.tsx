import localFont from 'next/font/local';
import './_styles/globals.css';
import { AppProvider } from './provider';
import Navbar from './_components/navbar';

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
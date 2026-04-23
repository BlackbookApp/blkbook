import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ServiceWorkerRegistrar from './providers/ServiceWorkerRegistrar';
import { Providers } from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: '#000000',
  viewportFit: 'cover',
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'HAIZEL',
  description: 'HAIZEL app',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'HAIZEL',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ServiceWorkerRegistrar />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

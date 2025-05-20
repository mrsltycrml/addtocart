import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartProvider';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/Header';
import AuthGuard from '@/components/AuthGuard';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'IT Select - Your Tech Store',
  description: 'Find the best IT products at IT Select.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased flex flex-col min-h-screen bg-background text-foreground`}>
        <CartProvider>
          <Header />
          <AuthGuard>
          <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-10">
            {children}
          </main>
          </AuthGuard>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { CartProvider } from '@/components/providers/CartProvider';
import { WishlistProvider } from '@/components/providers/WishlistProvider';
import { CartDrawer } from '@/components/storefront/CartDrawer';

export const metadata: Metadata = {
  title: {
    default: 'SERVICING WORLD — Lab-Tested Electronics, Repair Tools & Tech Gear',
    template: '%s | SERVICING WORLD',
  },
  description:
    'Benchmarked and oscilloscope-tested electronics, GaN chargers, repair tools, power banks, and accessories by Servicing World.',
  keywords: [
    'servicing world',
    'electronics',
    'repair tools',
    'gan charger',
    'fast charging',
    'power bank 100w',
    'digital multimeter',
    'soldering iron',
  ],
  authors: [{ name: 'Servicing World Engineering Team' }],
  creator: 'SERVICING WORLD',
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    url: 'https://servicingworld.com',
    title: 'SERVICING WORLD — Tested & Benchmarked Tech Gear',
    description:
      'High-performance electronics, repair tools, and hardware gadgets tested in our lab.',
    siteName: 'SERVICING WORLD',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SERVICING WORLD',
    description: 'Benchmarked and oscilloscope-tested electronics & repair tech.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <div className="flex-1 flex flex-col">{children}</div>
                <CartDrawer />
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

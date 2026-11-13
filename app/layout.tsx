import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Parisienne, Jost } from 'next/font/google';
import './globals.css';
import '../src/styles/tokens.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const parisienne = Parisienne({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-parisienne',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jost',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Only You — for Anuska',
  description: 'A little place that belongs only to you. Made with love, exclusively for you.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#080608',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${parisienne.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  );
}

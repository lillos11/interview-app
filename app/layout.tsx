import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';

import '@/app/globals.css';

const headingFont = Fraunces({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['500', '600', '700']
});

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'Interview Command Center',
  description: 'An Amazon-first interview prep app with STAR story building, bar-raiser scoring, answer recording, and Leadership Principle drills.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="fluent-body">
        <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 md:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
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

export const viewport: Viewport = {
  themeColor: '#0d090a'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="fluent-body">
        <main className="mx-auto min-h-screen w-full max-w-[1500px] px-5 py-10 md:px-10 md:py-12 xl:px-14">
          {children}
        </main>
      </body>
    </html>
  );
}

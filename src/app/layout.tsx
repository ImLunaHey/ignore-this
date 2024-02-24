import type { Metadata } from 'next';
import { PT_Mono } from 'next/font/google';
import './globals.css';

const font = PT_Mono({
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Mafia Game',
  description: 'A game of deception and strategy',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}

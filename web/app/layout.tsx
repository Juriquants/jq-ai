// web/app/layout.tsx
// JQ.AI Web UI - Premium Root Layout

import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "JQ.AI",
  description: "Open-source legal intelligence for the African continent.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#0c0a0a] text-[#f5f0eb] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

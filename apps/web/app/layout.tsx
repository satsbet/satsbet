import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/utils";
import { ThemeProvider } from "@/components/theme-provider";
import logo from "./logo.png";
import Image from "next/image";

import "./globals.css";
import Link from "next/link";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Satsbet - Betting on the Bitcoin price with lightning",
  description: "Betting on the Bitcoin price with lightning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased p-4 md:p-10",
          fontSans.variable,
        )}
      >
        <Link href="/">
          <Image
            src={logo}
            alt="Satsbet"
            priority
            width={256}
            className="max-w-[150px] md:max-w-none mx-auto mb-4 md:mb-10"
          />
        </Link>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

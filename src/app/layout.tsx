import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { TabNavigation } from "@/components/layout/tab-navigation";
import { APP_CONFIG } from "@/lib/config";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MarketBase | Demo by Humam",
  description: "Scalable digital marketplace platform MVP demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // data-theme activates the CSS theme system — Layout Builder sets APP_CONFIG.aesthetic
    // which flows through here to drive all visual treatment via CSS variables.
    <html lang="en" data-theme={APP_CONFIG.aesthetic}>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
      >
        <TabNavigation />
        {children}
      </body>
    </html>
  );
}

import type { ReactNode } from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { SessionProvider } from "@/lib/session";
import "./globals.css";

const firaSans = localFont({
  src: [
    { path: "./fonts/fira-sans-300.woff2", weight: "300", style: "normal" },
    { path: "./fonts/fira-sans-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/fira-sans-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/fira-sans-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/fira-sans-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-fira-sans",
  display: "swap",
});

const firaCode = localFont({
  src: "./fonts/fira-code.woff2",
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexveins Ops — E-Commerce Finance",
  description:
    "Operations, inventory & profit management for a Shopify-integrated e-commerce business.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${firaSans.variable} ${firaCode.variable}`}>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
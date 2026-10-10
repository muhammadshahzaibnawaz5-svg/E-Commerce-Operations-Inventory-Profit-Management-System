import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Fira_Sans, Fira_Code } from "next/font/google";
import { SessionProvider } from "@/lib/session";
import "./globals.css";

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fira-sans",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
import type { Metadata } from "next";
import { JetBrains_Mono, Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ledgerly — Studio finance, without the noise",
    template: "%s · Ledgerly",
  },
  description:
    "A calm full-stack invoicing workspace for independent studios: clients, invoices, revenue, and activity in one place.",
  applicationName: "Ledgerly",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${display.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

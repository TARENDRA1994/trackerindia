import "./globals.css";
import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import { Providers } from "@/components/Providers";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Tracker India | UPSC & Government Exam Companion",
  description: "A professional, AI-powered platform for Civil Services aspirants to track progress, analyze performance, and stay consistent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${lora.variable} ${inter.variable} antialiased`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/theme-provider";
import Providers from "./providers"; // ✅ import your session provider
import { Toaster } from 'sonner';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CuraAi - Your Health Companion",
  description: "AI-powered health assistant for users and hospitals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <ThemeProvider>
            <Header />
            <main className="flex-grow">{children}
              <Toaster position="top-center" richColors />
            </main>
            <Footer />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}

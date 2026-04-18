import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/hooks/use-toast";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "GreenJack | Elite Performance Terminal",
  description: "Play, compete, and support charities",
  applicationName: 'GreenJack',
};

export const viewport: Viewport = {
  themeColor: '#0B1220',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[#0B1220] text-white selection:bg-purple-500/30 selection:text-white">
        <ToastProvider>
          <Navbar />
          <main className="relative z-10">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}

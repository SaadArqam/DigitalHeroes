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
  themeColor: '#05070A',
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
      <body className="min-h-full bg-[#05070A] text-[#E6EDF3] selection:bg-[#00FFA3]/30 selection:text-[#00FFA3]">
        <ToastProvider>
          <div className="relative isolate min-h-screen">
            {/* Background Grain/Noise */}
            <div className="pointer-events-none fixed inset-0 z-[-1] opacity-20 [background-image:url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay" />
            
            <Navbar />
            <main className="relative z-10 pt-4">
              {children}
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}

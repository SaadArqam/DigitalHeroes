import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/hooks/use-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GreenJack | Elite Performance Terminal",
  description: "Turn your golf passion into purpose - Play, compete, and support charities",
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
      style={{ colorScheme: 'dark' }}
    >
      <body className="min-h-full bg-background text-text-primary selection:bg-primary-start/20 selection:text-primary-end">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import AuthListener from "@/components/AuthListener";
import AiChatbot from "@/components/AiChatbot";

export const metadata: Metadata = {
  title: "DevMarket Pro — Premium Developer Marketplace",
  description:
    "The premium marketplace for digital craftsmanship where creators and clients build lasting relationships. Buy and sell production-ready code, templates, and design systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.cdnfonts.com/css/netron" rel="stylesheet" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <Navbar />
        <AuthListener />
        <main>{children}</main>
        <Footer />
        <Toaster position="top-right" richColors />
        <AiChatbot />
        <Analytics />
      </body>
    </html>
  );
}

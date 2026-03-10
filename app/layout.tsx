import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Optimizes and self-hosts the font for maximum performance
const inter = Inter({ subsets: ["latin"] });

// 1. Mobile Browser & PWA Theming
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f172a", // Matches Palladium's brand-primary
};

// 2. High-Conversion SEO Metadata
export const metadata: Metadata = {
  title: "Palladium Global Logistics | Smart Supply Chain & Dispatch",
  description: "Nigeria's premier logistics portal. Real-time fleet tracking, instant WhatsApp dispatch, and secure customer portal for all your delivery needs.",
  keywords: ["Logistics Nigeria", "Dispatch Rider Lagos", "Haulage Services", "Supply Chain Management", "Palladium Logistics"],
  openGraph: {
    title: "Palladium Global Logistics",
    description: "Fast, Reliable, and Seamless Supply Chain Solutions.",
    type: "website",
    locale: "en_NG", // Localized for Nigeria
    siteName: "Palladium Global",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    // Injecting the brand theme globally so all Clerk modals match your UI
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#0f172a', // brand-primary
          colorText: '#0f172a',
          colorDanger: '#ef4444',
        },
        elements: {
          card: "shadow-2xl rounded-sm border border-slate-200",
        }
      }}
    >
      {/* 🚨 CRITICAL UPGRADE: Added suppressHydrationWarning to prevent browser extensions from crashing the app */}
      <html lang="en" className="scroll-smooth" suppressHydrationWarning>
        <body
          className={`
            ${inter.className} bg-brand-light text-slate-800 antialiased 
            selection:bg-brand-accent selection:text-white
            w-full overflow-x-clip flex flex-col min-h-screen
          `}
        >
          {/* 1. Fixed Header (Clerk-enabled) */}
          <Header />
          
          {/* 2. Main Content Area */}
          <main className="flex-grow w-full relative">
            {children}
          </main>
          
          {/* 3. Global Industrial Footer */}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
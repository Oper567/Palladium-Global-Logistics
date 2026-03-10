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
  // 🚨 SEO UPGRADE: Resolves relative OpenGraph image URLs
  metadataBase: new URL("https://palladiumglobalresources.vercel.app"), 
  title: "Palladium Global Logistics | Smart Supply Chain & Dispatch",
  description: "Nigeria's premier logistics portal. Real-time fleet tracking, instant WhatsApp dispatch, and secure customer portal for all your delivery needs.",
  keywords: ["Logistics Nigeria", "Dispatch Rider Lagos", "Haulage Services", "Supply Chain Management", "Palladium Logistics", "Fleet Management"],
  openGraph: {
    title: "Palladium Global Logistics",
    description: "Fast, Reliable, and Seamless Supply Chain Solutions.",
    type: "website",
    locale: "en_NG", // Localized for Nigeria
    siteName: "Palladium Global",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    // 🚨 UI UPGRADE: Injecting the brand theme globally so all Clerk modals perfectly match your UI
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#0f172a', // brand-primary
          colorText: '#0f172a',
          colorDanger: '#ef4444',
          fontFamily: inter.style.fontFamily,
        },
        elements: {
          card: "shadow-2xl rounded-sm border-t-8 border-brand-primary border-x-slate-200 border-b-slate-200",
          formButtonPrimary: "bg-brand-primary hover:bg-brand-accent hover:text-brand-primary text-white font-black uppercase tracking-widest text-xs rounded-sm transition-all duration-300 shadow-md",
          socialButtonsBlockButton: "border border-slate-200 rounded-sm hover:bg-slate-50 transition-colors",
          footerActionLink: "text-brand-accent hover:text-brand-primary font-bold",
          formFieldInput: "rounded-sm border-slate-200 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none",
        }
      }}
    >
      <html lang="en" className="scroll-smooth" suppressHydrationWarning>
        <body
          className={`
            ${inter.className} bg-slate-50 text-slate-800 antialiased 
            selection:bg-brand-accent selection:text-white
            w-full overflow-x-hidden flex flex-col min-h-screen
          `}
          suppressHydrationWarning
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
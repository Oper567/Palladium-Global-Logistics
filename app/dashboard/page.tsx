import React, { Suspense } from "react";
import { currentUser, auth } from "@clerk/nextjs/server";
import AvailableResources from "@/components/AvailableResources";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

// Prevent search engines from indexing the private portal
export const metadata: Metadata = {
  title: "Customer Dashboard | Palladium Global",
  robots: "noindex, nofollow",
};

export default async function DashboardPage() {
  // 1. Absolute Security Check (Server-Side)
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // 2. Fetch User Profile
  const user = await currentUser();
  const firstName = user?.firstName || "Valued Customer";
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "Unknown Email";

  // 3. 🚨 SECURE RBAC UPGRADE: Dynamic Admin Check
  // Replaced hardcoded emails with secure Clerk metadata validation
  const isAdmin = (user?.publicMetadata as any)?.role === "admin";

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center">
      
      {/* 🚀 Hero Header Section */}
      <div className="w-full bg-brand-primary text-white pt-32 pb-24 px-6 lg:px-8 border-b-4 border-brand-accent relative overflow-hidden shadow-xl">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
          <svg className="h-full w-full" fill="none" viewBox="0 0 400 400">
            <defs>
              <pattern id="dashboard-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dashboard-grid)" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-primary to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
            
            {/* Welcome Text */}
            <div className="space-y-5 flex-1">
              <div className="flex flex-wrap items-center gap-4">
                <span className="bg-brand-accent text-brand-primary text-[10px] font-black px-4 py-1.5 uppercase tracking-[0.2em] rounded-sm shadow-md">
                  Live Portal
                </span>
                
                {/* Dynamic Admin Link */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-brand-accent hover:text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent rounded-sm px-2 py-1 bg-white/5 border border-white/10 hover:bg-white/10"
                  >
                    Launch Command Center <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
                Welcome, <br className="hidden md:block lg:hidden" />
                <span className="text-brand-accent">{firstName}</span>
              </h1>
              
              <p className="text-slate-300 font-medium max-w-xl text-sm md:text-base leading-relaxed">
                Your central hub for logistics operations. View live fleet
                availability and manage your supply chain requirements in real-time.
              </p>
            </div>

            {/* Status Card */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-sm min-w-[280px] shadow-2xl shrink-0">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Account Status
                </span>
                <div className="w-2.5 h-2.5 bg-[#25D366] rounded-full shadow-[0_0_12px_#25D366] animate-pulse"></div>
              </div>
              <p className="text-white font-black text-2xl tracking-tight mb-1">
                Verified Client
              </p>
              <p className="text-brand-accent text-[10px] uppercase font-bold tracking-widest truncate max-w-[240px]" title={userEmail}>
                ID: {userEmail}
              </p>
            </div>
            
          </div>

          {/* 📊 Quick Stats Grid */}
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 border-t border-white/10 pt-10">
            {[
              { label: "Active Dispatches", val: "0" },
              { label: "System Status", val: "Online" },
              { label: "Active Quotes", val: "None" },
              { label: "Command Support", val: "24/7" },
            ].map((stat) => (
              // 🚨 REACT FIX: Unique string key instead of index 'i'
              <div key={stat.label} className="bg-white/5 border-l-4 border-brand-accent/50 px-5 py-4 hover:bg-white/10 hover:border-brand-accent transition-all duration-300 rounded-r-sm">
                <dt className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                  {stat.label}
                </dt>
                <dd className="text-white font-black text-2xl tracking-tight">{stat.val}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* 🚛 Resources Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 mb-24">
        <div className="bg-white rounded-sm overflow-hidden shadow-2xl">
          
          {/* Next.js 16 Streaming Boundary */}
          <Suspense fallback={
            <div className="p-24 flex flex-col items-center justify-center text-center space-y-6 bg-slate-50">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-brand-primary rounded-full animate-spin"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">
                Syncing Live Fleet Telemetry...
              </p>
            </div>
          }>
            <AvailableResources />
          </Suspense>

        </div>

        {/* Footer Support Message */}
        <div className="mt-16 text-center p-10 border-2 border-dashed border-slate-200 bg-white/50 rounded-sm hover:border-brand-primary/30 transition-colors">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            Need custom haulage or volume pricing?
          </p>
          <Link
            href="https://wa.me/2348066605477?text=Hello%20Palladium%20Logistics%2C%20I%20need%20a%20custom%20haulage%20quote."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 bg-brand-primary text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-accent hover:text-brand-primary transition-all duration-300 rounded-sm shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
            Contact Command Center
          </Link>
        </div>
      </div>
    </div>
  );
}
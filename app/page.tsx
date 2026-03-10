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
  const userEmail = user?.emailAddresses?.[0]?.emailAddress; // Added safe optional chaining

  // 3. Admin Check
  const isAdmin =
    userEmail === "palladiumglobalresources@gmail.com" ||
    userEmail === "your-email@gmail.com";

  return (
    <div className="w-full min-h-screen bg-brand-light flex flex-col items-center">
      
      {/* 🚀 Hero Header Section */}
      <div className="w-full bg-brand-primary text-white pt-32 pb-20 px-6 lg:px-8 border-b-8 border-brand-accent relative overflow-hidden">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
          <svg className="h-full w-full" fill="none" viewBox="0 0 400 400">
            <defs>
              <pattern
                id="dashboard-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path d="M 40 0 L 0 0 0 40" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dashboard-grid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-brand-accent text-brand-primary text-[10px] font-black px-3 py-1 uppercase tracking-widest rounded-sm shadow-sm">
                  Live Portal
                </span>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-brand-accent hover:text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent rounded-sm px-1"
                  >
                    [ Open Admin Panel → ]
                  </Link>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter">
                Welcome, <br className="md:hidden" />
                <span className="text-brand-accent">{firstName}</span>
              </h1>
              <p className="text-slate-400 font-medium max-w-2xl text-sm md:text-base leading-relaxed">
                Your central hub for logistics operations. View live fleet
                availability and manage your supply chain requirements in
                real-time.
              </p>
            </div>

            {/* Status Card */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-sm min-w-[240px] shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Account Security
                </span>
                <div className="w-2 h-2 bg-[#25D366] rounded-full shadow-[0_0_10px_#25D366] animate-pulse"></div>
              </div>
              <p className="text-white font-black text-xl mb-1">
                Active Account
              </p>
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter truncate max-w-[200px]" title={userEmail}>
                Verified: {userEmail}
              </p>
            </div>
          </div>

          {/* 📊 Quick Stats Grid (Semantic HTML <dl>) */}
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {[
              { label: "Active Dispatches", val: "0" },
              { label: "Available Fleet", val: "Online" },
              { label: "Last Quote", val: "N/A" },
              { label: "Support Status", val: "24/7" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/5 border-l-2 border-brand-accent/30 px-4 py-3 hover:bg-white/10 hover:border-brand-accent transition-all duration-300"
              >
                <dt className="text-[10px] font-bold text-brand-accent uppercase tracking-widest mb-1">
                  {stat.label}
                </dt>
                <dd className="text-white font-black text-xl">{stat.val}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* 🚛 Resources Section */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 -mt-10 relative z-20 mb-20">
        <div className="bg-brand-light rounded-sm overflow-hidden shadow-2xl border-t-4 border-brand-primary min-h-[400px]">
          
          {/* Next.js 16 Streaming Boundary */}
          <Suspense fallback={
            <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-primary rounded-full animate-spin"></div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Syncing Live Fleet Database...</p>
            </div>
          }>
            <AvailableResources />
          </Suspense>

        </div>

        {/* Footer Support Message */}
        <div className="mt-12 text-center p-8 border-2 border-dashed border-slate-200 bg-white/50 rounded-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">
            Need custom haulage or volume pricing?
          </p>
          <Link
            href="https://wa.me/2348066605477?text=Hello%20Palladium%20Logistics%2C%20I%20need%20a%20custom%20haulage%20quote."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-brand-primary text-white font-black text-xs uppercase tracking-widest hover:bg-brand-accent hover:text-brand-primary transition-all rounded-sm shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
          >
            Contact Command Center
          </Link>
        </div>
      </div>
    </div>
  );
}
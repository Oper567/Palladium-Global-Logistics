import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Import the components we built
import AdminForm from "@/components/AdminForm";
import UserTable from "@/components/UserTable";
import AdminFleetManager from "@/components/AdminFleetManager"; // 🚨 NEW: Import the Fleet Manager

export default async function AdminDashboard() {
  // 1. 🚨 Unbreakable Server-Side Security Gate
  const { userId, sessionClaims } = await auth();
  if (!userId || (sessionClaims?.metadata as any)?.role !== "admin") {
    redirect("/"); 
  }

  // 2. 📊 Parallel Data Fetching for Dashboard Stats
  // 🚨 UPGRADE: Added rawFleetData to the Promise.all array for maximum speed
  const [totalResources, activeResources, client, rawFleetData] = await Promise.all([
    prisma.resource.count(),
    prisma.resource.count({ where: { status: "Available" } }),
    clerkClient(),
    prisma.resource.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  // Fetch and format the user list from Clerk
  const userList = await client.users.getUserList();
  const formattedUsers = userList.data.map((user) => ({
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress || "Unknown Email",
    role: (user.publicMetadata?.role as string) || "customer",
  }));

  const adminCount = formattedUsers.filter(u => u.role === "admin").length;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      
      {/* 🚀 Top Navigation / Branding Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-primary flex items-center justify-center rounded-sm shadow-md">
              <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-brand-primary uppercase tracking-tighter leading-none">
                Command <span className="text-brand-accent">Center</span>
              </h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Palladium Global Admin</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[9px] font-black text-green-700 uppercase tracking-widest">System Secure</span>
            </div>
            <Link 
              href="/dashboard" 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-brand-primary transition-colors"
            >
              Exit to Portal
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        
        {/* 📊 Metrics Row */}
        <section>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6 border-l-2 border-brand-accent pl-3">
            Real-Time Telemetry
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 border-t-4 border-brand-primary rounded-sm shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Fleet Size</p>
              <p className="text-4xl font-black text-brand-primary">{totalResources}</p>
            </div>
            
            <div className="bg-white p-6 border-t-4 border-green-500 rounded-sm shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Available for Dispatch</p>
              <p className="text-4xl font-black text-green-600">{activeResources}</p>
            </div>

            <div className="bg-white p-6 border-t-4 border-blue-500 rounded-sm shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Registered Clients</p>
              <p className="text-4xl font-black text-blue-600">{formattedUsers.length}</p>
            </div>

            <div className="bg-white p-6 border-t-4 border-brand-accent rounded-sm shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Active Admins</p>
              <p className="text-4xl font-black text-brand-accent">{adminCount}</p>
            </div>

          </div>
        </section>

        {/* 🚛 Asset Deployment Section (AdminForm) */}
        <section>
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-black text-brand-primary uppercase tracking-tighter">Fleet Deployment</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Add new logistics resources to the database</p>
            </div>
          </div>
          
          <AdminForm />
        </section>

        {/* 🛠️ Fleet Management Section (Inline Editor) */}
        <section>
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-black text-brand-primary uppercase tracking-tighter">Fleet Directory</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Edit pricing, update status, or remove assets entirely</p>
            </div>
          </div>
          
          <AdminFleetManager fleet={rawFleetData} />
        </section>

        {/* 🔐 Access Control Section (UserTable) */}
        <section>
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-black text-brand-primary uppercase tracking-tighter">Access Control</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage personnel clearance levels</p>
            </div>
          </div>
          
          <UserTable users={formattedUsers} />
        </section>

      </main>
    </div>
  );
}
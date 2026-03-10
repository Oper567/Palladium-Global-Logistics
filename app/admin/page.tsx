import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminForm from "@/components/AdminForm";
import Link from "next/link";

export default async function AdminPage() {
  const { userId, sessionClaims } = await auth();

  // 🚨 TypeScript FIX: We cast metadata as 'any' so TS knows 'role' exists
  if (!userId || (sessionClaims?.metadata as any)?.role !== "admin") {
    redirect("/"); // Instantly kick out non-admins
  }

  return (
    <div className="min-h-screen bg-brand-light py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-4xl w-full flex justify-between items-end mb-8 border-b-2 border-slate-200 pb-6">
        <div>
          <h2 className="text-4xl font-black text-brand-primary uppercase tracking-tighter">
            Fleet <span className="text-brand-accent">Control</span>
          </h2>
        </div>
        <div className="flex gap-4">
            <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Portal</Link>
        </div>
      </div>

      <AdminForm />
    </div>
  );
}
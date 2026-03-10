"use client";

import { useState } from "react";
import { setRole } from "@/app/actions/admin"; 
import { useSession, useUser } from "@clerk/nextjs";

interface UserRecord {
  id: string;
  email: string;
  role: string;
}

export default function UserTable({ users }: { users: UserRecord[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: "success" | "error" | ""; text: string }>({ type: "", text: "" });
  
  const { session } = useSession();
  const { user: currentUser } = useUser(); // 🚨 Pull the currently logged-in user

  const handleToggleRole = async (userId: string, currentRole: string) => {
    // 🚨 DEFENSIVE PROGRAMMING: Prevent accidental self-lockout
    if (currentRole === "admin" && currentUser?.id === userId) {
      const confirmLockout = window.confirm(
        "CRITICAL WARNING: You are about to remove your own Admin privileges. You will be immediately locked out of this Command Center. Do you wish to proceed?"
      );
      if (!confirmLockout) return;
    }

    setLoadingId(userId);
    setStatus({ type: "", text: "" }); // Clear previous messages
    
    const newRole = currentRole === "admin" ? "customer" : "admin";
    const result = await setRole(userId, newRole);
    
    if (result.success) {
      setStatus({ type: "success", text: result.message });
      // Reload session so the browser gets the new Admin/Customer token immediately
      await session?.reload(); 
      
      // Auto-clear success message after 3 seconds
      setTimeout(() => setStatus({ type: "", text: "" }), 3000);
    } else {
      setStatus({ type: "error", text: result.message || "Failed to update role." });
    }
    
    setLoadingId(null);
  };

  if (!users || users.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 p-8 text-center rounded-sm">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No personnel records found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Inline Status Banner */}
      {status.text && (
        <div className={`p-4 rounded-sm border-l-4 text-[10px] font-black uppercase tracking-widest animate-fade-in ${
          status.type === "success" 
            ? "bg-green-50 text-green-700 border-green-500" 
            : "bg-red-50 text-red-700 border-red-500"
        }`}>
          {status.text}
        </div>
      )}

      {/* Responsive Table Wrapper */}
      <div className="bg-white border border-slate-200 rounded-sm overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">User Email</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Clearance Level</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                <td className="p-4 text-xs font-bold text-brand-primary truncate max-w-[200px]">{user.email}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${
                    user.role === 'admin' 
                      ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/20' 
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {user.role || 'customer'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleToggleRole(user.id, user.role)}
                    disabled={loadingId === user.id}
                    className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-50 focus:outline-none px-3 py-1.5 rounded-sm border ${
                      user.role === "admin"
                        ? "text-red-500 hover:bg-red-50 border-transparent hover:border-red-100"
                        : "text-brand-primary hover:bg-brand-light border-transparent hover:border-brand-primary/20"
                    }`}
                  >
                    {loadingId === user.id 
                      ? "Processing..." 
                      : user.role === "admin" 
                        ? "Revoke Admin" 
                        : "Grant Admin"
                    }
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
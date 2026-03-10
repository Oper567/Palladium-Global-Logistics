"use client";

import { useState } from "react";
import { setRole } from "@/actions/admin";
import { useSession } from "@clerk/nextjs";

interface UserRecord {
  id: string;
  email: string;
  role: string;
}

export default function UserTable({ users }: { users: UserRecord[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { session } = useSession();

  const handleToggleRole = async (userId: string, currentRole: string) => {
    setLoadingId(userId);
    const newRole = currentRole === "admin" ? "customer" : "admin";
    
    const result = await setRole(userId, newRole);
    
    if (result.success) {
      // 🚨 CRITICAL: If you updated your own role, reload the session 
      // so the browser gets the new Admin token immediately.
      await session?.reload(); 
    } else {
      alert(result.message);
    }
    setLoadingId(null);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User Email</th>
            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Current Role</th>
            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
              <td className="p-4 text-xs font-bold text-brand-primary">{user.email}</td>
              <td className="p-4">
                <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-tighter rounded-full ${
                  user.role === 'admin' ? 'bg-brand-accent/10 text-brand-accent' : 'bg-slate-100 text-slate-400'
                }`}>
                  {user.role || 'customer'}
                </span>
              </td>
              <td className="p-4 text-right">
                <button
                  onClick={() => handleToggleRole(user.id, user.role)}
                  disabled={loadingId === user.id}
                  className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:text-brand-accent transition-colors disabled:opacity-50"
                >
                  {loadingId === user.id ? "Syncing..." : user.role === "admin" ? "Demote" : "Make Admin"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
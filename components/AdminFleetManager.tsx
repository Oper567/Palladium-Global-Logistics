"use client";

import React, { useState } from "react";
import { updateResource, deleteResource } from "@/app/actions/resource";
import { useRouter } from "next/navigation";

// Define the shape of our data
interface Resource {
  id: string;
  name: string;
  category: string;
  basePrice: string;
  status: string;
}

export default function AdminFleetManager({ fleet }: { fleet: Resource[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Resource>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Start Editing
  const handleEdit = (resource: Resource) => {
    setEditingId(resource.id);
    setEditData(resource); // Pre-fill the form with current data
  };

  // Save Changes
  const handleSave = async (id: string) => {
    setIsProcessing(true);
    const result = await updateResource(id, editData as Resource);
    
    if (result.success) {
      setEditingId(null);
      router.refresh(); // Tell Next.js to re-fetch the server data
    } else {
      alert(result.message);
    }
    setIsProcessing(false);
  };

  // Delete Asset
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("CRITICAL: Are you sure you want to permanently delete this asset?");
    if (!confirmDelete) return;

    setIsProcessing(true);
    const result = await deleteResource(id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.message);
    }
    setIsProcessing(false);
  };

  if (fleet.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-sm">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No fleet assets deployed yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-sm overflow-x-auto shadow-sm">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Asset Name</th>
            <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</th>
            <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Base Price (₦)</th>
            <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
            <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fleet.map((item) => {
            const isEditing = editingId === item.id;

            return (
              <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                
                {/* NAME */}
                <td className="p-4">
                  {isEditing ? (
                    <input 
                      type="text" 
                      disabled={isProcessing}
                      value={editData.name || ""} 
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className="w-full p-2 border border-brand-accent rounded-sm text-xs font-bold outline-none disabled:opacity-50"
                    />
                  ) : (
                    <span className="text-xs font-bold text-brand-primary">{item.name}</span>
                  )}
                </td>

                {/* CATEGORY */}
                <td className="p-4">
                  {isEditing ? (
                    <select 
                      disabled={isProcessing}
                      value={editData.category || "Light"} 
                      onChange={(e) => setEditData({...editData, category: e.target.value})}
                      className="p-2 border border-brand-accent rounded-sm text-xs font-bold outline-none disabled:opacity-50"
                    >
                      <option value="Light">Light</option>
                      <option value="Medium">Medium</option>
                      <option value="Heavy">Heavy</option>
                    </select>
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.category}</span>
                  )}
                </td>

                {/* PRICE */}
                <td className="p-4">
                  {isEditing ? (
                    <input 
                      type="text" 
                      disabled={isProcessing}
                      value={editData.basePrice || ""} 
                      onChange={(e) => {
                        // 🚨 UX UPGRADE: Auto-format inline edits with Naira symbol
                        const rawValue = e.target.value.replace(/[₦a-zA-Z\s]/g, "");
                        setEditData({
                          ...editData, 
                          basePrice: rawValue ? `₦ ${rawValue}` : ""
                        });
                      }}
                      className="w-full p-2 border border-brand-accent rounded-sm text-xs font-bold outline-none disabled:opacity-50"
                    />
                  ) : (
                    <span className="text-sm font-black text-brand-primary">{item.basePrice}</span>
                  )}
                </td>

                {/* STATUS */}
                <td className="p-4">
                  {isEditing ? (
                    <select 
                      disabled={isProcessing}
                      value={editData.status || "Available"} 
                      onChange={(e) => setEditData({...editData, status: e.target.value})}
                      className="p-2 border border-brand-accent rounded-sm text-xs font-bold outline-none disabled:opacity-50"
                    >
                      <option value="Available">Available</option>
                      <option value="In Use">In Use</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm ${item.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {item.status}
                    </span>
                  )}
                </td>

                {/* ACTIONS */}
                <td className="p-4 text-right space-x-3">
                  {isEditing ? (
                    <>
                      <button onClick={() => handleSave(item.id)} disabled={isProcessing} className="text-[10px] font-black uppercase tracking-widest text-green-600 hover:text-green-700 disabled:opacity-50 transition-opacity">
                        {isProcessing ? "Saving..." : "Save"}
                      </button>
                      <button onClick={() => setEditingId(null)} disabled={isProcessing} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 disabled:opacity-50 transition-opacity">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(item)} className="text-[10px] font-black uppercase tracking-widest text-brand-primary hover:text-brand-accent transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors">
                        Delete
                      </button>
                    </>
                  )}
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
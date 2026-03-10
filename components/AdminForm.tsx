"use client";

import React, { useState } from "react";
// 🚨 ABSOLUTE PATH FIX: Using '@/' alias is much safer for Next.js 16/Turbopack
import { UploadDropzone } from "@/app/utils/uploadthing"; 
import { addResource } from "@/app/actions/resource"; 
import { useRouter } from "next/navigation";
import Image from "next/image";

/**
 * AdminForm Component
 * Handles the interactive fleet deployment logic.
 * Note: Security checks are handled by the parent Server Component (app/admin/page.tsx)
 */
export default function AdminForm() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", text: "" });

    try {
      const formData = new FormData(e.currentTarget);
      
      // Execute the Server Action
      const result = await addResource(formData, imageUrl);
      
      if (result.success) {
        setStatus({ type: "success", text: result.message });
        setImageUrl("");
        (e.target as HTMLFormElement).reset();
        
        // Brief delay before redirect so the admin sees the success state
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh(); // Ensure the dashboard fetches the new data
        }, 2000);
      } else {
        setStatus({ type: "error", text: result.message || "Deployment failed." });
      }
    } catch (error) {
      console.error("Form Submission Error:", error);
      setStatus({ type: "error", text: "Critical System Sync Error." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
      
      {/* 1. DATA ENTRY COLUMN (Span 2) */}
      <div className="lg:col-span-2 bg-white p-6 md:p-10 shadow-2xl rounded-sm border-t-8 border-brand-primary">
        
        {/* Modern Status Banner */}
        {status.text && (
          <div className={`mb-8 p-4 border-l-4 animate-fade-in text-[10px] font-black uppercase tracking-widest ${
            status.type === 'success' ? 'bg-green-50 text-green-700 border-green-500' : 'bg-red-50 text-red-700 border-red-500'
          }`}>
            {status.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource Identity</label>
              <input 
                name="name" 
                placeholder="e.g. Mercedes-Benz Actros 2545" 
                className="w-full p-4 bg-slate-50 border border-slate-200 text-sm font-bold rounded-sm outline-none focus:border-brand-accent transition-all" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Baseline Price (₦)</label>
              <input 
                name="basePrice" 
                placeholder="₦ 0.00" 
                className="w-full p-4 bg-slate-50 border border-slate-200 text-sm font-bold rounded-sm outline-none focus:border-brand-accent transition-all" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
              <select name="category" className="w-full p-4 bg-slate-50 border border-slate-200 text-sm font-bold rounded-sm outline-none focus:border-brand-accent appearance-none" required>
                <option value="Light">Light Logistics (Bikes/Vans)</option>
                <option value="Medium">Medium Freight (Cargo)</option>
                <option value="Heavy">Heavy Haulage (Trucks)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Status</label>
              <select name="status" className="w-full p-4 bg-slate-50 border border-slate-200 text-sm font-bold rounded-sm outline-none focus:border-brand-accent appearance-none" required>
                <option value="Available">Available</option>
                <option value="In Use">Active Transit</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Visual (Uploadthing Sync)</label>
            <div className="border-2 border-dashed border-slate-200 p-6 rounded-sm bg-slate-50 hover:border-brand-accent transition-colors">
               <UploadDropzone 
                 endpoint="vehicleImageUploader" 
                 onClientUploadComplete={(res) => {
                   if (res && res[0]) {
                     setImageUrl(res[0].url);
                     setStatus({ type: "success", text: "Cloud sync complete: Asset image secured." });
                   }
                 }} 
                 onUploadError={(error) => setStatus({ type: "error", text: error.message })}
                 className="ut-button:bg-brand-primary ut-label:text-brand-primary ut-button:hover:bg-brand-accent ut-button:hover:text-brand-primary"
               />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-brand-primary text-white py-5 font-black uppercase tracking-[0.2em] text-xs hover:bg-brand-accent hover:text-brand-primary transition-all duration-300 shadow-xl disabled:opacity-50"
          >
            {isSubmitting ? "Executing Sync..." : "Confirm & Deploy Asset"}
          </button>
        </form>
      </div>
      
      {/* 2. PREVIEW SIDEBAR (Span 1) */}
      <div className="space-y-6 lg:sticky lg:top-24">
        <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></span>
          Real-time Preview
        </h4>
        <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden transition-all duration-500 hover:shadow-2xl">
          <div className="aspect-video relative bg-slate-100 flex items-center justify-center">
            {imageUrl ? (
              <Image src={imageUrl} alt="Asset Preview" fill className="object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <span className="text-[9px] font-black uppercase tracking-widest">Awaiting Identity</span>
              </div>
            )}
          </div>
          <div className="p-6 space-y-3 opacity-50">
            <div className="h-2 w-1/3 bg-slate-200 rounded-full"></div>
            <div className="h-4 w-full bg-slate-200 rounded-sm"></div>
          </div>
        </div>
        <p className="text-[9px] text-slate-400 font-medium italic border-l-2 border-slate-200 pl-3 leading-relaxed">
          * This card reflects the exact industrial UI your customers will see in the Palladium Portal.
        </p>
      </div>
    </div>
  );
}
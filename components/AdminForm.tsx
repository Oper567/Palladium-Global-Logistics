"use client";

import React, { useState } from "react";
import { UploadDropzone } from "@/app/utils/uploadthing"; 
import { addResource } from "@/app/actions/resource"; 
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminForm() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  // 🚨 UI UPGRADE: Track form state for the live text preview
  const [previewData, setPreviewData] = useState({
    name: "",
    basePrice: "",
    category: "Light",
    status: "Available"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // 🚨 UX UPGRADE: Auto-format the Base Price with the Naira symbol
    if (name === "basePrice") {
      // 1. Strip out any existing Naira symbols, letters, or spaces
      const rawValue = value.replace(/[₦a-zA-Z\s]/g, "");
      
      // 2. If the field is empty, clear it. If they typed a number, prepend the ₦
      const formattedPrice = rawValue.length > 0 ? `₦ ${rawValue}` : "";
      
      setPreviewData(prev => ({ ...prev, [name]: formattedPrice }));
    } else {
      setPreviewData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", text: "" });

    try {
      const formData = new FormData(e.currentTarget);
      
      // 🚨 Passes the successfully uploaded URL to the Server Action
      const result = await addResource(formData, imageUrl);
      
      if (result.success) {
        setStatus({ type: "success", text: result.message });
        setImageUrl(""); // Reset Image
        setPreviewData({ name: "", basePrice: "", category: "Light", status: "Available" }); // Reset text
        (e.target as HTMLFormElement).reset(); // Reset form
        
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh(); 
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

  const isAvailable = previewData.status === "Available";

  // 🚨 UI UPGRADE: Client-requested automatic category visuals
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "Light": return "🛵"; // Dispatch Bike
      case "Medium": return "🚐"; // Cargo Van
      case "Heavy": return "🚛"; // Heavy Truck
      default: return "📦";
    }
  };

  return (
    <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
      
      {/* 1. DATA ENTRY COLUMN (Span 2) */}
      <div className="lg:col-span-2 bg-white p-6 md:p-10 shadow-2xl rounded-sm border-t-8 border-brand-primary">
        
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
                value={previewData.name}
                onChange={handleInputChange}
                placeholder="e.g. Mercedes-Benz Actros 2545" 
                className="w-full p-4 bg-slate-50 border border-slate-200 text-sm font-bold rounded-sm outline-none focus:border-brand-accent transition-all" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Baseline Price (₦)</label>
              <input 
                name="basePrice" 
                value={previewData.basePrice}
                onChange={handleInputChange}
                placeholder="₦ 0.00" 
                className="w-full p-4 bg-slate-50 border border-slate-200 text-sm font-bold rounded-sm outline-none focus:border-brand-accent transition-all" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
              <select 
                name="category" 
                value={previewData.category}
                onChange={handleInputChange}
                className="w-full p-4 bg-slate-50 border border-slate-200 text-sm font-bold rounded-sm outline-none focus:border-brand-accent appearance-none" 
                required
              >
                <option value="Light">Light Logistics (Bikes/Vans)</option>
                <option value="Medium">Medium Freight (Cargo)</option>
                <option value="Heavy">Heavy Haulage (Trucks)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Status</label>
              <select 
                name="status" 
                value={previewData.status}
                onChange={handleInputChange}
                className="w-full p-4 bg-slate-50 border border-slate-200 text-sm font-bold rounded-sm outline-none focus:border-brand-accent appearance-none" 
                required
              >
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
                     // 🚨 CRITICAL: This line updates the live preview image instantly
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
      
      {/* 2. LIVE PREVIEW SIDEBAR (Span 1) */}
      <div className="space-y-6 lg:sticky lg:top-24">
        <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></span>
          Real-time Portal Preview
        </h4>
        
        {/* Exact match of the FleetServices.tsx UI */}
        <div className="bg-white rounded-sm overflow-hidden shadow-xl border border-slate-100 flex flex-col transition-all duration-500">
          
          {/* Image & Status Badge */}
          <div className="h-48 w-full overflow-hidden relative bg-slate-100">
            {imageUrl ? (
              // If the admin successfully uploaded an image to UploadThing, show it:
              <Image src={imageUrl} alt="Asset Preview" fill className="object-cover" />
            ) : (
              // 🚨 UI UPGRADE: If no image is uploaded yet, show the dynamic category icon instead of a gray box!
              <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-300 absolute inset-0 bg-slate-50 border-b border-slate-200">
                <span className="text-6xl">{getCategoryIcon(previewData.category)}</span>
                <span className="text-[9px] font-black uppercase tracking-widest mt-2 opacity-50">Visual Pending</span>
              </div>
            )}

            <div className="absolute top-3 left-3 z-10 flex gap-2">
              <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest rounded-sm shadow-lg backdrop-blur-md border ${
                isAvailable ? "bg-brand-accent/90 text-brand-primary border-brand-accent/50" : "bg-slate-900/90 text-white border-slate-700/50"
              }`}>
                {previewData.status}
              </span>
            </div>
          </div>

          {/* Dynamic Text Content */}
          <div className="p-5 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-3 gap-2">
              <h3 className="text-lg font-black text-brand-primary uppercase tracking-tight break-words flex-1 line-clamp-2 leading-snug">
                {previewData.name || "UNNAMED ASSET"}
              </h3>
            </div>

            <div className="mb-4">
              <span className="text-slate-400 font-bold text-[8px] bg-slate-50 px-2 py-1 border border-slate-100 uppercase tracking-widest whitespace-nowrap rounded-sm">
                {previewData.category}
              </span>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-end justify-between mt-auto">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                  Base Rate
                </span>
                <span className="text-xl font-black text-brand-primary truncate max-w-[150px]">
                  {previewData.basePrice || "₦ 0.00"}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-[9px] text-slate-400 font-medium italic border-l-2 border-slate-200 pl-3 leading-relaxed">
          * This card dynamically reflects the exact industrial UI your customers will see on the live portal.
        </p>
      </div>
    </div>
  );
}
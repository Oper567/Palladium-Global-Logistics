"use client";

import React, { useState } from "react";
// 🚨 FIX: Using relative path to avoid 'alias not found' errors on Vercel
import { UploadDropzone } from "../utils/uploadthing"; 
import { addResource } from "../actions/resource"; 
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminForm() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const result = await addResource(formData, imageUrl);
    if (result.success) {
      setStatus({ type: "success", text: result.message });
      setTimeout(() => router.push("/dashboard"), 2000);
    } else {
      setStatus({ type: "error", text: result.message || "Error" });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-8 shadow-xl border-t-4 border-brand-primary">
        {status.text && (
          <p className={`mb-4 p-3 text-[10px] font-bold uppercase ${status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {status.text}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input name="name" placeholder="Vehicle Name" className="w-full p-3 border border-slate-200 rounded-sm" required />
          <input name="basePrice" placeholder="Price (₦)" className="w-full p-3 border border-slate-200 rounded-sm" required />
          
          <div className="border-2 border-dashed border-slate-200 p-4">
             <UploadDropzone 
               endpoint="vehicleImageUploader" 
               onClientUploadComplete={(res) => res && setImageUrl(res[0].url)} 
             />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-brand-primary text-white py-4 font-black uppercase tracking-widest hover:bg-brand-accent transition-all">
            {isSubmitting ? "Syncing..." : "Deploy Asset"}
          </button>
        </form>
      </div>
      
      {/* Live Preview Sidecar */}
      <div className="bg-slate-50 p-4 border border-slate-200 h-fit">
        <h4 className="text-[10px] font-black uppercase mb-4">Preview</h4>
        <div className="aspect-video relative bg-slate-200 overflow-hidden">
          {imageUrl && <Image src={imageUrl} alt="Preview" fill className="object-cover" />}
        </div>
      </div>
    </div>
  );
}
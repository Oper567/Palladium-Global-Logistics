"use client";

import React, { useState } from "react";
import { UploadDropzone } from "@/utils/uploadthing";
import { addResource } from "@/app/actions/resource"; // 🚨 Use absolute-style path
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminForm() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const formData = new FormData(e.currentTarget);
      const result = await addResource(formData, imageUrl);

      if (result?.success) {
        setStatusMessage({ type: "success", text: result.message });
        setImageUrl("");
        (e.target as HTMLFormElement).reset();
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setStatusMessage({ type: "error", text: result?.message || "Sync failed." });
      }
    } catch (error) {
      setStatusMessage({ type: "error", text: "Critical connection failure." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-8 rounded-sm shadow-2xl border-t-4 border-brand-primary">
        {statusMessage.text && (
          <div className={`mb-6 p-4 border-l-4 text-[10px] font-black uppercase tracking-widest ${
            statusMessage.type === "success" ? "bg-green-50 text-green-700 border-green-500" : "bg-red-50 text-red-700 border-red-500"
          }`}>
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource Name</label>
              <input required name="name" type="text" className="w-full bg-slate-50 border border-slate-200 py-3 px-4 text-sm font-bold rounded-sm outline-none focus:border-brand-accent" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Baseline Price (₦)</label>
              <input required name="basePrice" type="text" className="w-full bg-slate-50 border border-slate-200 py-3 px-4 text-sm font-bold rounded-sm outline-none focus:border-brand-accent" />
            </div>
            {/* ... Other inputs (Category, Status) stay the same ... */}
          </div>

          <div className="space-y-6">
             <h3 className="text-sm font-black text-brand-primary uppercase tracking-[0.2em] border-l-4 border-brand-accent pl-3">Visual Identity</h3>
             <UploadDropzone
               endpoint="vehicleImageUploader"
               onClientUploadComplete={(res) => res && setImageUrl(res[0].url)}
               className="ut-button:bg-brand-primary ut-label:text-brand-primary border-none"
             />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-brand-primary text-white font-black uppercase tracking-[0.3em] text-xs hover:bg-brand-accent hover:text-brand-primary transition-all shadow-xl">
            {isSubmitting ? "Executing Sync..." : "Confirm & Deploy to Database"}
          </button>
        </form>
      </div>

      {/* Preview Column */}
      <div className="space-y-6">
        <h3 className="text-sm font-black text-brand-primary uppercase tracking-[0.2em]">Customer Preview</h3>
        <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden">
          <div className="h-48 bg-slate-100 relative flex items-center justify-center">
            {imageUrl ? <Image src={imageUrl} alt="Preview" fill className="object-cover" /> : <span className="text-[10px] font-black text-slate-400 uppercase">Awaiting Image</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
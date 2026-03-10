"use client";

import React, { useState } from "react";
import { UploadDropzone } from "@/utils/uploadthing";
// 🚨 Ensure this path matches exactly where you saved the Server Action
import { addResource } from "@/actions/resource"; 
import { useUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image"; // 🚨 UPGRADE: Imported Next.js Image
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Custom Toast State for better UX instead of ugly browser alerts
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error" | ""; text: string }>({ type: "", text: "" });

  // 🚨 CRITICAL UPGRADE: Dynamic Role Check
  // Replaced the hardcoded email with the dynamic Clerk publicMetadata role.
  const isAdmin = user?.publicMetadata?.role === "admin";

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-brand-primary animate-pulse bg-brand-light">
        Initializing Secure Terminal...
      </div>
    );
  }
  
  if (!isSignedIn || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-light p-6 text-center">
        <h2 className="text-2xl font-black text-brand-primary uppercase mb-4">Access Denied</h2>
        <p className="text-slate-600 mb-8 max-w-md">You do not have administrative privileges to access this command center.</p>
        <Link 
          href="/" 
          className="px-8 py-3 bg-brand-primary text-white font-bold uppercase text-xs tracking-widest rounded-sm hover:bg-brand-accent hover:text-brand-primary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage({ type: "", text: "" }); // Clear previous messages
    
    try {
      const formData = new FormData(e.currentTarget);
      
      // Call the Server Action we built
      const result = await addResource(formData, imageUrl);
      
      if (result?.success) {
        setStatusMessage({ type: "success", text: result.message });
        setImageUrl(""); // Clear the image
        (e.target as HTMLFormElement).reset(); // Clear the form fields
        
        // Redirect to dashboard after 2 seconds so Admin can see the new entry
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setStatusMessage({ type: "error", text: result?.message || "Failed to sync." });
      }
    } catch (error) {
      console.error(error);
      setStatusMessage({ type: "error", text: "SYNC ERROR: Critical connection failure." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      
      {/* Admin Header */}
      <div className="max-w-4xl w-full flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b-2 border-slate-200 pb-6 gap-4">
        <div>
          <h2 className="text-4xl font-black text-brand-primary uppercase tracking-tighter">
            Fleet <span className="text-brand-accent">Control</span>
          </h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Palladium Global Logistics HQ</p>
        </div>
        <div className="flex gap-4 items-center">
            <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-primary transition-colors focus:outline-none">
              View Portal
            </Link>
            <SignOutButton signOutOptions={{ sessionId: user.id }}>
                <button className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors focus:outline-none">
                  System Logout
                </button>
            </SignOutButton>
        </div>
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: The Form */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-sm shadow-2xl border-t-4 border-brand-primary">
          
          {/* Custom Status Toast */}
          {statusMessage.text && (
            <div className={`mb-6 p-4 rounded-sm border-l-4 text-xs font-bold uppercase tracking-widest ${
              statusMessage.type === "success" 
                ? "bg-green-50 text-green-700 border-green-500" 
                : "bg-red-50 text-red-700 border-red-500"
            }`}>
              {statusMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Form Fields... */}
            <div className="space-y-6">
              <h3 className="text-sm font-black text-brand-primary uppercase tracking-[0.2em] border-l-4 border-brand-accent pl-3">Vehicle Specifications</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource Name</label>
                  <input required id="name" name="name" type="text" placeholder="e.g. 10-Ton Flatbed Truck" className="w-full bg-slate-50 border border-slate-200 py-3 px-4 text-sm font-bold focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all rounded-sm" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="basePrice" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Baseline Price (₦)</label>
                  <input required id="basePrice" name="basePrice" type="text" placeholder="e.g. ₦120,000" className="w-full bg-slate-50 border border-slate-200 py-3 px-4 text-sm font-bold focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none transition-all rounded-sm" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operations Category</label>
                  <select required defaultValue="" id="category" name="category" className="w-full bg-slate-50 border border-slate-200 py-3 px-4 text-sm font-bold focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none appearance-none rounded-sm cursor-pointer">
                    <option value="" disabled>Select Category</option>
                    <option value="Light">Light (Dispatch Bikes)</option>
                    <option value="Medium">Medium (Cargo Vans)</option>
                    <option value="Heavy">Heavy (Industrial Haulage)</option>
                    <option value="Specialized">Specialized (Cold Chain)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="status" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deployment Status</label>
                  <select required id="status" name="status" className="w-full bg-slate-50 border border-slate-200 py-3 px-4 text-sm font-bold focus:border-brand-accent focus:ring-1 focus:ring-brand-accent outline-none appearance-none rounded-sm cursor-pointer">
                    <option value="Available">Available for Hire</option>
                    <option value="In Use">Currently In-Transit</option>
                    <option value="Maintenance">Maintenance / Offline</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="space-y-6">
              <h3 className="text-sm font-black text-brand-primary uppercase tracking-[0.2em] border-l-4 border-brand-accent pl-3">Visual Identity</h3>
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-sm p-4 transition-colors hover:border-brand-accent">
                {imageUrl ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-xs font-bold text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-200">
                      Image Securely Uploaded
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setImageUrl("")}
                      className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-700 underline underline-offset-4 focus:outline-none"
                    >
                      Remove & Upload Different Image
                    </button>
                  </div>
                ) : (
                  <UploadDropzone
                    endpoint="vehicleImageUploader"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        setImageUrl(res[0].url);
                        setStatusMessage({ type: "success", text: "Image synchronized with cloud storage." });
                      }
                    }}
                    onUploadError={(error: Error) => {
                      setStatusMessage({ type: "error", text: `UPLOAD FAILED: ${error.message}` });
                    }}
                    className="ut-button:bg-brand-primary ut-button:hover:bg-brand-accent ut-button:hover:text-brand-primary ut-button:transition-colors ut-label:text-brand-primary ut-allowed-content:text-slate-400 border-none outline-none"
                  />
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full py-5 bg-brand-primary text-white font-black uppercase tracking-[0.3em] text-xs hover:bg-brand-accent hover:text-brand-primary transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
            >
              {isSubmitting ? "Executing Sync..." : "Confirm & Deploy to Database"}
            </button>
          </form>
        </div>

        {/* Right Column: Live Preview Card */}
        <div className="space-y-6">
          <h3 className="text-sm font-black text-brand-primary uppercase tracking-[0.2em]">Customer Preview</h3>
          <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden opacity-90 transition-all duration-500 hover:opacity-100 hover:shadow-xl">
            <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
              {imageUrl ? (
                /* 🚨 UPGRADE: Swapped standard img for Next.js Image component */
                <Image 
                  src={imageUrl} 
                  alt="Live Vehicle Preview" 
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover" 
                />
              ) : (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex flex-col items-center gap-2">
                  {/* 🚨 UPGRADE: Added aria-hidden="true" to decorative SVG */}
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  Awaiting Image
                </span>
              )}
            </div>
            <div className="p-6">
              <div className="w-24 h-4 bg-slate-200 mb-3 rounded-full animate-pulse"></div>
              <div className="w-full h-6 bg-slate-200 mb-6 rounded-sm animate-pulse"></div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <div className="w-16 h-4 bg-slate-200 rounded-full"></div>
                <div className="w-16 h-6 bg-slate-200 rounded-sm"></div>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic border-l-2 border-slate-200 pl-3">
            * This is a simulation of how the vehicle will appear in the customer portal. Images are automatically optimized for mobile devices.
          </p>
        </div>

      </div>
    </div>
  );
}
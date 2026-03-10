import React from "react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Resource } from "@prisma/client";

const FleetServices = async () => {
  let fleetData: Resource[] = [];
  let fetchError = false;

  // 🚨 CONFIG: Replace this with your actual business WhatsApp number
  const WHATSAPP_NUMBER = "2348066605477"; // Example: Nigeria format

  try {
    fleetData = await prisma.resource.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Database Sync Error [FleetServices]:", error);
    fetchError = true;
  }

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "Light": return "🛵";
      case "Medium": return "🚐";
      case "Heavy": return "🚛";
      default: return "📦";
    }
  };

  return (
    <section id="fleet" className="py-24 md:py-32 bg-slate-50 w-full overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-primary uppercase tracking-tighter mb-4">
              Our <span className="text-brand-accent">Delivery</span> Fleet
            </h2>
            <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed">
              A real-time look at our available logistics resources. Deployed at your command.
            </p>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-sm shadow-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Live Status: <span className="text-brand-primary">Connected</span>
              </span>
            </div>
          </div>
        </div>

        {fetchError ? (
          <div className="py-20 text-center bg-white border border-red-100 rounded-sm">
            <p className="text-red-500 font-black uppercase tracking-widest text-sm mb-2">Database Connection Timeout</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {fleetData.length > 0 ? (
              fleetData.map((item) => {
                const isAvailable = item.status === "Available";
                
                // 🚨 LOGIC: Generate pre-filled WhatsApp message
                const whatsappMessage = encodeURIComponent(
                  `Hello Palladium Global! I would like to dispatch the following asset:\n\n` +
                  `📦 Asset: ${item.name}\n` +
                  `🏷️ Category: ${item.category}\n` +
                  `💰 Rate: ${item.basePrice}\n\n` +
                  `Is this unit available for immediate pickup?`
                );

                return (
                  <div key={item.id} className="group bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col hover:-translate-y-1">
                    
                    {/* Image Section */}
                    <div className="h-64 w-full overflow-hidden relative bg-slate-100 flex items-center justify-center">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out z-0"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full bg-slate-50 absolute inset-0">
                          <span className="text-8xl drop-shadow-sm">{getCategoryIcon(item.category)}</span>
                        </div>
                      )}

                      <div className="absolute top-4 left-4 z-10">
                        <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-sm shadow-lg border ${
                            isAvailable ? "bg-brand-accent/90 text-brand-primary border-brand-accent/50" : "bg-slate-900/90 text-white border-slate-700/50"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 flex flex-col flex-1 relative z-10 bg-white">
                      <h3 className="text-xl font-black text-brand-primary uppercase tracking-tight mb-4 line-clamp-2">
                        {item.name}
                      </h3>

                      <div className="mb-6">
                        <span className="text-slate-400 font-bold text-[9px] bg-slate-50 px-3 py-1.5 border border-slate-100 uppercase tracking-widest rounded-sm">
                          {item.category}
                        </span>
                      </div>

                      <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 line-clamp-2 flex-1">
                        Premium logistics asset currently registered in the Palladium database. Available for immediate deployment.
                      </p>

                      <div className="pt-6 border-t border-slate-100 flex items-end justify-between mt-auto">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Base Rate</span>
                          <span className="text-2xl font-black text-brand-primary">{item.basePrice}</span>
                        </div>
                        
                        {/* 🚨 THE UPGRADE: Clickable WhatsApp Dispatch Button */}
                        <a 
                          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-brand-accent transition-all hover:scale-110 active:scale-90"
                          title="Instant WhatsApp Dispatch"
                        >
                          <svg className="w-5 h-5 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-24 text-center bg-white border-2 border-dashed border-slate-200 rounded-sm">
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">Awaiting Fleet Deployment</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FleetServices;
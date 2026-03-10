import React from "react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Resource } from "@prisma/client";

// 🚨 ARCHITECTURE UPGRADE: Removed 'force-dynamic' to allow Next.js Edge Caching (ISR)
// The cache will automatically purge and update when Admins deploy new assets via Server Actions.

const AvailableResources = async () => {
  let resources: Resource[] = [];
  let fetchError = false;

  // SAFE FETCHING: Prevents 500 errors if the database connection drops
  try {
    resources = await prisma.resource.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Database fetch error [AvailableResources]:", error);
    fetchError = true;
  }

  const whatsappNumber = "2348066605477";

  return (
    <section className="py-12 bg-transparent w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-brand-primary uppercase tracking-tight break-words">
              Available Fleet <span className="text-brand-accent">&</span> Pricing
            </h2>
            <p className="text-slate-500 mt-2 text-sm md:text-base font-medium break-words max-w-2xl">
              Live telemetry of our logistics resources. Review baseline pricing and initiate dispatch directly to our command center.
            </p>
          </div>
        </div>

        {/* Data Table Wrapper */}
        <div className="bg-white rounded-sm shadow-xl overflow-hidden border-t-4 border-brand-primary">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[700px]">
              
              {/* Table Header */}
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-brand-primary uppercase text-[10px] md:text-xs tracking-[0.2em]">
                  <th scope="col" className="p-5 font-black">Asset Identity</th>
                  <th scope="col" className="p-5 font-black">Classification</th>
                  <th scope="col" className="p-5 font-black">Base Rate</th>
                  <th scope="col" className="p-5 font-black">Deployment Status</th>
                  <th scope="col" className="p-5 font-black text-right">Action</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-100">
                
                {/* 🚨 Error State */}
                {fetchError && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center bg-red-50/50">
                      <p className="text-red-600 font-black uppercase tracking-widest text-sm mb-1">Telemetry Sync Failed</p>
                      <p className="text-red-400 font-medium text-xs">Unable to load fleet database. Please contact support or refresh.</p>
                    </td>
                  </tr>
                )}

                {/* 🚨 Empty State */}
                {!fetchError && resources.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-16 text-center bg-slate-50/50">
                      <span className="inline-block p-4 bg-white shadow-sm border border-slate-100 rounded-full mb-4 text-slate-300">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                      </span>
                      <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-sm">No Assets Available</p>
                      <p className="text-slate-400 text-xs mt-2 font-medium">The command center currently has zero units ready for dispatch.</p>
                    </td>
                  </tr>
                )}

                {/* 🟢 Live Data Mapping */}
                {!fetchError && resources.map((item) => {
                  const isAvailable = item.status === "Available";
                  const waMessage = `Hello Palladium Logistics, I am interested in booking the ${item.name} (${item.category}) starting at ${item.basePrice}.`;
                  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                      
                      {/* Column 1: Image & Name */}
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          {item.imageUrl ? (
                            <div className="relative w-14 h-14 shrink-0 rounded-sm overflow-hidden border border-slate-200 shadow-sm group-hover:shadow-md transition-shadow">
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                fill
                                sizes="56px"
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          ) : (
                            <div className="w-14 h-14 shrink-0 bg-slate-100 rounded-sm border border-slate-200 flex items-center justify-center">
                              <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest text-center leading-tight">
                                No<br />Vis
                              </span>
                            </div>
                          )}
                          <span className="font-black text-brand-primary text-sm md:text-base whitespace-normal break-words leading-tight">
                            {item.name}
                          </span>
                        </div>
                      </td>

                      {/* Column 2: Category */}
                      <td className="p-5">
                        <span className="inline-block px-3 py-1.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-sm border border-slate-200">
                          {item.category}
                        </span>
                      </td>

                      {/* Column 3: Price */}
                      <td className="p-5">
                        <span className="font-black text-brand-primary text-base md:text-lg tracking-tight">
                          {item.basePrice}
                        </span>
                      </td>

                      {/* Column 4: Status Badge */}
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <span className={`relative flex h-2 w-2 ${!isAvailable && "opacity-0"}`}>
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          <span
                            className={`text-[10px] md:text-xs font-black uppercase tracking-[0.2em] ${
                              isAvailable ? "text-green-600" : "text-slate-400"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </td>

                      {/* Column 5: Action Button */}
                      <td className="p-5 text-right">
                        <a
                          href={isAvailable ? waLink : "#"}
                          target={isAvailable ? "_blank" : "_self"}
                          rel="noopener noreferrer"
                          aria-label={`Initiate dispatch for ${item.name}`}
                          className={`
                            inline-flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm transition-all duration-300 shadow-sm
                            ${
                              isAvailable
                                ? "bg-brand-primary text-white hover:bg-brand-accent hover:text-brand-primary hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none border border-slate-200"
                            }
                          `}
                        >
                          {isAvailable ? "Initiate Dispatch" : "Offline"}
                          {isAvailable && (
                            <svg className="w-3 h-3 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                          )}
                        </a>
                      </td>
                      
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default AvailableResources;
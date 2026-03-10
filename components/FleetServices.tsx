import React from "react";
import Image from "next/image"; // 🚨 UPGRADE: Next.js Image Optimizer
import { prisma } from "@/lib/prisma";
import { Resource } from "@prisma/client"; // 🚨 UPGRADE: Strict Prisma Typing

// Ensure this section always shows live data rather than a cached build version
export const dynamic = "force-dynamic";

const FleetServices = async () => {
  // Use the strict Prisma type instead of any[]
  let fleetData: Resource[] = [];
  let fetchError = false;

  // SAFE FETCHING: Protect the landing page from database connection drops
  try {
    // Fetch the latest fleet data from Supabase, limited to 3
    fleetData = await prisma.resource.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch fleet data for landing page:", error);
    fetchError = true;
  }

  return (
    <section
      id="fleet"
      className="py-16 md:py-24 bg-brand-light w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-brand-primary uppercase tracking-tight mb-4 break-words">
              Our Delivery Fleet
            </h2>
            <p className="text-gray-600 text-sm md:text-base font-medium break-words">
              Real-time look at our available logistics resources. From
              last-mile delivery to heavy industrial haulage.
            </p>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-sm shadow-sm" title="Connection to live database active">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">
                Live Availability
              </span>
            </div>
          </div>
        </div>

        {/* Error State Fallback */}
        {fetchError ? (
          <div className="py-20 text-center bg-white border border-red-100 rounded-sm shadow-sm">
            <p className="text-red-500 font-bold uppercase tracking-widest text-sm">
              Unable to sync live fleet data.
            </p>
            <p className="text-gray-400 text-xs mt-2">Please refresh the page to try again.</p>
          </div>
        ) : (
          /* Fleet Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {fleetData.length > 0 ? (
              fleetData.map((item) => {
                const isAvailable = item.status === "Available";

                return (
                  <div
                    key={item.id}
                    className="group bg-white rounded-sm overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col"
                  >
                    {/* Image Container with Status Badge */}
                    <div className="h-64 w-full overflow-hidden relative bg-slate-100">
                      {/* 🚨 UPGRADE: Replaced <img> with <Image> for automatic WebP conversion and lazy loading */}
                      <Image
                        src={
                          item.imageUrl ||
                          "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"
                        }
                        alt={item.name} // 🚨 UPGRADE: Removed "Image of" (Screen readers already announce "Image")
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* Status Overlay */}
                      <div className="absolute top-4 left-4 z-10">
                        <span
                          className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm shadow-lg ${
                            isAvailable
                              ? "bg-brand-accent text-brand-primary"
                              : "bg-slate-800 text-white"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="absolute inset-0 bg-brand-primary/10 group-hover:bg-transparent transition-colors z-0"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <h3 className="text-xl font-black text-brand-primary uppercase tracking-wide break-words flex-1 line-clamp-1">
                          {item.name}
                        </h3>
                        <span className="text-brand-primary font-bold text-[10px] md:text-xs bg-slate-50 px-2 py-1 border border-slate-100 uppercase tracking-tighter whitespace-nowrap">
                          {item.category}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2 flex-1">
                        Premium logistics asset available for your supply chain
                        requirements starting at {item.basePrice}.
                      </p>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          Base Rate
                        </span>
                        <span className="text-lg font-black text-brand-primary truncate max-w-[60%] text-right">
                          {item.basePrice}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // Fallback UI if database is empty
              <div className="col-span-full py-20 text-center bg-slate-50 border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
                  Fleet data synchronizing...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FleetServices;
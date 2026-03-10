import React from "react";
import Image from "next/image"; // 🚨 UPGRADE: Next.js Image Optimizer
import { prisma } from "@/lib/prisma";
import { Resource } from "@prisma/client"; // 🚨 UPGRADE: Strict Prisma Typing

export const dynamic = "force-dynamic"; // Ensures Next.js always fetches fresh data

const AvailableResources = async () => {
  // Use the strict Prisma type instead of any[]
  let resources: Resource[] = [];
  let fetchError = false;

  // SAFE FETCHING: Prevents 500 errors if Supabase goes to sleep
  try {
    resources = await prisma.resource.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Database fetch error:", error);
    fetchError = true;
  }

  const whatsappNumber = "2348066605477";

  return (
    <section className="py-12 bg-transparent w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-brand-primary uppercase tracking-tight break-words">
            Available Fleet & Pricing
          </h2>
          <p className="text-gray-600 mt-2 text-sm md:text-base font-medium break-words">
            Real-time resource availability and baseline pricing for your logistics needs.
          </p>
        </div>

        {/* Data Table for Resources */}
        <div className="bg-white rounded-sm shadow-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto w-full">
            {/* 🚨 UPGRADE: Added min-w-[700px] to prevent column squishing on mobile */}
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
              <thead>
                <tr className="bg-brand-primary text-white uppercase text-[10px] md:text-xs tracking-wider">
                  {/* 🚨 UPGRADE: Added scope="col" for screen-reader accessibility */}
                  <th scope="col" className="p-4 font-bold">Vehicle</th>
                  <th scope="col" className="p-4 font-bold">Details</th>
                  <th scope="col" className="p-4 font-bold">Base Price</th>
                  <th scope="col" className="p-4 font-bold">Status</th>
                  <th scope="col" className="p-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                
                {/* Error State */}
                {fetchError && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-red-500 font-medium whitespace-normal">
                      Unable to load fleet data at this time. Please try refreshing the page.
                    </td>
                  </tr>
                )}

                {/* Empty State */}
                {!fetchError && resources.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 font-medium whitespace-normal">
                      No fleet resources available at the moment. Please check back later.
                    </td>
                  </tr>
                )}

                {/* Live Data Mapping */}
                {!fetchError &&
                  resources.map((item) => {
                    const isAvailable = item.status === "Available";
                    const waMessage = `Hello Palladium Logistics, I am interested in booking the ${item.name} (${item.category}) starting at ${item.basePrice}.`;
                    const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        {/* Column 1: Image & Name */}
                        <td className="p-4">
                          <div className="flex items-center gap-3 md:gap-4">
                            {item.imageUrl ? (
                              <div className="relative w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-sm overflow-hidden border border-gray-200">
                                {/* 🚨 UPGRADE: Next.js Image Component */}
                                <Image
                                  src={item.imageUrl}
                                  alt={item.name} // Removed "Image of" for better accessibility
                                  fill
                                  sizes="(max-width: 768px) 48px, 64px"
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 bg-gray-100 rounded-sm border border-gray-200 flex items-center justify-center">
                                <span className="text-[10px] text-gray-400 font-bold uppercase text-center leading-tight">
                                  No<br />Img
                                </span>
                              </div>
                            )}
                            <span className="font-black text-brand-primary text-sm md:text-base whitespace-normal break-words">
                              {item.name}
                            </span>
                          </div>
                        </td>

                        {/* Column 2: Category */}
                        <td className="p-4 text-gray-500 text-xs md:text-sm font-bold uppercase tracking-wide">
                          {item.category}
                        </td>

                        {/* Column 3: Price */}
                        <td className="p-4 font-black text-green-700 text-sm md:text-base">
                          {item.basePrice}
                        </td>

                        {/* Column 4: Status Badge */}
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full ${
                              isAvailable
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-red-100 text-red-700 border border-red-200"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* Column 5: Action Button */}
                        <td className="p-4 text-right">
                          <a
                            href={isAvailable ? waLink : "#"}
                            target={isAvailable ? "_blank" : "_self"}
                            rel="noopener noreferrer"
                            aria-label={`Book ${item.name} on WhatsApp`}
                            className={`
                              inline-block px-4 py-2 md:px-6 md:py-3 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-sm transition-all shadow-sm
                              ${
                                isAvailable
                                  ? "bg-brand-primary text-white hover:bg-brand-accent hover:text-brand-primary hover:shadow-md hover:-translate-y-0.5"
                                  : "bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
                              }
                            `}
                          >
                            {isAvailable ? "Book Now" : "Unavailable"}
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
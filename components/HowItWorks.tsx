import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const HowItWorks = () => {
  const steps = [
    {
      num: "01",
      title: "Portal Access",
      desc: "Register in seconds to access your personalized customer portal. View our live fleet availability and current market rates anytime.",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    },
    {
      num: "02",
      title: "Live Pricing",
      desc: "No more guessing. Check real-time prices for dispatch bikes, cargo vans, or heavy trucks directly from your secure dashboard.",
      icon: "M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
    },
    {
      num: "03",
      title: "Instant Dispatch",
      desc: "Select your resource and click 'Book Now'. Our system connects you to our 24/7 command center for immediate deployment.",
      icon: "M13 10V3L4 14h7v7l9-11h-7z"
    }
  ];

  return (
    <section className="py-24 md:py-32 w-full overflow-hidden relative bg-slate-50">
      
      {/* 🚨 UPGRADE: Dynamic Background Image with Frosted Gradient Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=1600&q=80" // High-end warehouse/logistics image
          alt="Logistics Background Texture"
          fill
          quality={75}
          className="object-cover opacity-20 grayscale scale-105 animate-slow-zoom"
        />
        {/* The "Frosted Glass" gradient ensures text remains 100% readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-slate-50/95 backdrop-blur-[2px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-24 max-w-3xl mx-auto animate-slide-up">
          <span className="px-5 py-2 bg-white border border-slate-200 text-brand-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-sm mb-6 shadow-sm">
            The Palladium Way
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-primary uppercase tracking-tighter mb-8 leading-[1.1]">
            How we <span className="text-brand-accent relative inline-block">
              Move
              {/* Decorative underline */}
              <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-brand-accent opacity-50 skew-x-12"></span>
            </span> your goods
          </h2>
          <p className="text-slate-600 font-medium text-base md:text-lg leading-relaxed px-4">
            We have modernized the Nigerian logistics sector. Skip the long calls and paperwork with our streamlined, secure digital dispatch process.
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-transparent via-brand-accent/30 to-transparent z-0 animate-fade-in" aria-hidden="true"></div>

          {/* Steps Grid */}
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-12 relative z-10" role="list" aria-label="3 steps to book a dispatch">
            {steps.map((step, idx) => (
              <li 
                key={step.num} 
                className="relative z-10 flex flex-col items-center text-center group animate-slide-up opacity-0 [animation-fill-mode:forwards]"
                // 🚨 UPGRADE: Staggered animation delay! Step 1 loads instantly, Step 2 after 200ms, Step 3 after 400ms.
                style={{ animationDelay: `${idx * 200}ms` }}
              >
                
                {/* Number Circle */}
                <div className="w-24 h-24 bg-white border-4 border-slate-100 text-brand-primary font-black text-3xl flex items-center justify-center rounded-sm mb-8 shadow-xl group-hover:border-brand-accent group-hover:bg-brand-primary group-hover:text-white transition-all duration-700 ease-out group-hover:-translate-y-3 relative">
                  {step.num}
                  {/* Subtle glow effect on hover */}
                  <div className="absolute inset-0 bg-brand-accent blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 rounded-sm -z-10"></div>
                </div>

                {/* Icon Container */}
                <div className="mb-6 p-4 bg-white rounded-full text-slate-400 shadow-sm group-hover:text-brand-primary group-hover:bg-brand-accent transition-all duration-500 border border-slate-100 group-hover:scale-110">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d={step.icon} />
                  </svg>
                </div>

                {/* Text Content */}
                <h4 className="text-2xl font-black text-brand-primary mb-4 uppercase tracking-tight group-hover:text-brand-accent transition-colors duration-300">
                  {step.title}
                </h4>
                <p className="text-slate-600 font-medium leading-relaxed text-sm md:text-base px-4 max-w-xs mx-auto">
                  {step.desc}
                </p>

                {/* Decorative Arrow (Mobile) */}
                {idx !== steps.length - 1 && (
                  <div className="md:hidden mt-12 text-brand-accent opacity-50 animate-pulse" aria-hidden="true">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* Call to Action at Bottom of Steps */}
        <div className="mt-24 flex justify-center w-full animate-slide-up" style={{ animationDelay: "600ms" }}>
          <div className="inline-flex flex-col sm:flex-row items-center justify-between gap-6 p-3 bg-white rounded-sm border border-slate-200 shadow-lg w-full max-w-2xl hover:border-brand-accent/50 transition-colors duration-500">
            <p className="px-6 text-[11px] font-black text-slate-500 uppercase tracking-widest text-center sm:text-left">
              Ready to see the <span className="text-brand-primary">Palladium Fleet?</span>
            </p>
            <Link 
              href="/#fleet"
              className="w-full sm:w-auto px-10 py-5 bg-brand-primary text-white font-black uppercase text-[10px] tracking-[0.2em] hover:bg-brand-accent hover:text-brand-primary transition-all duration-300 rounded-sm shadow-md focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 text-center"
            >
              Check Live Availability
            </Link>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default HowItWorks;
import React from 'react';
import Link from 'next/link';

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
      desc: "No more guessing. Check real-time prices for dispatch bikes, cargo vans, or heavy trucks directly from your dashboard.",
      icon: "M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
    },
    {
      num: "03",
      title: "Instant Dispatch",
      desc: "Select your resource and click 'Book Now'. Our system connects you to our 24/7 command center for immediate pickup.",
      icon: "M13 10V3L4 14h7v7l9-11h-7z"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-white w-full overflow-hidden relative">
      {/* Subtle background industrial accent */}
      <div 
        className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none hidden lg:block select-none"
        aria-hidden="true"
      >
        <h2 className="text-[200px] font-black uppercase leading-none">Logistics</h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-20">
          <span className="px-4 py-1.5 bg-brand-light border border-brand-accent text-brand-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-sm mb-6">
            The Palladium Way
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-brand-primary uppercase tracking-tighter mb-6">
            How we <span className="text-brand-accent">Move</span> your goods
          </h2>
          <p className="max-w-2xl text-gray-500 font-medium text-lg leading-relaxed">
            We’ve modernized logistics. Skip the long calls and paperwork with our streamlined digital dispatch process.
          </p>
        </div>

        {/* 🚨 UPGRADE: Added a wrapper wrapper to hold the connecting line legally outside the <ol> */}
        <div className="relative">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-slate-100 z-0" aria-hidden="true"></div>

          {/* Steps Grid */}
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 relative z-10">
            {steps.map((step, idx) => (
              /* 🚨 UPGRADE: Swapped key={idx} to key={step.num} for React rendering stability */
              <li key={step.num} className="relative z-10 flex flex-col items-center text-center group">
                
                {/* Number Circle */}
                <div className="w-16 h-16 bg-white border-4 border-brand-light text-brand-primary font-black text-2xl flex items-center justify-center rounded-sm mb-8 shadow-xl group-hover:border-brand-accent group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                  {step.num}
                </div>

                {/* Icon Container */}
                <div className="mb-6 p-5 bg-slate-50 rounded-sm text-brand-primary group-hover:text-brand-accent group-hover:scale-110 transition-all duration-500 border border-slate-100 shadow-sm">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d={step.icon} />
                  </svg>
                </div>

                {/* Text Content */}
                <h4 className="text-2xl font-black text-brand-primary mb-4 uppercase tracking-tight">
                  {step.title}
                </h4>
                <p className="text-gray-500 font-medium leading-relaxed text-sm md:text-base px-2">
                  {step.desc}
                </p>

                {/* Decorative Arrow (Mobile) */}
                {idx !== steps.length - 1 && (
                  <div className="md:hidden mt-10 text-brand-accent animate-bounce" aria-hidden="true">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* Call to Action at Bottom of Steps */}
        <div className="mt-20 flex justify-center">
          <div className="inline-flex flex-col md:flex-row items-center gap-6 p-2 bg-slate-50 rounded-sm border border-slate-200">
            <p className="px-6 text-xs font-black text-brand-primary uppercase tracking-widest text-center">
              Ready to see the fleet?
            </p>
            <Link 
              href="/#fleet"
              className="px-8 py-3 bg-brand-primary text-white font-bold uppercase text-[10px] tracking-widest hover:bg-brand-accent hover:text-brand-primary transition-all rounded-sm shadow-md focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
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
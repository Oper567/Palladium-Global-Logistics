import React from "react";
import Link from "next/link";
import Image from "next/image";
// 🚨 CRITICAL FIX: Import the server-side auth helper instead of the wrapper components
import { auth } from "@clerk/nextjs/server";

// We make the component `async` so we can securely check auth status on the server
const HeroSection = async () => {
  const whatsappNumber = "2348066605477";
  const whatsappMessage =
    "Hello Palladium Global Logistics! I would like to request a delivery/pickup. Please let me know the next steps.";
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  // 1. Check if the user is logged in natively on the server
  const { userId } = await auth();
  const isSignedIn = !!userId;

  // Stat Data Array
  const fleetStats = [
    { label: "Fleet Strength", val: "50+" },
    { label: "Active Routes", val: "24/7" },
    { label: "States Covered", val: "36" },
    { label: "Client Trust", val: "99%" },
  ];

  return (
    <section className="relative min-h-[95dvh] flex flex-col items-center justify-center overflow-hidden bg-brand-primary w-full">
      {/* Dynamic Background with Subtle Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&q=80"
          alt="Palladium Global Logistics Fleet Background"
          fill
          priority
          unoptimized
          className="object-cover scale-105 animate-slow-zoom opacity-60 grayscale-[30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary via-brand-primary/90 to-transparent" aria-hidden="true"></div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-20 container mx-auto px-6 flex flex-col items-center text-center mt-16 md:mt-0">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8 animate-fade-in" role="status">
          <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" aria-hidden="true"></span>
          <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-[0.3em]">
            Nigeria&apos;s Next-Gen Supply Chain
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.95] mb-8 drop-shadow-2xl">
          Fast. Reliable. <br />
          <span className="text-brand-accent">Seamless.</span>
        </h1>

        {/* Subtext */}
        <p className="max-w-2xl text-base md:text-xl text-slate-300 font-medium leading-relaxed mb-12 px-4">
          From last-mile dispatch bikes to heavy industrial haulage. The smarter
          way to manage your logistics and supply chain across Nigeria.
        </p>

        {/* Dynamic Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
          {/* Primary Action: WhatsApp */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Request instant dispatch via WhatsApp"
            className="group w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-[#25D366] text-white font-black uppercase tracking-widest text-sm rounded-sm hover:bg-[#128C7E] transition-all duration-500 shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-brand-primary"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
            Instant Dispatch
          </a>

          {/* 2. Conditionally Render the secondary button based on the auth check */}
          {!isSignedIn ? (
            <Link
              href="/sign-up"
              className="w-full sm:w-auto px-10 py-5 bg-white text-brand-primary font-black uppercase tracking-widest text-sm rounded-sm hover:bg-brand-accent transition-all duration-500 shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-primary"
            >
              Open Account
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-10 py-5 bg-brand-accent text-brand-primary font-black uppercase tracking-widest text-sm rounded-sm hover:bg-white transition-all duration-500 shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary"
            >
              View Portal
            </Link>
          )}
        </div>

        {/* Stats / Trust Bar */}
        <ul className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-white/10 pt-10 w-full" aria-label="Company Statistics">
          {fleetStats.map((stat, i) => (
            <li key={i} className="flex flex-col">
              <span className="text-2xl md:text-3xl font-black text-white">
                {stat.val}
              </span>
              <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                {stat.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Industrial Accent Bar */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-brand-accent shadow-[0_-10px_30px_rgba(251,191,36,0.3)]"></div>
    </section>
  );
};

export default HeroSection;
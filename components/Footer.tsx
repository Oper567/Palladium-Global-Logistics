import React from 'react';
import Link from 'next/link';

const Footer = () => {
  // Evaluates on the server at build/request time
  const currentYear = new Date().getFullYear();
  const whatsappNumber = "2348066605477";
  
  // Pre-encode a default message to make it easier for the customer to start the chat
  const waMessage = "Hello Palladium Logistics, I need to make an instant dispatch request.";
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <footer className="bg-brand-primary pt-16 pb-8 w-full border-t-4 border-brand-accent overflow-hidden relative">
      {/* Subtle Background Pattern for a Professional Logistics Feel */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" aria-hidden="true">
        <svg className="h-full w-full" fill="none" viewBox="0 0 400 400">
          <defs>
            {/* 🚨 UPGRADE: Uniquely scoped the pattern ID to prevent DOM clashes */}
            <pattern id="footer-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">
                Palladium Global<br/>
                <span className="text-brand-accent text-sm tracking-[0.3em]">Logistics</span>
              </h2>
            </div>
            <p className="text-gray-400 text-sm font-light leading-relaxed max-w-xs">
              Transforming the supply chain landscape across Nigeria with speed, safety, and real-time fleet management.
            </p>
            <div className="flex flex-col gap-2">
               <span className="inline-block bg-brand-accent text-brand-primary px-3 py-1 font-black text-[10px] uppercase rounded-sm self-start shadow-sm">
                 RC: 1925948
               </span>
            </div>
          </div>

          {/* Services Col */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest mb-6 text-xs border-l-2 border-brand-accent pl-3">
              Fleet Services
            </h3>
            <ul className="flex flex-col gap-4 text-sm text-gray-400 font-medium">
              <li>
                <Link href="/#fleet" className="hover:text-brand-accent transition-colors focus:outline-none focus:ring-1 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary rounded-sm">
                  Dispatch Bikes
                </Link>
              </li>
              <li>
                <Link href="/#fleet" className="hover:text-brand-accent transition-colors focus:outline-none focus:ring-1 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary rounded-sm">
                  Cargo Vans
                </Link>
              </li>
              <li>
                <Link href="/#fleet" className="hover:text-brand-accent transition-colors focus:outline-none focus:ring-1 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary rounded-sm">
                  Heavy Haulage
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-brand-accent transition-colors focus:outline-none focus:ring-1 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-primary rounded-sm">
                  Customer Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-widest mb-6 text-xs border-l-2 border-brand-accent pl-3">
              HQ Operations
            </h3>
            <ul className="flex flex-col gap-4 text-sm text-gray-400">
              <li className="flex flex-col">
                <span className="text-[10px] uppercase text-gray-500 font-bold mb-1">Office Lines</span>
                <a href="tel:+2348066605477" className="text-white hover:text-brand-accent transition-colors">+234-806-660-5477</a>
                <a href="tel:+2348071764059" className="text-white hover:text-brand-accent transition-colors mt-1">+234-807-176-4059</a>
              </li>
              <li className="flex flex-col mt-2">
                <span className="text-[10px] uppercase text-gray-500 font-bold mb-1">Email Support</span>
                <a href="mailto:palladiumglobalresources@gmail.com" className="text-white break-all hover:text-brand-accent transition-colors">
                  palladiumglobalresources@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* WhatsApp CTA */}
          <div className="flex flex-col h-full">
            <h3 className="text-white font-bold uppercase tracking-widest mb-6 text-xs border-l-2 border-brand-accent pl-3">
              Instant Request
            </h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed flex-1">
              Connect directly with our dispatch command center via WhatsApp for instant pricing.
            </p>
            <a 
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Message Palladium Global Logistics on WhatsApp"
              className="inline-flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-black uppercase text-xs tracking-widest rounded-sm transition-all shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-brand-primary"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              Message Us Now
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest text-center md:text-left">
            &copy; {currentYear} Palladium Global Resources Limited.
          </p>
          <div className="flex items-center gap-6 text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500">
            <Link href="/admin" className="hover:text-brand-accent transition-colors focus:outline-none focus:text-brand-accent">
              Admin Entry
            </Link>
            <Link href="/privacy" className="hover:text-brand-accent transition-colors focus:outline-none focus:text-brand-accent">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-brand-accent transition-colors focus:outline-none focus:text-brand-accent">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
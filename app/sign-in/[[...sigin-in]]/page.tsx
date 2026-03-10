import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";
import Link from "next/link";

// Improve SEO and browser tab appearance
export const metadata: Metadata = {
  title: "Secure Client Login | Palladium Global Logistics",
  description: "Access your real-time fleet dashboard and manage dispatch requests.",
};

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-light relative overflow-hidden w-full">
      
      {/* Brand Background Arc */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-brand-primary rounded-b-[40px] md:rounded-b-[100px] z-0 shadow-xl" aria-hidden="true">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="h-full w-full" fill="none" viewBox="0 0 400 400">
            <defs>
              <pattern id="loginGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#loginGrid)" />
          </svg>
        </div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-4 sm:px-6">
        
        {/* Return to Home Link */}
        <Link 
          href="/" 
          className="self-start mb-6 text-brand-accent/80 hover:text-brand-accent flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent rounded-sm px-2 py-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Main Site
        </Link>

        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter drop-shadow-md">
            Palladium Global
          </h1>
          <p className="text-brand-accent text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mt-2 drop-shadow-sm">
            Secure Client Terminal
          </p>
        </div>

        {/* Customized Clerk Component */}
        <SignIn 
          // 🚨 CRITICAL UPGRADES: Hardcode routing to prevent Next.js cache loops
          path="/sign-in"
          fallbackRedirectUrl="/dashboard"
          signUpUrl="/sign-up"
          
          appearance={{
            elements: {
              card: "shadow-2xl rounded-sm border border-slate-200 bg-white",
              headerTitle: "text-brand-primary font-black uppercase tracking-tight text-xl",
              headerSubtitle: "text-slate-500 font-medium text-sm",
              formButtonPrimary: "bg-brand-primary hover:bg-brand-accent hover:text-brand-primary text-xs font-black uppercase tracking-widest transition-all duration-300 rounded-sm py-3",
              socialButtonsBlockButton: "border-slate-200 hover:bg-slate-50 rounded-sm py-3 text-slate-600 font-bold",
              formFieldInput: "rounded-sm focus:ring-2 focus:ring-brand-accent focus:border-brand-accent border-slate-200 py-2",
              formFieldLabel: "text-[10px] font-black uppercase tracking-widest text-slate-400",
              footerActionLink: "text-brand-primary hover:text-brand-accent font-bold transition-colors",
              identityPreviewEditButton: "text-brand-primary hover:text-brand-accent",
              formResendCodeLink: "text-brand-primary hover:text-brand-accent"
            }
          }}
        />
        
      </div>
    </div>
  );
}
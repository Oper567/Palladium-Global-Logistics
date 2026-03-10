"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// 🚨 BUG FIX: Removed SignedIn/SignedOut. Relying strictly on ultra-stable hooks.
import { SignInButton, SignUpButton, UserButton, useUser, useAuth } from "@clerk/nextjs";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();

  // 🚨 HYDRATION FIX: We pull `isLoaded` from useAuth to prevent SSR mismatch
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 20);
      });
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const isPortal = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  // Dynamic Admin Check via Clerk publicMetadata
  const isAdmin = isLoaded && (user?.publicMetadata as any)?.role === "admin";

  return (
    <header
      className={`
      fixed left-0 right-0 z-[100] transition-all duration-500 ease-in-out
      ${
        isScrolled
          ? "top-2 md:top-4 w-[95%] max-w-7xl mx-auto rounded-sm shadow-2xl border border-slate-200/60 bg-white/80 backdrop-blur-xl"
          : "top-0 w-full bg-white border-b border-slate-100"
      }
    `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        
        {/* Logo Section */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-3 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-4 rounded-sm"
          aria-label="Palladium Global Home"
        >
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-black text-brand-primary uppercase leading-none tracking-tighter group-hover:text-brand-accent transition-colors duration-300">
              Palladium Global
            </h1>
            <h2 className="text-[9px] md:text-[10px] font-bold text-slate-500 tracking-[0.25em] uppercase mt-1">
              {isPortal ? "Command Center" : "Logistics Portal"}
            </h2>
          </div>
        </Link>

        {/* Desktop Links & Auth */}
        <nav className="hidden lg:flex items-center gap-8 font-extrabold text-[10px] md:text-xs text-brand-primary uppercase tracking-[0.2em]">
          <Link
            href="/#fleet"
            className={`hover:text-brand-accent transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent rounded-sm px-2 py-1 ${
              pathname === "/" ? "text-brand-primary" : "text-slate-400"
            }`}
          >
            Fleet
          </Link>

          {/* 🚨 HYDRATION LOGIC: Show nothing/skeleton until Clerk confirms status */}
          {!isLoaded ? (
            <div className="w-48 h-10 bg-slate-50 rounded-sm animate-pulse"></div>
          ) : !isSignedIn ? (
            <div className="flex items-center gap-4 animate-fade-in">
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button className="hover:text-brand-accent transition-all text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-accent rounded-sm px-2 py-1">
                  Client Login
                </button>
              </SignInButton>
              
              <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button className="px-6 py-2 bg-brand-primary text-white hover:bg-brand-accent hover:text-brand-primary transition-all duration-300 rounded-sm shadow-lg border border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-1">
                  Register
                </button>
              </SignUpButton>
            </div>
          ) : (
            <div className="flex items-center gap-8 animate-fade-in">
              <Link
                href="/dashboard"
                aria-current={pathname?.startsWith("/dashboard") ? "page" : undefined}
                className={`${
                  pathname?.startsWith("/dashboard") ? "text-brand-accent" : "text-slate-400"
                } hover:text-brand-primary transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent rounded-sm px-2 py-1`}
              >
                Portal
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  aria-current={pathname?.startsWith("/admin") ? "page" : undefined}
                  className={`${
                    pathname?.startsWith("/admin") ? "text-brand-accent" : "text-slate-400"
                  } hover:text-brand-primary transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent rounded-sm px-2 py-1`}
                >
                  Admin
                </Link>
              )}

              <div className="pl-4 border-l border-slate-200 flex items-center">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8 rounded-sm hover:scale-105 transition-transform shadow-sm",
                      userButtonPopoverCard: "rounded-sm shadow-2xl border border-slate-100",
                    },
                    variables: {
                      colorPrimary: "#0f172a", 
                    }
                  }}
                />
              </div>
            </div>
          )}
        </nav>

        {/* Mobile Toggle & Auth */}
        <div className="lg:hidden flex items-center gap-4">
          {isLoaded && isSignedIn && (
             <UserButton 
                appearance={{
                  elements: { userButtonAvatarBox: "w-8 h-8 rounded-sm shadow-sm" }
                }}
             />
          )}
          <button
            className="p-2 text-brand-primary active:scale-90 transition-transform bg-slate-50 rounded-sm border border-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {isMobileMenuOpen ? (
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`
        lg:hidden overflow-hidden transition-all duration-500 ease-in-out bg-white/95 backdrop-blur-md
        ${isMobileMenuOpen ? "max-h-screen opacity-100 border-t border-slate-100 pointer-events-auto" : "max-h-0 opacity-0 pointer-events-none"}
      `}
      >
        <div className="px-6 py-10 flex flex-col gap-8 shadow-inner">
          <Link
            href="/#fleet"
            onClick={closeMenu}
            className="text-sm font-black text-brand-primary uppercase tracking-widest border-b border-slate-50 pb-4 focus:outline-none focus:text-brand-accent"
          >
            Our Fleet
          </Link>

          {!isLoaded ? (
            <div className="w-full h-24 bg-slate-50 rounded-sm animate-pulse"></div>
          ) : !isSignedIn ? (
            <div className="flex flex-col gap-8 animate-fade-in">
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button
                  onClick={closeMenu}
                  className="text-left text-sm font-black text-brand-primary uppercase tracking-widest border-b border-slate-50 pb-4 focus:outline-none focus:text-brand-accent"
                >
                  Client Sign In
                </button>
              </SignInButton>
              
              <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                <button
                  onClick={closeMenu}
                  className="w-full py-4 bg-brand-primary text-white text-sm font-black uppercase tracking-widest rounded-sm shadow-md focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 hover:bg-brand-accent hover:text-brand-primary transition-colors"
                >
                  Register Account
                </button>
              </SignUpButton>
            </div>
          ) : (
            <div className="flex flex-col gap-8 animate-fade-in">
              <Link
                href="/dashboard"
                onClick={closeMenu}
                className={`text-sm font-black uppercase tracking-widest border-b border-slate-50 pb-4 focus:outline-none focus:text-brand-primary ${
                  pathname?.startsWith("/dashboard") ? "text-brand-accent" : "text-brand-primary"
                }`}
              >
                Customer Portal
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={closeMenu}
                  className={`text-sm font-black uppercase tracking-widest focus:outline-none focus:text-brand-accent ${
                    pathname?.startsWith("/admin") ? "text-brand-accent" : "text-brand-primary"
                  }`}
                >
                  Admin Panel
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
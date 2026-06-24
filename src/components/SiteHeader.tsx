"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { AppNav, type AppSection } from "./AppNav";
import { useAuth } from "@/lib/auth-context";

type SiteHeaderProps = {
  active: AppSection;
  onNavigate: (section: AppSection) => void;
};

export function SiteHeader({ active, onNavigate }: SiteHeaderProps) {
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-600">
              For founders &amp; indie hackers
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">TrueIdeas</h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 sm:text-base">
              Find startup ideas from real Reddit complaints — problems people already talk about.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <AppNav active={active} onChange={onNavigate} />
            
            {!loading && (
              <>
                {user ? (
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                    >
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-xs font-semibold">
                        {user.displayName?.charAt(0).toUpperCase() ?? user.email?.charAt(0).toUpperCase() ?? "U"}
                      </div>
                      <span className="hidden sm:inline max-w-[100px] truncate">
                        {user.displayName ?? user.email?.split("@")[0]}
                      </span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {menuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-zinc-200 py-1 z-50">
                        <div className="px-4 py-2 border-b border-zinc-100">
                          <p className="text-sm font-medium text-zinc-900 truncate">{user.email}</p>
                          <p className="text-xs text-zinc-500 capitalize">{user.plan ?? "free"} plan</p>
                        </div>
                        {user.plan !== "pro" && (
                          <button
                            onClick={() => {
                              setMenuOpen(false);
                              onNavigate("pricing");
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-zinc-50"
                          >
                            Upgrade to Pro
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            signOut();
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
                  >
                    Sign in
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

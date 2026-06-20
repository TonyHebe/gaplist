"use client";

import { AppNav, type AppSection } from "./AppNav";

type SiteHeaderProps = {
  active: AppSection;
  onNavigate: (section: AppSection) => void;
};

export function SiteHeader({ active, onNavigate }: SiteHeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-600">
              For founders &amp; indie hackers
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">GapList</h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 sm:text-base">
              Find startup ideas from real Reddit complaints — problems people already talk about.
            </p>
          </div>
          <AppNav active={active} onChange={onNavigate} />
        </div>
      </div>
    </header>
  );
}

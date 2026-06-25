"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

type LandingPageProps = {
  total: number;
};

export function LandingPage({ total }: LandingPageProps) {
  const { user } = useAuth();
  const [email, setEmail] = useState("");

  if (user) return null;

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 bg-white/90 backdrop-blur border-b border-zinc-100">
        <span className="text-lg font-bold tracking-tight text-zinc-900">TrueIdeas</span>
        <div className="flex items-center gap-4">
          <Link href="/auth/signin" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6 pt-20 pb-24 text-center overflow-hidden">
        {/* Background grain texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "128px" }}
        />

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-medium tracking-widest text-orange-400 uppercase">Free beta — no credit card</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[0.95] mb-8">
            Stop guessing.<br />
            <span className="text-orange-500">Build from pain.</span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto leading-relaxed mb-12">
            TrueIdeas scans Reddit daily for real founder complaints and unmet needs —
            so you always know what problems are worth building for.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="rounded-full bg-orange-500 px-8 py-4 text-base font-semibold text-white hover:bg-orange-400 transition-colors shadow-lg shadow-orange-500/20"
            >
              Start for free →
            </Link>
            <Link
              href="/auth/signin"
              className="rounded-full border border-zinc-700 px-8 py-4 text-base font-medium text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative mt-20 flex flex-wrap justify-center gap-x-12 gap-y-4">
          {[
            { value: `${total}+`, label: "Problems tracked" },
            { value: "10", label: "Startup subreddits" },
            { value: "Daily", label: "Fresh problems" },
            { value: "AI", label: "Pain scoring" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400 mb-4">How it works</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 mb-16 leading-tight max-w-2xl">
            From Reddit complaint to startup idea — in seconds.
          </h2>

          <div className="grid md:grid-cols-3 gap-px bg-zinc-200">
            {[
              {
                num: "01",
                title: "We scan Reddit daily",
                desc: "Our crawler monitors 10+ startup subreddits — r/SaaS, r/startups, r/Entrepreneur and more — picking up real complaints and unmet needs.",
              },
              {
                num: "02",
                title: "AI scores every problem",
                desc: "Each post gets a pain score (1–10), a category tag, and an AI summary. No fluff — just signal strength.",
              },
              {
                num: "03",
                title: "You find what to build",
                desc: "Search by keyword, filter by pain level, save the best threads, and let AI generate startup ideas from the patterns it sees.",
              },
            ].map((step) => (
              <div key={step.num} className="bg-white p-8 group">
                <p className="text-6xl font-bold text-zinc-100 mb-6 group-hover:text-orange-100 transition-colors">
                  {step.num}
                </p>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">{step.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-zinc-950 px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500 mb-4">Features</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-16 max-w-xl leading-tight">
            Everything you need to validate faster.
          </h2>

          <div className="space-y-px">
            {[
              {
                tag: "Problems",
                title: "Search real complaints",
                desc: "Full-text search across thousands of Reddit posts. Filter by subreddit, pain level, or category. Every card links to the original thread.",
                accent: "bg-orange-500",
              },
              {
                tag: "AI Ideas",
                title: "Ideas generated from patterns",
                desc: "Our AI reads hundreds of problems and generates startup concepts with confidence scores. Not random ideas — grounded in real data.",
                accent: "bg-violet-500",
              },
              {
                tag: "Scraped",
                title: "What founders are building now",
                desc: "Live feed of new projects posted on r/SideProject, r/indiehackers and more. See what's being launched this week.",
                accent: "bg-emerald-500",
              },
              {
                tag: "Save",
                title: "Build your shortlist",
                desc: "Bookmark problems worth exploring. Come back later, compare them, and decide what to build with confidence.",
                accent: "bg-blue-500",
              },
            ].map((f) => (
              <div key={f.tag} className="flex flex-col sm:flex-row sm:items-center gap-6 py-8 border-b border-zinc-800 group">
                <div className="sm:w-32 shrink-0">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold text-white ${f.accent}`}>
                    {f.tag}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{f.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
                <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quote / Social proof ── */}
      <section className="px-6 py-24 bg-orange-50">
        <div className="max-w-4xl mx-auto text-center">
          <svg className="w-10 h-10 text-orange-300 mx-auto mb-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <p className="text-2xl sm:text-3xl font-semibold text-zinc-900 leading-relaxed mb-8 max-w-2xl mx-auto">
            "The best startup ideas come from problems people are already complaining about.
            Stop searching for ideas — find the pain."
          </p>
          <p className="text-sm text-zinc-500 uppercase tracking-widest">TrueIdeas — built for founders</p>
        </div>
      </section>

      {/* ── Pricing teaser ── */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400 mb-4 text-center">Pricing</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 mb-16 text-center">Simple, honest pricing.</h2>

          <div className="grid sm:grid-cols-2 gap-px bg-zinc-200 rounded-2xl overflow-hidden">
            {/* Free */}
            <div className="bg-white p-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Free</p>
              <p className="text-5xl font-bold text-zinc-900 mb-1">$0</p>
              <p className="text-zinc-500 text-sm mb-8">Forever free, no card needed</p>
              <ul className="space-y-3 mb-10">
                {["Search all problems", "Browse platforms", "View AI summaries", "Scraped ideas feed"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-zinc-700">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className="block w-full rounded-full border-2 border-zinc-900 py-3 text-center text-sm font-semibold text-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors"
              >
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-zinc-950 p-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-4">Pro</p>
              <p className="text-5xl font-bold text-white mb-1">$19</p>
              <p className="text-zinc-500 text-sm mb-8">per month</p>
              <ul className="space-y-3 mb-10">
                {["Everything in Free", "Save & shortlist problems", "AI-generated startup ideas", "Priority access to new features", "Early supporter badge"].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-zinc-300">
                    <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className="block w-full rounded-full bg-orange-500 py-3 text-center text-sm font-semibold text-white hover:bg-orange-400 transition-colors"
              >
                Start with Pro →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 py-24 bg-zinc-950 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Your next startup idea<br />
            <span className="text-orange-500">is already on Reddit.</span>
          </h2>
          <p className="text-zinc-400 text-lg mb-12">
            Join TrueIdeas and start finding validated problems to build for — free, today.
          </p>

          <form
            onSubmit={(e) => { e.preventDefault(); window.location.href = `/auth/signup?email=${encodeURIComponent(email)}`; }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 rounded-full bg-zinc-800 border border-zinc-700 px-5 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
            <button
              type="submit"
              className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-400 transition-colors shrink-0"
            >
              Get started free
            </button>
          </form>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 py-8 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-bold text-zinc-500">TrueIdeas</span>
          <p className="text-xs text-zinc-600">
            © 2026 TrueIdeas · findtrueideas.com · Built for founders
          </p>
          <div className="flex gap-6">
            <Link href="/auth/signin" className="text-xs text-zinc-600 hover:text-zinc-400">Sign in</Link>
            <Link href="/auth/signup" className="text-xs text-zinc-600 hover:text-zinc-400">Sign up</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

"use client";

import { useState } from "react";

const freeFeatures = [
  { name: "Search problems", included: true },
  { name: "Last 48 hours only", included: true, note: "Limited" },
  { name: "Save to Solutions", included: false },
  { name: "Ask AI briefings", included: false },
  { name: "Advanced filters", included: false },
  { name: "New platforms (G2, App Store…)", included: false },
];

const proFeatures = [
  { name: "Search problems", included: true },
  { name: "All time access", included: true, highlight: true },
  { name: "Unlimited saves", included: true, highlight: true },
  { name: "Ask AI briefings", included: true, highlight: true },
  { name: "All filters + sorting", included: true },
  { name: "New platforms as they launch", included: true },
];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function PricingPanel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("No checkout URL returned");
        setLoading(false);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Failed to connect to payment server");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
          Pricing
        </p>
        <h2 className="mt-2 text-3xl font-bold text-zinc-900">
          Start free, upgrade when ready
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-zinc-600">
          Browse problems for free. Upgrade to Pro to save ideas and unlock AI.
        </p>
      </div>

      {/* Pricing cards */}
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        {/* Free tier */}
        <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-900">Free</h3>
            <div className="mt-2">
              <span className="text-4xl font-bold text-zinc-900">$0</span>
            </div>
            <p className="mt-2 text-sm text-zinc-500">
              Browse recent problems, no account needed
            </p>
          </div>

          <ul className="mb-8 flex-1 space-y-3">
            {freeFeatures.map((feature) => (
              <li key={feature.name} className="flex items-center gap-3 text-sm">
                {feature.included ? (
                  <CheckIcon className="h-5 w-5 shrink-0 text-emerald-500" />
                ) : (
                  <XIcon className="h-5 w-5 shrink-0 text-zinc-300" />
                )}
                <span className={feature.included ? "text-zinc-700" : "text-zinc-400"}>
                  {feature.name}
                  {feature.note && (
                    <span className="ml-1 text-xs text-zinc-400">({feature.note})</span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="w-full rounded-xl border border-zinc-300 bg-white py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            Current Plan
          </button>
        </div>

        {/* Pro tier */}
        <div className="relative flex flex-col rounded-2xl border-2 border-orange-400 bg-white p-8 shadow-lg">
          {/* Popular badge */}
          <div className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1 text-xs font-semibold text-white">
            POPULAR
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-900">TrueIdeas Pro</h3>
            <div className="mt-2">
              <span className="text-4xl font-bold text-orange-600">$19</span>
              <span className="text-zinc-500">/month</span>
            </div>
            <p className="mt-2 text-sm text-zinc-500">
              Full access to find your next startup idea
            </p>
          </div>

          <ul className="mb-8 flex-1 space-y-3">
            {proFeatures.map((feature) => (
              <li key={feature.name} className="flex items-center gap-3 text-sm">
                <CheckIcon
                  className={`h-5 w-5 shrink-0 ${
                    feature.highlight ? "text-orange-500" : "text-emerald-500"
                  }`}
                />
                <span
                  className={feature.highlight ? "font-medium text-zinc-900" : "text-zinc-700"}
                >
                  {feature.name}
                </span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={handleCheckout}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-sm font-semibold text-white transition hover:from-orange-600 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Redirecting…" : "Upgrade to Pro"}
          </button>

          {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
        </div>
      </div>

      {/* Trust line */}
      <p className="text-center text-xs text-zinc-500">
        Cancel anytime · No questions asked · Secure payment via Stripe
      </p>

      {/* FAQ */}
      <div className="mx-auto max-w-2xl">
        <h3 className="mb-4 text-center text-lg font-semibold text-zinc-900">
          Frequently asked questions
        </h3>
        <div className="space-y-4">
          <details className="rounded-xl border border-zinc-200 bg-white px-5 py-4">
            <summary className="cursor-pointer font-medium text-zinc-900">
              What&apos;s included in the free plan?
            </summary>
            <p className="mt-3 text-sm text-zinc-600">
              You can search and browse problems from the last 48 hours. To save ideas, use Ask AI,
              or access older problems, upgrade to Pro.
            </p>
          </details>
          <details className="rounded-xl border border-zinc-200 bg-white px-5 py-4">
            <summary className="cursor-pointer font-medium text-zinc-900">
              Can I cancel anytime?
            </summary>
            <p className="mt-3 text-sm text-zinc-600">
              Yes. Cancel with one click from your account settings. No questions, no hassle.
            </p>
          </details>
          <details className="rounded-xl border border-zinc-200 bg-white px-5 py-4">
            <summary className="cursor-pointer font-medium text-zinc-900">
              What sources are included?
            </summary>
            <p className="mt-3 text-sm text-zinc-600">
              Today: 10+ startup subreddits (r/SaaS, r/indiehackers, r/startups, etc.). Coming soon:
              G2, Capterra, App Store reviews, Hacker News, Product Hunt.
            </p>
          </details>
          <details className="rounded-xl border border-zinc-200 bg-white px-5 py-4">
            <summary className="cursor-pointer font-medium text-zinc-900">
              Is there a lifetime deal?
            </summary>
            <p className="mt-3 text-sm text-zinc-600">
              Not yet — but early subscribers will get first access if we launch one.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}

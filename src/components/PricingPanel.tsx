"use client";

import { useState } from "react";

const features = [
  "Unlimited problem searches",
  "Save unlimited threads to Solutions",
  "All 10+ startup subreddits",
  "Pain score & category filters",
  "Ask AI briefings",
  "New platforms as they launch (G2, App Store…)",
  "Priority support",
];

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
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Pricing</p>
        <h2 className="mt-2 text-3xl font-bold text-zinc-900">Simple, founder-friendly pricing</h2>
        <p className="mx-auto mt-3 max-w-xl text-zinc-600">
          Start free for 7 days. Cancel anytime. No credit card required to try.
        </p>
      </div>

      {/* Pricing card */}
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border-2 border-orange-300 bg-white p-8 shadow-lg">
          {/* Badge */}
          <div className="mb-4 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
            7-day free trial
          </div>

          {/* Price */}
          <div className="mb-6">
            <span className="text-5xl font-bold text-zinc-900">$19</span>
            <span className="text-xl text-zinc-500">/month</span>
          </div>

          {/* Description */}
          <p className="mb-6 text-sm text-zinc-600">
            Full access to all features. Find validated startup ideas from real complaints — not
            shower thoughts.
          </p>

          {/* CTA */}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={loading}
            className="mb-4 w-full rounded-xl bg-orange-600 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Redirecting…" : "Start free trial"}
          </button>
          
          {error && (
            <p className="mb-4 text-center text-sm text-red-600">{error}</p>
          )}

          {/* Features list */}
          <ul className="space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-zinc-700">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Trust line */}
        <p className="mt-4 text-center text-xs text-zinc-500">
          Cancel anytime · No questions asked · Secure payment via Stripe
        </p>
      </div>

      {/* FAQ */}
      <div className="mx-auto max-w-2xl">
        <h3 className="mb-4 text-center text-lg font-semibold text-zinc-900">
          Frequently asked questions
        </h3>
        <div className="space-y-4">
          <details className="rounded-xl border border-zinc-200 bg-white px-5 py-4">
            <summary className="cursor-pointer font-medium text-zinc-900">
              What happens after the 7-day trial?
            </summary>
            <p className="mt-3 text-sm text-zinc-600">
              You&apos;ll be charged $19/month to continue. Cancel before day 7 and you won&apos;t
              pay anything.
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

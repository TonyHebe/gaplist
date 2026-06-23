"use client";

import { useState } from "react";

type UpgradeModalProps = {
  feature: "save" | "ask-ai";
  onClose: () => void;
  onContinueFree?: () => void;
};

const featureText = {
  save: {
    title: "Save unlimited ideas with Pro",
    description: "Free users can browse problems, but saving requires Pro. Upgrade to build your personal idea library.",
  },
  "ask-ai": {
    title: "Ask AI is a Pro feature",
    description: "Get AI-powered briefings and insights from your saved problems. Upgrade to unlock Ask AI.",
  },
};

export function UpgradeModal({ feature, onClose, onContinueFree }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const text = featureText[feature];

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
          <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold text-zinc-900">{text.title}</h3>
        <p className="mt-2 text-sm text-zinc-600">{text.description}</p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-sm font-semibold text-white transition hover:from-orange-600 hover:to-amber-600 disabled:opacity-50"
          >
            {loading ? "Redirecting…" : "Upgrade to Pro — $19/mo"}
          </button>
          
          {onContinueFree && (
            <button
              type="button"
              onClick={onContinueFree}
              className="w-full rounded-xl border border-zinc-200 py-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
            >
              Continue with Free
            </button>
          )}
          
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-zinc-500 hover:text-zinc-700"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

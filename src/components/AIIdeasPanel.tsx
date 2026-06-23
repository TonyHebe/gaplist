"use client";

import { useEffect, useState } from "react";
import type { AIIdea } from "@/lib/types";

const categoryColors: Record<string, string> = {
  SaaS: "bg-blue-100 text-blue-700",
  FinTech: "bg-emerald-100 text-emerald-700",
  "Health & Wellness": "bg-rose-100 text-rose-700",
  Productivity: "bg-violet-100 text-violet-700",
  "Developer Tools": "bg-slate-100 text-slate-700",
  "E-commerce": "bg-amber-100 text-amber-700",
  Education: "bg-cyan-100 text-cyan-700",
  Marketing: "bg-orange-100 text-orange-700",
  "HR & Recruiting": "bg-pink-100 text-pink-700",
  Other: "bg-zinc-100 text-zinc-700",
};

function getConfidenceColor(confidence: number): string {
  if (confidence >= 85) return "text-emerald-600";
  if (confidence >= 75) return "text-blue-600";
  if (confidence >= 65) return "text-amber-600";
  return "text-zinc-500";
}

function IdeaCard({ idea }: { idea: AIIdea }) {
  const categoryClass = categoryColors[idea.category] ?? categoryColors.Other;
  const confidenceColor = getConfidenceColor(idea.confidence);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-purple-300 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${categoryClass}`}>
          {idea.category}
        </span>
        <span className={`flex items-center gap-1 text-sm font-semibold ${confidenceColor}`}>
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {idea.confidence}%
        </span>
      </div>

      <h3 className="mb-2 text-lg font-bold text-zinc-900">{idea.name}</h3>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-zinc-600">{idea.description}</p>

      {idea.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {idea.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-3">
        <span className="text-xs text-zinc-400">
          {idea.signals_count} signals · {new Date(idea.created_at).toLocaleDateString()}
        </span>
      </div>
    </article>
  );
}

export function AIIdeasPanel() {
  const [ideas, setIdeas] = useState<AIIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIdeas() {
      try {
        const res = await fetch("/api/ai-ideas");
        const data = await res.json();
        setIdeas(data.ideas ?? []);
      } catch (err) {
        setError("Failed to load AI ideas");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchIdeas();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
          <p className="mt-4 text-sm text-zinc-600">Loading AI Ideas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-purple-50 to-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
            <svg
              className="h-8 w-8 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-zinc-900">AI Ideas</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600">
            AI-generated startup concepts will appear here. Run the generation to create ideas from your problem database.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Run SQL migration first
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">AI Ideas</h2>
          <p className="mt-1 text-sm text-zinc-600">
            {ideas.length} startup concepts generated from problem patterns
          </p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3">
        {ideas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </div>
    </div>
  );
}

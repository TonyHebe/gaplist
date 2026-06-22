"use client";

import { useState } from "react";
import type { ScoutAnalysis } from "@/lib/scout-types";
import { SCOUT_STARTERS } from "@/lib/scout-types";
import type { GapPost } from "@/lib/types";
import { PostCard } from "./PostCard";

type ScoutPanelProps = {
  savedIds: Set<string>;
  onToggleSave: (postId: string) => void;
};

export function ScoutPanel({ savedIds, onToggleSave }: ScoutPanelProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ScoutAnalysis | null>(null);
  const [citedPosts, setCitedPosts] = useState<GapPost[]>([]);
  const [postsAnalyzed, setPostsAnalyzed] = useState(0);

  async function runScout(nextQuestion: string) {
    const trimmed = nextQuestion.trim();
    if (!trimmed) return;

    setQuestion(trimmed);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/scout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Scout failed");
      }

      setAnalysis(payload.analysis);
      setCitedPosts(payload.citedPosts ?? []);
      setPostsAnalyzed(payload.postsAnalyzed ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Ask AI</p>
        <h2 className="mt-2 text-xl font-semibold text-zinc-900">Builder briefing from saved pains</h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600">
          Ask a founder question. AI reads your database and returns a structured brief — not a chat
          thread. Every insight links back to real Reddit posts.
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            runScout(question);
          }}
          className="mt-4 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="e.g. What workflow tool should I prototype first?"
            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-orange-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="shrink-0 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {loading ? "Thinking..." : "Ask AI"}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {SCOUT_STARTERS.map((starter) => (
            <button
              key={starter}
              type="button"
              onClick={() => runScout(starter)}
              className="rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs text-zinc-700 transition hover:border-orange-400"
            >
              {starter}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600">
          AI is reading {postsAnalyzed || "your"} saved posts...
        </div>
      ) : null}

      {analysis && !loading ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Briefing · {postsAnalyzed} posts analyzed
            </p>
            <h3 className="mt-2 text-2xl font-semibold leading-snug text-zinc-900">{analysis.headline}</h3>

            {analysis.opportunities.length > 0 ? (
              <div className="mt-5">
                <h4 className="text-sm font-semibold text-zinc-800">Opportunities spotted</h4>
                <ul className="mt-2 space-y-2 text-sm text-zinc-600">
                  {analysis.opportunities.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-orange-500">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {analysis.build_ideas.length > 0 ? (
              <div className="mt-5">
                <h4 className="text-sm font-semibold text-zinc-800">Build ideas</h4>
                <ul className="mt-2 space-y-2 text-sm text-zinc-600">
                  {analysis.build_ideas.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-emerald-500">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </article>

          <aside className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <h4 className="text-sm font-semibold text-zinc-800">Caveat</h4>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              {analysis.watch_out || "Validate demand before building. AI summarizes public posts, not market size."}
            </p>
            <p className="mt-4 text-xs text-zinc-500">
              Ask AI uses your saved TrueIdeas posts only. Run fetch to refresh the dataset.
            </p>
          </aside>
        </div>
      ) : null}

      {citedPosts.length > 0 && !loading ? (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Source posts cited
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {citedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isSaved={savedIds.has(post.id)}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

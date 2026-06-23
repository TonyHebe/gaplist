"use client";

import { useEffect, useState } from "react";
import type { ScrapedIdea } from "@/lib/types";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function IdeaCard({ idea }: { idea: ScrapedIdea }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
          r/{idea.subreddit}
        </span>
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            {idea.upvotes}
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {idea.comments_count}
          </span>
        </div>
      </div>

      <h3 className="mb-2 line-clamp-2 text-base font-bold leading-snug text-zinc-900 group-hover:text-blue-700">
        <a href={idea.permalink} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
          {idea.title}
        </a>
      </h3>

      {idea.description && (
        <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-500">
          {idea.description}
        </p>
      )}

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
          u/{idea.author} · {formatDate(idea.created_utc)}
        </span>
        <a
          href={idea.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          View →
        </a>
      </div>
    </article>
  );
}

export function ScrapedPanel() {
  const [ideas, setIdeas] = useState<ScrapedIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIdeas() {
      try {
        const res = await fetch("/api/scraped-ideas");
        const data = await res.json();
        setIdeas(data.ideas ?? []);
      } catch (err) {
        setError("Failed to load scraped ideas");
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
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="mt-4 text-sm text-zinc-600">Loading Scraped Ideas...</p>
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
        <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-blue-50 to-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-zinc-900">Scraped Ideas</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600">
            Real projects and ideas from Reddit will appear here. Run the fetch to scrape from r/SideProject, r/indiehackers, and more.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800">
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
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600">
              r/SideProject
            </span>
            <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600">
              r/indiehackers
            </span>
            <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600">
              r/startups
            </span>
            <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600">
              r/IMadeThis
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">Scraped Ideas</h2>
          <p className="mt-1 text-sm text-zinc-600">
            {ideas.length} projects & ideas from Reddit
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

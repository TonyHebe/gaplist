"use client";

import { useEffect, useState } from "react";
import { PROBLEM_SIGNALS } from "@/lib/problem-signals";
import type { GapPost } from "@/lib/types";
import { FeedFilters, type FilterMode } from "./FeedFilters";
import { PostCard } from "./PostCard";

type FeedListProps = {
  posts: GapPost[];
  savedIds: Set<string>;
  onToggleSave: (postId: string) => void;
};
const SEARCH_TIMEOUT_MS = 20_000;

async function runSearch(mode: FilterMode, query: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SEARCH_TIMEOUT_MS);

  try {
    const response = await fetch(
      `/api/search?mode=${encodeURIComponent(mode)}&q=${encodeURIComponent(query)}`,
      { signal: controller.signal },
    );
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error ?? "Search failed");
    }

    return payload as {
      posts: GapPost[];
      message?: string;
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Search timed out. Try Subreddit mode with indiehackers.");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export function FeedList({ posts, savedIds, onToggleSave }: FeedListProps) {
  const [mode, setMode] = useState<FilterMode>("subreddit");
  const [value, setValue] = useState("");
  const [appliedValue, setAppliedValue] = useState("");
  const [displayPosts, setDisplayPosts] = useState(posts);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!appliedValue) {
      setDisplayPosts(posts);
    }
  }, [posts, appliedValue]);

  function withSavedState(results: GapPost[]) {
    return results.map((post) => ({
      ...post,
      saved: savedIds.has(post.id),
      saved_at: post.saved_at ?? null,
    }));
  }
  async function handleSearch() {
    const query = value.trim();
    setAppliedValue(query);
    setError(null);

    if (!query) {
      setDisplayPosts(posts);
      setMessage("Showing all saved problems.");
      return;
    }

    setLoading(true);
    setMessage("Searching... usually under 15 seconds.");

    try {
      const payload = await runSearch(mode, query);
      setDisplayPosts(withSavedState(payload.posts ?? []));
      setMessage(payload.message ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setMessage(null);
    } finally {
      setLoading(false);
    }
  }

  async function runQuickSearch(nextMode: FilterMode, nextValue: string) {
    setMode(nextMode);
    setValue(nextValue);
    setAppliedValue(nextValue);
    setError(null);
    setLoading(true);
    setMessage("Searching... usually under 15 seconds.");

    try {
      const payload = await runSearch(nextMode, nextValue);
      setDisplayPosts(withSavedState(payload.posts ?? []));
      setMessage(payload.message ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setMessage(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <FeedFilters
        mode={mode}
        value={value}
        appliedValue={appliedValue}
        onModeChange={setMode}
        onValueChange={setValue}
        onSearch={handleSearch}
        visibleCount={displayPosts.length}
        totalCount={posts.length}
        loading={loading}
      />

      {message ? <p className="mb-4 text-sm text-zinc-600">{message}</p> : null}
      {error ? <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      <details className="mb-6 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
        <summary className="cursor-pointer font-medium text-zinc-800">
          How GapList finds problems
        </summary>
        <p className="mt-3 leading-relaxed">
          Search checks saved posts first (instant), then Reddit if needed. Subreddit mode is
          fastest. Keyword mode scans a few startup communities in parallel.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PROBLEM_SIGNALS.slice(0, 8).map((signal) => (
            <button
              key={signal}
              type="button"
              onClick={() => runQuickSearch("keyword", signal)}
              className="rounded-full bg-white px-2.5 py-1 text-xs text-zinc-700 ring-1 ring-zinc-200 transition hover:ring-orange-300"
            >
              {signal}
            </button>
          ))}
        </div>
      </details>

      {loading ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600">
          Searching... usually under 15 seconds.
        </div>
      ) : displayPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
          <h2 className="text-lg font-semibold text-zinc-900">No problems found</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Try <strong>Subreddit</strong> mode with <strong>indiehackers</strong>.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {displayPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isSaved={savedIds.has(post.id)}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      )}
    </>
  );
}

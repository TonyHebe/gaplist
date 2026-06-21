"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, PROBLEM_SIGNALS } from "@/lib/constants";
import type { GapPost } from "@/lib/types";
import { FeedFilters, type FilterMode } from "./FeedFilters";
import { PostCard } from "./PostCard";

type PainFilter = "all" | "high" | "medium" | "low";
type SortOrder = "newest" | "pain";
type CategoryFilter = "all" | string;

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
  const [painFilter, setPainFilter] = useState<PainFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
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

  const filteredSorted = useMemo(() => {
    let result = displayPosts;

    if (painFilter === "high") result = result.filter((p) => p.pain_score !== null && p.pain_score >= 8);
    else if (painFilter === "medium") result = result.filter((p) => p.pain_score !== null && p.pain_score >= 5 && p.pain_score < 8);
    else if (painFilter === "low") result = result.filter((p) => p.pain_score !== null && p.pain_score < 5);

    if (categoryFilter !== "all") result = result.filter((p) => p.category === categoryFilter);

    if (sortOrder === "pain") {
      result = [...result].sort((a, b) => (b.pain_score ?? 0) - (a.pain_score ?? 0));
    } else {
      result = [...result].sort(
        (a, b) => new Date(b.created_utc).getTime() - new Date(a.created_utc).getTime(),
      );
    }

    return result;
  }, [displayPosts, painFilter, categoryFilter, sortOrder]);

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
        visibleCount={filteredSorted.length}
        totalCount={posts.length}
        loading={loading}
      />

      {/* Quick filter bar */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {/* Pain level */}
        <div className="flex items-center gap-1 rounded-xl border border-zinc-200 bg-white p-1">
          {(["all", "high", "medium", "low"] as PainFilter[]).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setPainFilter(level)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
                painFilter === level
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {level === "all" ? "All pain" : level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        {/* Category */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 outline-none focus:border-orange-300"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as SortOrder)}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 outline-none focus:border-orange-300"
        >
          <option value="newest">Newest first</option>
          <option value="pain">Highest pain</option>
        </select>

        {/* Quick signal chips */}
        <div className="flex flex-wrap gap-1">
          {PROBLEM_SIGNALS.slice(0, 6).map((signal) => (
            <button
              key={signal}
              type="button"
              onClick={() => runQuickSearch("keyword", signal)}
              className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] text-zinc-600 transition hover:bg-orange-100 hover:text-orange-700"
            >
              {signal}
            </button>
          ))}
        </div>
      </div>

      {message ? <p className="mb-4 text-sm text-zinc-600">{message}</p> : null}
      {error ? <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      {loading ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600">
          Searching… usually under 15 seconds.
        </div>
      ) : filteredSorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
          <h2 className="text-lg font-semibold text-zinc-900">No problems found</h2>
          <p className="mt-2 text-sm text-zinc-600">
            {displayPosts.length > 0
              ? "Try changing the filters above."
              : <>Try <strong>Subreddit</strong> mode with <strong>indiehackers</strong>.</>}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:grid-cols-3">
          {filteredSorted.map((post) => (
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

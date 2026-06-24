"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, SUBREDDITS } from "@/lib/constants";
import { PLATFORMS, type PlatformId } from "@/lib/platforms";
import type { GapPost } from "@/lib/types";
import { PostCard } from "./PostCard";

type PlatformPanelProps = {
  posts: GapPost[];
  savedIds: Set<string>;
  onToggleSave: (postId: string) => void;
  onPostClick?: (post: GapPost) => void;
};

type PainFilter = "all" | "high" | "medium" | "low";
type SortOrder = "newest" | "pain";
type CategoryFilter = "all" | string;

export function PlatformPanel({ posts, savedIds, onToggleSave, onPostClick }: PlatformPanelProps) {
  const [platform, setPlatform] = useState<PlatformId>("reddit");
  const [subreddit, setSubreddit] = useState<string>("all");
  const [painFilter, setPainFilter] = useState<PainFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const activePlatform = PLATFORMS.find((item) => item.id === platform)!;
  const isLive = activePlatform.status === "live";

  const filteredSorted = useMemo(() => {
    let result = posts;

    // Subreddit filter
    if (isLive && subreddit !== "all") {
      result = result.filter(
        (post) => post.subreddit.toLowerCase() === subreddit.toLowerCase(),
      );
    }

    // Pain filter
    if (painFilter === "high") result = result.filter((p) => p.pain_score !== null && p.pain_score >= 8);
    else if (painFilter === "medium") result = result.filter((p) => p.pain_score !== null && p.pain_score >= 5 && p.pain_score < 8);
    else if (painFilter === "low") result = result.filter((p) => p.pain_score !== null && p.pain_score < 5);

    // Category filter
    if (categoryFilter !== "all") result = result.filter((p) => p.category === categoryFilter);

    // Sort
    if (sortOrder === "pain") {
      result = [...result].sort((a, b) => (b.pain_score ?? 0) - (a.pain_score ?? 0));
    } else {
      result = [...result].sort(
        (a, b) => new Date(b.created_utc).getTime() - new Date(a.created_utc).getTime(),
      );
    }

    return result;
  }, [posts, subreddit, isLive, painFilter, categoryFilter, sortOrder]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Platform</p>
        <h2 className="mt-2 text-xl font-semibold text-zinc-900">Browse problems by source</h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600">
          Pick where pain signals come from. Reddit is live today — more platforms are on the way.
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PLATFORMS.map((item) => {
            const selected = platform === item.id;
            const disabled = item.status !== "live";

            return (
              <button
                key={item.id}
                type="button"
                disabled={disabled}
                onClick={() => {
                  setPlatform(item.id);
                  setSubreddit("all");
                }}
                className={`rounded-xl border px-4 py-3 text-left transition ${
                  selected
                    ? "border-orange-300 bg-orange-50 shadow-sm"
                    : disabled
                      ? "cursor-not-allowed border-zinc-200 bg-zinc-50 opacity-60"
                      : "border-zinc-200 bg-white hover:border-orange-200"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-zinc-900">{item.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      item.status === "live"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-zinc-200 text-zinc-600"
                    }`}
                  >
                    {item.status === "live" ? "Live" : "Soon"}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">{item.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {isLive ? (
        <>
          {/* Subreddit picker */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="mb-3 text-sm font-medium text-zinc-700">Subreddits on Reddit</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSubreddit("all")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  subreddit === "all"
                    ? "bg-orange-600 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-orange-100 hover:text-orange-700"
                }`}
              >
                All
              </button>
              {SUBREDDITS.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSubreddit(name)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    subreddit.toLowerCase() === name.toLowerCase()
                      ? "bg-orange-600 text-white"
                      : "bg-zinc-100 text-zinc-700 hover:bg-orange-100 hover:text-orange-700"
                  }`}
                >
                  r/{name}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-zinc-500">
              Showing {filteredSorted.length} of {posts.length} problems
              {subreddit !== "all" ? ` from r/${subreddit}` : " from Reddit"}
            </p>
          </div>

          {/* Quick filter bar */}
          <div className="flex flex-wrap items-center gap-2">
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
          </div>

          {filteredSorted.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
              <h2 className="text-lg font-semibold text-zinc-900">No problems match these filters</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Try changing the filters above or selecting a different subreddit.
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
                  onClick={onPostClick ? () => onPostClick(post) : undefined}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
          <h2 className="text-lg font-semibold text-zinc-900">{activePlatform.name} is coming soon</h2>
          <p className="mt-2 text-sm text-zinc-600">
            We&apos;re building {activePlatform.name.toLowerCase()} ingestion next. Use Reddit or Search
            for now.
          </p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { SUBREDDITS } from "@/lib/constants";
import { PLATFORMS, type PlatformId } from "@/lib/platforms";
import type { GapPost } from "@/lib/types";
import { PostCard } from "./PostCard";

type PlatformPanelProps = {
  posts: GapPost[];
  savedIds: Set<string>;
  onToggleSave: (postId: string) => void;
};

export function PlatformPanel({ posts, savedIds, onToggleSave }: PlatformPanelProps) {
  const [platform, setPlatform] = useState<PlatformId>("reddit");
  const [subreddit, setSubreddit] = useState<string>("all");

  const activePlatform = PLATFORMS.find((item) => item.id === platform)!;
  const isLive = activePlatform.status === "live";

  const filteredPosts = useMemo(() => {
    if (!isLive || subreddit === "all") return posts;
    return posts.filter(
      (post) => post.subreddit.toLowerCase() === subreddit.toLowerCase(),
    );
  }, [posts, subreddit, isLive]);

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
              Showing {filteredPosts.length} of {posts.length} problems
              {subreddit !== "all" ? ` from r/${subreddit}` : " from Reddit"}
            </p>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
              <h2 className="text-lg font-semibold text-zinc-900">No problems in this subreddit yet</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Try <strong>All</strong> or another community. The daily fetch adds fresh posts.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:grid-cols-3">
              {filteredPosts.map((post) => (
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

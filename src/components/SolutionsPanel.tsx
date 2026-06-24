"use client";

import type { GapPost } from "@/lib/types";
import { PostCard } from "./PostCard";

type SolutionsPanelProps = {
  posts: GapPost[];
  savedIds: Set<string>;
  onToggleSave: (postId: string) => void;
  onBrowseProblems: () => void;
  onPostClick?: (post: GapPost) => void;
};

export function SolutionsPanel({
  posts,
  savedIds,
  onToggleSave,
  onBrowseProblems,
  onPostClick,
}: SolutionsPanelProps) {
  const savedPosts = posts
    .filter((post) => savedIds.has(post.id))
    .sort((a, b) => {
      const aTime = a.saved_at ? new Date(a.saved_at).getTime() : 0;
      const bTime = b.saved_at ? new Date(b.saved_at).getTime() : 0;
      return bTime - aTime;
    });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-900">Your saved threads</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Threads you bookmarked from Problems. These are the pains you want to explore or build for.
        </p>
        <p className="mt-2 text-sm font-medium text-zinc-800">{savedPosts.length} saved</p>
      </div>

      {savedPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
          <h3 className="text-lg font-semibold text-zinc-900">No saved threads yet</h3>
          <p className="mt-2 text-sm text-zinc-600">
            Go to Problems, find a thread worth building for, and click <strong>Save</strong>.
          </p>
          <button
            type="button"
            onClick={onBrowseProblems}
            className="mt-4 rounded-xl bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
          >
            Browse problems
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:grid-cols-3">
          {savedPosts.map((post) => (
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
    </div>
  );
}

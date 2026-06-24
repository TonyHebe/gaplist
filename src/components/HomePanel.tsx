"use client";

import { SUBREDDITS } from "@/lib/constants";
import type { GapPost } from "@/lib/types";
import { PostCard } from "./PostCard";

type HomePanelProps = {
  posts: GapPost[];
  total: number;
  savedIds: Set<string>;
  onToggleSave: (postId: string) => void;
  onBrowseProblems: () => void;
  onViewSolutions: () => void;
  onPostClick?: (post: GapPost) => void;
};

export function HomePanel({
  posts,
  total,
  savedIds,
  onToggleSave,
  onBrowseProblems,
  onViewSolutions,
  onPostClick,
}: HomePanelProps) {
  const recent = posts.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Tracked</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">{total}</p>
          <p className="mt-1 text-sm text-zinc-600">problem posts saved</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Sources</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">{SUBREDDITS.length}</p>
          <p className="mt-1 text-sm text-zinc-600">startup subreddits</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">Saved</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">{savedIds.size}</p>
          <p className="mt-1 text-sm text-zinc-600">threads in Solutions</p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-900">Stop guessing what to build</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
          TrueIdeas pulls public Reddit posts where founders describe real frustrations and unmet needs.
          Search by keyword or subreddit, bookmark the best threads, and build from pain people already
          expressed.
        </p>
        <ol className="mt-4 space-y-2 text-sm text-zinc-700">
          <li>
            <strong>1.</strong> Open <strong>Problems → Search</strong> and try a keyword like{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">invoicing</code> or{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">r/SaaS</code>
          </li>
          <li>
            <strong>2.</strong> Click <strong>Save</strong> on threads worth exploring
          </li>
          <li>
            <strong>3.</strong> Review your shortlist under <strong>Solutions</strong>
          </li>
        </ol>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onBrowseProblems}
            className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
          >
            Try it free — browse problems
          </button>
          <button
            type="button"
            onClick={onViewSolutions}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:border-orange-300"
          >
            View solutions
          </button>
        </div>
      </div>

      {recent.length > 0 ? (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Latest problems
          </h3>
          <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:grid-cols-3">
            {recent.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isSaved={savedIds.has(post.id)}
                onToggleSave={onToggleSave}
                onClick={onPostClick ? () => onPostClick(post) : undefined}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

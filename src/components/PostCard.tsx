"use client";

import type { GapPost } from "@/lib/types";
import { formatRelativeTime, painColor, painLabel } from "@/lib/utils";

type PostCardProps = {
  post: GapPost;
  isSaved?: boolean;
  onToggleSave?: (postId: string) => void;
};

export function PostCard({ post, isSaved = false, onToggleSave }: PostCardProps) {
  return (
    <article className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-orange-300 hover:shadow-md">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded-full bg-orange-50 px-2.5 py-1 font-medium text-orange-700">
          r/{post.subreddit}
        </span>
        {post.category ? (
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-700">
            {post.category}
          </span>
        ) : null}
        <span className={`rounded-full px-2.5 py-1 font-medium ${painColor(post.pain_score)}`}>
          {painLabel(post.pain_score)}
          {post.pain_score ? ` · ${post.pain_score}/10` : ""}
        </span>
        <span className="text-zinc-400">{formatRelativeTime(post.created_utc)}</span>
        {onToggleSave ? (
          <button
            type="button"
            onClick={() => onToggleSave(post.id)}
            className={`ml-auto rounded-full px-3 py-1 text-xs font-medium transition ${
              isSaved
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : "bg-zinc-100 text-zinc-600 hover:bg-orange-100 hover:text-orange-700"
            }`}
          >
            {isSaved ? "Saved ✓" : "Save"}
          </button>
        ) : null}
      </div>

      <h2 className="mb-2 text-lg font-semibold leading-snug text-zinc-900 group-hover:text-orange-700">
        <a href={post.permalink} target="_blank" rel="noopener noreferrer">
          {post.title}
        </a>
      </h2>

      {post.snippet ? (
        <p className="mb-4 text-sm leading-relaxed text-zinc-600">{post.snippet}</p>
      ) : null}

      <a
        href={post.permalink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700"
      >
        View on Reddit →
      </a>
    </article>
  );
}

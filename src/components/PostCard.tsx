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
      {/* Top row: source + category + pain score + save */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Platform source */}
          <span className="flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 font-semibold text-orange-700">
            <svg className="h-3 w-3 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <circle cx="10" cy="10" r="10" className="fill-orange-600" />
              <path
                d="M16.67 10a1.46 1.46 0 0 0-2.47-1 7.12 7.12 0 0 0-3.85-1.23l.65-3.08 2.13.45a1 1 0 1 0 .18-.93l-2.38-.5a.25.25 0 0 0-.3.19l-.73 3.44a7.14 7.14 0 0 0-3.89 1.23 1.46 1.46 0 1 0-1.61 2.39 2.87 2.87 0 0 0 0 .44c0 2.24 2.61 4.06 5.83 4.06s5.83-1.82 5.83-4.06a2.87 2.87 0 0 0 0-.44 1.46 1.46 0 0 0 .51-1.96zM7.27 11a1 1 0 1 1 1 1 1 1 0 0 1-1-1zm5.58 2.65a3.58 3.58 0 0 1-2.85.57 3.58 3.58 0 0 1-2.85-.57.19.19 0 0 1 .27-.27 3.2 3.2 0 0 0 2.58.47 3.2 3.2 0 0 0 2.58-.47.19.19 0 0 1 .27.27zm-.14-1.65a1 1 0 1 1 1-1 1 1 0 0 1-1 1z"
                fill="white"
              />
            </svg>
            r/{post.subreddit}
          </span>

          {post.category ? (
            <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-600">
              {post.category}
            </span>
          ) : null}

          <span className="text-zinc-400">{formatRelativeTime(post.created_utc)}</span>
        </div>

        {/* Pain score badge + save — right side */}
        <div className="flex shrink-0 items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${painColor(post.pain_score)}`}>
            {post.pain_score ? `${post.pain_score}/10` : painLabel(post.pain_score)}
          </span>
          {onToggleSave ? (
            <button
              type="button"
              onClick={() => onToggleSave(post.id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                isSaved
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  : "bg-zinc-100 text-zinc-600 hover:bg-orange-100 hover:text-orange-700"
              }`}
            >
              {isSaved ? "Saved ✓" : "Save"}
            </button>
          ) : null}
        </div>
      </div>

      {/* Pain label line */}
      <p className={`mb-2 text-[11px] font-semibold uppercase tracking-wider ${
        post.pain_score !== null
          ? post.pain_score >= 8
            ? "text-rose-600"
            : post.pain_score >= 5
              ? "text-amber-600"
              : "text-emerald-600"
          : "text-zinc-400"
      }`}>
        {painLabel(post.pain_score)}
      </p>

      {/* Title */}
      <h2 className="mb-2 text-base font-semibold leading-snug text-zinc-900 group-hover:text-orange-700">
        <a href={post.permalink} target="_blank" rel="noopener noreferrer">
          {post.title}
        </a>
      </h2>

      {/* Snippet */}
      {post.snippet ? (
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-zinc-500">{post.snippet}</p>
      ) : null}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-zinc-400">Reddit · {post.subreddit}</span>
        <a
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700"
        >
          View thread →
        </a>
      </div>
    </article>
  );
}

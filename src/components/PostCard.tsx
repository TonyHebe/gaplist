"use client";

import type { GapPost } from "@/lib/types";
import { categoryColor, extractTags, painColor, painLabel } from "@/lib/utils";

type PostCardProps = {
  post: GapPost;
  isSaved?: boolean;
  onToggleSave?: (postId: string) => void;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function PostCard({ post, isSaved = false, onToggleSave }: PostCardProps) {
  const tags = extractTags(`${post.title} ${post.snippet ?? ""}`, 3);

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-orange-300 hover:shadow-md">
      {/* Top row: category badge (left) + score (right) */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${categoryColor(post.category)}`}
        >
          {post.category ?? "Uncategorized"}
        </span>

        <span
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${painColor(
            post.pain_score,
          )}`}
        >
          <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 3a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1zm0 9a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2z" />
          </svg>
          {post.pain_score ? `${post.pain_score}/10` : painLabel(post.pain_score)}
        </span>
      </div>

      {/* Title */}
      <h2 className="mb-1.5 line-clamp-2 text-base font-bold leading-snug text-zinc-900 group-hover:text-orange-700">
        <a href={post.permalink} target="_blank" rel="noopener noreferrer">
          {post.title}
        </a>
      </h2>

      {/* Description */}
      {post.snippet ? (
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-zinc-500">{post.snippet}</p>
      ) : null}

      {/* Tag pills */}
      {tags.length > 0 ? (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      {/* Footer — source line + actions, pinned to bottom */}
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-zinc-100 pt-3">
        <span className="truncate text-[11px] text-zinc-400">
          Reddit · r/{post.subreddit} · {formatDate(post.created_utc)}
        </span>

        <div className="flex shrink-0 items-center gap-2">
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
          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-orange-600 hover:text-orange-700"
          >
            View →
          </a>
        </div>
      </div>
    </article>
  );
}

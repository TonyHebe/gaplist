"use client";

import { useEffect, useState } from "react";
import type { GapPost } from "@/lib/types";
import { categoryColor, painColor, painLabel } from "@/lib/utils";

type Comment = {
  id: string;
  author: string;
  body: string;
  score: number;
  created_utc: string;
  depth: number;
};

type PostDetail = {
  title: string;
  selftext: string | null;
  author: string;
  score: number;
  num_comments: number;
  created_utc: string;
};

type PostDetailModalProps = {
  post: GapPost;
  onClose: () => void;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div
      className="border-l-2 border-zinc-200 pl-4"
      style={{ marginLeft: comment.depth * 16 }}
    >
      <div className="mb-1 flex items-center gap-2 text-xs text-zinc-500">
        <span className="font-medium text-zinc-700">u/{comment.author}</span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          {comment.score}
        </span>
        <span>·</span>
        <span>{formatDate(comment.created_utc)}</span>
      </div>
      <p className="text-sm text-zinc-700 whitespace-pre-wrap">{comment.body}</p>
    </div>
  );
}

export function PostDetailModal({ post, onClose }: PostDetailModalProps) {
  const [loading, setLoading] = useState(true);
  const [postDetail, setPostDetail] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/comments?permalink=${encodeURIComponent(post.permalink)}`);
        const data = await res.json();
        
        if (data.error) {
          setError(data.error);
        } else {
          setPostDetail(data.post);
          setComments(data.comments ?? []);
        }
      } catch (err) {
        setError("Failed to load comments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, [post.permalink]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-16">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${categoryColor(post.category)}`}>
              {post.category ?? "Uncategorized"}
            </span>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${painColor(post.pain_score)}`}>
              Pain: {post.pain_score ? `${post.pain_score}/10` : painLabel(post.pain_score)}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {/* Title */}
          <h2 className="text-xl font-bold text-zinc-900">{post.title}</h2>
          
          {/* Meta */}
          <div className="mt-2 flex items-center gap-3 text-sm text-zinc-500">
            <span>r/{post.subreddit}</span>
            {postDetail && (
              <>
                <span>·</span>
                <span>u/{postDetail.author}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  {postDetail.score}
                </span>
                <span>·</span>
                <span>{postDetail.num_comments} comments</span>
              </>
            )}
          </div>

          {/* Post body */}
          {loading ? (
            <div className="mt-6 flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600" />
            </div>
          ) : error ? (
            <div className="mt-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          ) : (
            <>
              {postDetail?.selftext && (
                <div className="mt-4 rounded-xl bg-zinc-50 p-4">
                  <p className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">
                    {postDetail.selftext}
                  </p>
                </div>
              )}

              {/* View on Reddit button */}
              <div className="mt-6">
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                  </svg>
                  View on Reddit
                </a>
              </div>

              {/* Comments section */}
              {comments.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
                    Comments ({comments.length})
                  </h3>
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <CommentItem key={comment.id} comment={comment} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-zinc-300 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

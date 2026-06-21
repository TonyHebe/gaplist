import { PROBLEM_SIGNALS } from "./problem-signals";

export function matchesProblemSignal(text: string): boolean {
  const normalized = text.toLowerCase();
  return PROBLEM_SIGNALS.some((signal) => normalized.includes(signal));
}

export function buildSnippet(title: string, body: string, maxLength = 240): string {
  const combined = body.trim() ? `${title}. ${body.trim()}` : title;
  const collapsed = combined.replace(/\s+/g, " ").trim();
  if (collapsed.length <= maxLength) return collapsed;
  return `${collapsed.slice(0, maxLength - 1).trimEnd()}…`;
}

export function toPermalink(permalink: string): string {
  return permalink.startsWith("http")
    ? permalink
    : `https://www.reddit.com${permalink}`;
}

export function formatRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${Math.max(minutes, 1)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function painLabel(score: number | null): string {
  if (score === null) return "Unscored";
  if (score >= 8) return "High pain";
  if (score >= 5) return "Medium pain";
  return "Low pain";
}

export function painColor(score: number | null): string {
  if (score === null) return "bg-zinc-100 text-zinc-600";
  if (score >= 8) return "bg-rose-100 text-rose-700";
  if (score >= 5) return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

// Colored badge per category, IdeaHunter-style.
export function categoryColor(category: string | null): string {
  switch (category) {
    case "SaaS":
      return "bg-violet-50 text-violet-700 ring-1 ring-violet-200";
    case "Marketing":
      return "bg-pink-50 text-pink-700 ring-1 ring-pink-200";
    case "Operations":
      return "bg-sky-50 text-sky-700 ring-1 ring-sky-200";
    case "Finance":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "HR":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
    case "DevTools":
      return "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200";
    case "E-commerce":
      return "bg-orange-50 text-orange-700 ring-1 ring-orange-200";
    case "Productivity":
      return "bg-teal-50 text-teal-700 ring-1 ring-teal-200";
    case "Analytics":
      return "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200";
    default:
      return "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200";
  }
}

// Pull up to `limit` problem-signal phrases that appear in the post text — used as tag pills.
export function extractTags(text: string, limit = 3): string[] {
  const normalized = text.toLowerCase();
  const hits = PROBLEM_SIGNALS.filter((signal) => normalized.includes(signal));
  return hits.slice(0, limit);
}

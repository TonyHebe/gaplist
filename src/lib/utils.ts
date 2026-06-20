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

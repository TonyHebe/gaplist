"use client";

import type { FormEvent } from "react";

export type FilterMode = "subreddit" | "keyword";

type FeedFiltersProps = {
  mode: FilterMode;
  value: string;
  appliedValue: string;
  onModeChange: (mode: FilterMode) => void;
  onValueChange: (value: string) => void;
  onSearch: () => void;
  visibleCount: number;
  totalCount: number;
  loading?: boolean;
};

export function FeedFilters({
  mode,
  value,
  appliedValue,
  onModeChange,
  onValueChange,
  onSearch,
  visibleCount,
  totalCount,
  loading = false,
}: FeedFiltersProps) {
  const placeholder =
    mode === "subreddit" ? "e.g. indiehackers or r/SaaS" : "e.g. frustrated with, looking for a tool";

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSearch();
  }

  return (
    <div className="mb-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex shrink-0 items-center gap-2 text-sm font-medium text-zinc-700">
          Filter by
          <select
            value={mode}
            onChange={(event) => onModeChange(event.target.value as FilterMode)}
            className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-orange-300"
          >
            <option value="subreddit">Subreddit</option>
            <option value="keyword">Keyword</option>
          </select>
        </label>

        <input
          type="text"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-orange-300"
        />

        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-xl bg-orange-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      <p className="mt-3 text-sm text-zinc-500">
        Showing {visibleCount} of {totalCount} problems
        {appliedValue.trim() ? ` matching "${appliedValue.trim()}"` : ""}
      </p>
    </div>
  );
}

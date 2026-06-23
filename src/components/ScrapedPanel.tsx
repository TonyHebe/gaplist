"use client";

export function ScrapedPanel() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <svg
            className="h-8 w-8 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-zinc-900">Scraped Ideas</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600">
          Real startup ideas and projects scraped from Reddit, G2, Product Hunt, and more. 
          See what founders are actually building.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Coming soon
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600">
            r/SideProject
          </span>
          <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600">
            r/indiehackers
          </span>
          <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600">
            Product Hunt
          </span>
          <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600">
            G2 Reviews
          </span>
        </div>
      </div>
    </div>
  );
}

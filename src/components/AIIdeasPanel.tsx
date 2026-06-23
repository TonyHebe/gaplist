"use client";

export function AIIdeasPanel() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-purple-50 to-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
          <svg
            className="h-8 w-8 text-purple-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-zinc-900">AI Ideas</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600">
          AI-generated startup concepts synthesized from problem patterns. 
          Fresh ideas with confidence scores, categories, and market signals.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800">
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
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Analyzed</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">500+</p>
            <p className="text-xs text-zinc-500">problems</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Generated</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">—</p>
            <p className="text-xs text-zinc-500">ideas daily</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Categories</p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">10+</p>
            <p className="text-xs text-zinc-500">industries</p>
          </div>
        </div>
      </div>
    </div>
  );
}

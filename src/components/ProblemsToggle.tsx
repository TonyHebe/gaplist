"use client";

export type ProblemsMode = "search" | "ask-ai" | "platform";

type ProblemsToggleProps = {
  mode: ProblemsMode;
  onChange: (mode: ProblemsMode) => void;
};

export function ProblemsToggle({ mode, onChange }: ProblemsToggleProps) {
  return (
    <div className="mb-6 inline-flex rounded-2xl border border-zinc-200 bg-zinc-100 p-1">
      <button
        type="button"
        onClick={() => onChange("search")}
        className={`rounded-xl px-5 py-2 text-sm font-medium transition ${
          mode === "search" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
        }`}
      >
        Search
      </button>
      <button
        type="button"
        onClick={() => onChange("ask-ai")}
        className={`rounded-xl px-5 py-2 text-sm font-medium transition ${
          mode === "ask-ai" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
        }`}
      >
        Ask AI
      </button>
      <button
        type="button"
        onClick={() => onChange("platform")}
        className={`rounded-xl px-5 py-2 text-sm font-medium transition ${
          mode === "platform" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
        }`}
      >
        Platform
      </button>
    </div>
  );
}

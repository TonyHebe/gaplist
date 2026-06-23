"use client";

export type IdeasMode = "solutions" | "scraped" | "ai-ideas";

type IdeasToggleProps = {
  mode: IdeasMode;
  onChange: (mode: IdeasMode) => void;
};

export function IdeasToggle({ mode, onChange }: IdeasToggleProps) {
  return (
    <div className="mb-6 inline-flex rounded-2xl border border-zinc-200 bg-zinc-100 p-1">
      <button
        type="button"
        onClick={() => onChange("solutions")}
        className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
          mode === "solutions"
            ? "bg-white text-zinc-900 shadow-sm"
            : "text-zinc-600 hover:text-zinc-900"
        }`}
      >
        Solutions
      </button>
      <button
        type="button"
        onClick={() => onChange("scraped")}
        className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
          mode === "scraped"
            ? "bg-white text-zinc-900 shadow-sm"
            : "text-zinc-600 hover:text-zinc-900"
        }`}
      >
        Scraped
      </button>
      <button
        type="button"
        onClick={() => onChange("ai-ideas")}
        className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
          mode === "ai-ideas"
            ? "bg-white text-zinc-900 shadow-sm"
            : "text-zinc-600 hover:text-zinc-900"
        }`}
      >
        AI Ideas
      </button>
    </div>
  );
}

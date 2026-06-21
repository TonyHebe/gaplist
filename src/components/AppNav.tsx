"use client";

export type AppSection = "home" | "problems" | "solutions" | "pricing";

type AppNavProps = {
  active: AppSection;
  onChange: (section: AppSection) => void;
};

const sections: { id: AppSection; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "problems", label: "Problems" },
  { id: "solutions", label: "Solutions" },
  { id: "pricing", label: "Pricing" },
];

export function AppNav({ active, onChange }: AppNavProps) {
  return (
    <nav className="flex flex-wrap gap-1 rounded-2xl border border-zinc-200 bg-zinc-100 p-1">
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => onChange(section.id)}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition sm:px-5 ${
            active === section.id
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          {section.label}
        </button>
      ))}
    </nav>
  );
}

export type ScoutAnalysis = {
  headline: string;
  opportunities: string[];
  build_ideas: string[];
  watch_out: string;
  cited_post_ids: string[];
};

export const SCOUT_STARTERS = [
  "What micro-SaaS could I ship in a weekend from these pains?",
  "Which problems have the highest pain scores right now?",
  "What manual workflows are founders tired of?",
  "Any unmet needs in DevTools or marketing tools?",
  "What are indie hackers struggling to find software for?",
] as const;

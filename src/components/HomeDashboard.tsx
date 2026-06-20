"use client";

import { useCallback, useState } from "react";
import type { AppSection } from "./AppNav";
import { FeedList } from "./FeedList";
import { HomePanel } from "./HomePanel";
import { ProblemsToggle, type ProblemsMode } from "./ProblemsToggle";
import { ScoutPanel } from "./ScoutPanel";
import { SiteHeader } from "./SiteHeader";
import { BetaBanner } from "./BetaBanner";
import { SaveSetupBanner } from "./SaveSetupBanner";
import { SolutionsPanel } from "./SolutionsPanel";
import type { GapPost } from "@/lib/types";

type HomeDashboardProps = {
  posts: GapPost[];
  total: number;
  saveReady?: boolean;
  supabaseUrl?: string;
};

export function HomeDashboard({
  posts: initialPosts,
  total,
  saveReady = true,
  supabaseUrl,
}: HomeDashboardProps) {
  const [section, setSection] = useState<AppSection>("home");
  const [problemsMode, setProblemsMode] = useState<ProblemsMode>("search");
  const [posts, setPosts] = useState(initialPosts);
  const [savedIds, setSavedIds] = useState(
    () => new Set(initialPosts.filter((post) => post.saved).map((post) => post.id)),
  );
  const [saveError, setSaveError] = useState<string | null>(null);

  function goToProblems(mode: ProblemsMode = "search") {
    setSection("problems");
    setProblemsMode(mode);
  }

  const toggleSave = useCallback(async (postId: string) => {
    if (!saveReady) {
      setSaveError("Run the database migration first (see banner above).");
      return;
    }

    const nextSaved = !savedIds.has(postId);
    setSaveError(null);

    setSavedIds((current) => {
      const updated = new Set(current);
      if (nextSaved) updated.add(postId);
      else updated.delete(postId);
      return updated;
    });

    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? { ...post, saved: nextSaved, saved_at: nextSaved ? new Date().toISOString() : null }
          : post,
      ),
    );

    try {
      const response = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, saved: nextSaved }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Failed to save");
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to save");

      setSavedIds((current) => {
        const updated = new Set(current);
        if (nextSaved) updated.delete(postId);
        else updated.add(postId);
        return updated;
      });

      setPosts((current) =>
        current.map((post) =>
          post.id === postId
            ? { ...post, saved: !nextSaved, saved_at: !nextSaved ? new Date().toISOString() : null }
            : post,
        ),
      );
    }
  }, [savedIds, saveReady]);

  return (
    <>
      <BetaBanner />
      <SiteHeader active={section} onNavigate={setSection} />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {!saveReady ? <SaveSetupBanner supabaseUrl={supabaseUrl} /> : null}
        {saveError ? (
          <p className="mb-6 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{saveError}</p>
        ) : null}
        {section === "home" ? (
          <HomePanel
            posts={posts}
            total={total}
            savedIds={savedIds}
            onToggleSave={toggleSave}
            onBrowseProblems={() => goToProblems("search")}
            onViewSolutions={() => setSection("solutions")}
          />
        ) : null}

        {section === "problems" ? (
          <>
            <ProblemsToggle mode={problemsMode} onChange={setProblemsMode} />
            {problemsMode === "search" ? (
              <FeedList posts={posts} savedIds={savedIds} onToggleSave={toggleSave} />
            ) : (
              <ScoutPanel savedIds={savedIds} onToggleSave={toggleSave} />
            )}
          </>
        ) : null}

        {section === "solutions" ? (
          <SolutionsPanel
            posts={posts}
            savedIds={savedIds}
            onToggleSave={toggleSave}
            onBrowseProblems={() => goToProblems("search")}
          />
        ) : null}
      </div>
    </>
  );
}

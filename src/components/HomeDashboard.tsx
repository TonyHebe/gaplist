"use client";

import { useCallback, useEffect, useState } from "react";
import type { AppSection } from "./AppNav";
import { FeedList } from "./FeedList";
import { HomePanel } from "./HomePanel";
import { ProblemsToggle, type ProblemsMode } from "./ProblemsToggle";
import { PlatformPanel } from "./PlatformPanel";
import { PricingPanel } from "./PricingPanel";
import { ScoutPanel } from "./ScoutPanel";
import { SiteHeader } from "./SiteHeader";
import { BetaBanner } from "./BetaBanner";
import { SaveSetupBanner } from "./SaveSetupBanner";
import { SolutionsPanel } from "./SolutionsPanel";
import { UpgradeModal } from "./UpgradeModal";
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
  
  const [upgradeModal, setUpgradeModal] = useState<"save" | "ask-ai" | null>(null);
  const [pendingSaveId, setPendingSaveId] = useState<string | null>(null);
  const [shownUpgradeFor, setShownUpgradeFor] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem("trueideas_upgrade_shown");
    if (stored) {
      setShownUpgradeFor(new Set(JSON.parse(stored)));
    }
  }, []);

  function goToProblems(mode: ProblemsMode = "search") {
    setSection("problems");
    setProblemsMode(mode);
  }

  const markUpgradeShown = useCallback((feature: string) => {
    setShownUpgradeFor((current) => {
      const updated = new Set(current);
      updated.add(feature);
      localStorage.setItem("trueideas_upgrade_shown", JSON.stringify([...updated]));
      return updated;
    });
  }, []);

  const performSave = useCallback(async (postId: string) => {
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

  const toggleSave = useCallback((postId: string) => {
    const isUnsaving = savedIds.has(postId);
    
    if (isUnsaving) {
      performSave(postId);
      return;
    }

    if (!shownUpgradeFor.has("save")) {
      setPendingSaveId(postId);
      setUpgradeModal("save");
      return;
    }

    performSave(postId);
  }, [savedIds, shownUpgradeFor, performSave]);

  const handleUpgradeClose = useCallback(() => {
    setUpgradeModal(null);
    setPendingSaveId(null);
  }, []);

  const handleContinueFree = useCallback(() => {
    if (upgradeModal) {
      markUpgradeShown(upgradeModal);
    }
    if (pendingSaveId) {
      performSave(pendingSaveId);
    }
    setUpgradeModal(null);
    setPendingSaveId(null);
  }, [upgradeModal, pendingSaveId, markUpgradeShown, performSave]);

  const handleAskAiContinue = useCallback(() => {
    markUpgradeShown("ask-ai");
    setUpgradeModal(null);
    setProblemsMode("ask-ai");
  }, [markUpgradeShown]);

  const handleProblemsModeChange = useCallback((mode: ProblemsMode) => {
    if (mode === "ask-ai" && !shownUpgradeFor.has("ask-ai")) {
      setUpgradeModal("ask-ai");
      return;
    }
    setProblemsMode(mode);
  }, [shownUpgradeFor]);

  return (
    <>
      <BetaBanner />
      <SiteHeader active={section} onNavigate={setSection} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
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
            <ProblemsToggle mode={problemsMode} onChange={handleProblemsModeChange} />
            {problemsMode === "search" ? (
              <FeedList posts={posts} savedIds={savedIds} onToggleSave={toggleSave} />
            ) : null}
            {problemsMode === "ask-ai" ? (
              <ScoutPanel savedIds={savedIds} onToggleSave={toggleSave} />
            ) : null}
            {problemsMode === "platform" ? (
              <PlatformPanel posts={posts} savedIds={savedIds} onToggleSave={toggleSave} />
            ) : null}
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

        {section === "pricing" ? <PricingPanel /> : null}
      </div>

      {upgradeModal ? (
        <UpgradeModal
          feature={upgradeModal}
          onClose={handleUpgradeClose}
          onContinueFree={upgradeModal === "ask-ai" ? handleAskAiContinue : handleContinueFree}
        />
      ) : null}
    </>
  );
}

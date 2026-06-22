"use client";

import { useEffect } from "react";

const STORAGE_KEY = "trueideas_utm";

type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  ref?: string;
};

function readUtmFromUrl(): UtmParams | null {
  const params = new URLSearchParams(window.location.search);
  const utm: UtmParams = {
    utm_source: params.get("utm_source") ?? undefined,
    utm_medium: params.get("utm_medium") ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? undefined,
    ref: params.get("ref") ?? undefined,
  };

  if (utm.utm_source || utm.utm_medium || utm.utm_campaign || utm.ref) {
    return utm;
  }

  return null;
}

export function UtmCapture() {
  useEffect(() => {
    const fromUrl = readUtmFromUrl();
    if (fromUrl) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
    }

    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const payload = JSON.parse(stored) as UtmParams;
    void fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, path: window.location.pathname }),
    }).catch(() => {});
  }, []);

  return null;
}

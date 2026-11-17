"use client";

import { useSyncExternalStore } from "react";
import { getCurrentWeek } from "@/lib/programWeek";

/*
  Which program week is it, on THIS phone, right now?

  The pages are built ahead of time, before anyone opens them, so the
  server can't know the real week. This hook returns null while the
  page is being built or loading, then the real week on the device.
  It also refreshes when you come back to the app, so the week rolls
  over without a reload.
*/

function subscribe(onChange: () => void) {
  window.addEventListener("focus", onChange);
  document.addEventListener("visibilitychange", onChange);

  return () => {
    window.removeEventListener("focus", onChange);
    document.removeEventListener("visibilitychange", onChange);
  };
}

export function useCurrentWeek(): number | null {
  return useSyncExternalStore(
    subscribe,
    () => getCurrentWeek(),
    () => null
  );
}

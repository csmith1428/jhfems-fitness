"use client";

import { useStoredString, writeStoredString } from "@/lib/useStoredString";

/*
  The level a person picked on the setup screen. It is saved in this
  browser only, and it is the starting choice on every workout. They
  can still switch level on any workout.
*/

export type Level = "beginner" | "standard" | "advanced";

export const LEVELS: Level[] = ["beginner", "standard", "advanced"];

export const LEVEL_KEY = "jhfems-level";

export const levelInfo: Record<
  Level,
  { label: string; guide: string; effort: string }
> = {
  beginner: {
    label: "Beginner",
    guide:
      "New to lifting, or coming back after time off. Simpler moves, effort 5–6 of 10.",
    effort: "effort 5–6 of 10",
  },
  standard: {
    label: "Standard",
    guide:
      "You lift regularly and know the basic moves. Effort about 7 of 10.",
    effort: "effort about 7 of 10",
  },
  advanced: {
    label: "Advanced",
    guide:
      "You train often and want more load. Effort about 8, never all-out.",
    effort: "effort about 8 of 10",
  },
};

export function isLevel(value: string | null): value is Level {
  return value !== null && (LEVELS as string[]).includes(value);
}

export function useSavedLevel():
  | { status: "loading" }
  | { status: "ready"; level: Level | null } {
  const stored = useStoredString(LEVEL_KEY);

  if (stored.status === "loading") return { status: "loading" };
  if (stored.status === "unavailable") {
    return { status: "ready", level: null };
  }

  return {
    status: "ready",
    level: isLevel(stored.value) ? stored.value : null,
  };
}

// Returns false if the browser refused to save.
export function saveLevel(level: Level) {
  try {
    writeStoredString(LEVEL_KEY, level);
    return true;
  } catch {
    return false;
  }
}

"use client";

import { useState } from "react";
import { workoutLibrary } from "@/data/workouts";
import {
  useStoredString,
  writeStoredString,
} from "@/lib/useStoredString";

/*
  Saves finished workouts in this browser (localStorage).
  Everything stays private on the device for now.
*/

export type Feel = "easy" | "just-right" | "tough";

export type WorkoutSession = {
  id: string;
  workoutId: string;
  completedAt: string;
  notes: string;
  feel?: Feel;
};

export const HISTORY_KEY = "jhfems-workout-history";

export function isWorkoutSession(
  value: unknown
): value is WorkoutSession {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<WorkoutSession>;

  return (
    typeof item.id === "string" &&
    typeof item.workoutId === "string" &&
    typeof item.completedAt === "string" &&
    typeof item.notes === "string"
  );
}

// Returns null when the saved value looks wrong, so we never
// overwrite records we couldn't understand.
export function parseHistory(
  saved: string | null
): WorkoutSession[] | null {
  try {
    const parsed: unknown = saved ? JSON.parse(saved) : [];

    return Array.isArray(parsed) && parsed.every(isWorkoutSession)
      ? parsed
      : null;
  } catch {
    return null;
  }
}

export function useWorkoutLog(workoutId: string) {
  const stored = useStoredString(HISTORY_KEY);
  const [lastSessionId, setLastSessionId] = useState<string | null>(
    null
  );
  const [saveError, setSaveError] = useState("");

  const loaded = stored.status !== "loading";
  const history =
    stored.status === "ready" ? parseHistory(stored.value) : null;
  const canWrite = history !== null;
  const sessions = history ?? [];

  const error =
    saveError ||
    (loaded && !canWrite
      ? "Workout history couldn't be loaded. No records were changed."
      : "");

  function save(updated: WorkoutSession[]) {
    if (!canWrite) return false;

    try {
      writeStoredString(HISTORY_KEY, JSON.stringify(updated));
      setSaveError("");
      return true;
    } catch (err) {
      console.error("Unable to save history:", err);
      setSaveError(
        "Unable to save your workout. Please check browser storage."
      );
      return false;
    }
  }

  function complete(notes: string) {
    if (lastSessionId || !canWrite) return false;

    const session: WorkoutSession = {
      id: crypto.randomUUID(),
      workoutId,
      completedAt: new Date().toISOString(),
      notes: notes.trim(),
    };

    if (save([...sessions, session])) {
      setLastSessionId(session.id);
      return true;
    }

    return false;
  }

  function updateLast(changes: Partial<WorkoutSession>) {
    if (!lastSessionId) return false;

    return save(
      sessions.map((session) =>
        session.id === lastSessionId
          ? { ...session, ...changes }
          : session
      )
    );
  }

  function undo() {
    if (!lastSessionId) return false;

    if (save(sessions.filter((s) => s.id !== lastSessionId))) {
      setLastSessionId(null);
      return true;
    }

    return false;
  }

  const lastSession =
    sessions.find((session) => session.id === lastSessionId) ?? null;

  // How many of this week's workouts are done (for "1 / 4").
  const week = workoutLibrary.find((w) => w.id === workoutId)?.week;
  const weekIds = workoutLibrary
    .filter((w) => w.week === week)
    .map((w) => w.id);
  const weekDone = weekIds.filter((id) =>
    sessions.some((session) => session.workoutId === id)
  ).length;

  return {
    loaded,
    canWrite,
    error,
    sessions,
    lastSession,
    lastSessionId,
    weekDone,
    weekTotal: weekIds.length,
    complete,
    updateLast,
    undo,
  };
}


"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type WorkoutSession = {
  id: string;
  workoutId: string;
  completedAt: string;
  notes: string;
};

const STORAGE_KEY = "jhfems-workout-history";

function isWorkoutSession(value: unknown): value is WorkoutSession {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<WorkoutSession>;

  return (
    typeof item.id === "string" &&
    typeof item.workoutId === "string" &&
    typeof item.completedAt === "string" &&
    typeof item.notes === "string"
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function WorkoutCompletion({
  workoutId,
}: {
  workoutId: string;
}) {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [canWrite, setCanWrite] = useState(false);
  const [notes, setNotes] = useState("");
  const [lastSessionId, setLastSessionId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setLoaded(false);
    setCanWrite(false);
    setError("");

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = saved ? JSON.parse(saved) : [];

      if (
        !Array.isArray(parsed) ||
        !parsed.every(isWorkoutSession)
      ) {
        throw new Error("Invalid workout history");
      }

      setSessions(parsed);
      setCanWrite(true);
    } catch (err) {
      console.error("Unable to load history:", err);
      setError(
        "Workout history couldn't be loaded. No records were changed."
      );
    }

    setNotes("");
    setLastSessionId(null);
    setNotice("");
    setLoaded(true);
  }, [workoutId]);

  function saveHistory(history: WorkoutSession[]) {
    if (!canWrite) return false;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(history)
      );

      setSessions(history);
      setError("");
      return true;
    } catch (err) {
      console.error("Unable to save history:", err);
      setError(
        "Unable to save your workout. Please check browser storage."
      );
      return false;
    }
  }

  function completeWorkout() {
    if (lastSessionId || !canWrite) return;

    const session: WorkoutSession = {
      id: crypto.randomUUID(),
      workoutId,
      completedAt: new Date().toISOString(),
      notes: notes.trim(),
    };

    if (saveHistory([...sessions, session])) {
      setLastSessionId(session.id);
      setNotice("Your workout has been saved.");
    }
  }

  function saveNotes() {
    if (!lastSessionId) return;

    const updated = sessions.map((session) =>
      session.id === lastSessionId
        ? { ...session, notes: notes.trim() }
        : session
    );

    if (saveHistory(updated)) {
      setNotice("Note changes saved.");
    }
  }

  function undoCompletion() {
    if (!lastSessionId) return;

    const updated = sessions.filter(
      (session) => session.id !== lastSessionId
    );

    if (saveHistory(updated)) {
      setLastSessionId(null);
      setNotes("");
      setNotice("Completion removed.");
    }
  }

  const workoutSessions = sessions
    .filter((session) => session.workoutId === workoutId)
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() -
        new Date(a.completedAt).getTime()
    );

  const recentSessions = workoutSessions.slice(0, 3);

  if (!loaded) {
    return (
      <section className="rounded-2xl bg-[var(--brand-panel)] p-6 text-white">
        Loading workout history...
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[#536066] bg-[var(--brand-panel)] p-6 text-[var(--brand-ivory)] sm:p-8">
      {/* TITLE */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Log this workout
        </h2>

        <span className="shrink-0 rounded-lg bg-[#46545C] px-3 py-2 text-xs font-semibold">
          {workoutSessions.length} logged
        </span>
      </div>

      {error && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-[var(--brand-red)] bg-[#502D2D] p-4 text-sm"
        >
          {error}
        </p>
      )}

      {/* SUCCESS */}
      {lastSessionId && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#6C858F] bg-[#39474D] p-4">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand-red)] text-lg text-white"
          >
            ✓
          </span>

          <div>
            <p className="font-bold">Workout recorded</p>
            <p className="mt-1 text-sm text-[#CBD5D9]">
              Your session has been added to your history.
            </p>
          </div>
        </div>
      )}

      {/* NOTES FIRST */}
      <div className="mb-5">
        <label
          htmlFor="workout-notes"
          className="mb-2 flex items-center gap-2 text-sm font-semibold"
        >
          Workout notes
          <span className="text-xs font-normal text-[#AFC0C7]">
            Optional
          </span>
        </label>

        <textarea
          id="workout-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Weights, reps, rounds, times, or observations..."
          rows={3}
          className="w-full resize-y rounded-xl border border-[#60717A] bg-[#252B2E] p-4 text-sm leading-relaxed text-white placeholder:text-[#AFC0C7] focus:border-[var(--brand-red)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-red)]"
        />
      </div>

      {/* ACTION */}
      {lastSessionId ? (
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={saveNotes}
            className="min-h-11 rounded-lg border border-[#728791] px-5 py-3 text-sm font-semibold transition-colors hover:bg-[#46545C]"
          >
            Save note changes
          </button>

          <button
            type="button"
            onClick={undoCompletion}
            className="min-h-11 text-sm text-[#CBD5D9] underline underline-offset-4 hover:text-white"
          >
            Undo completion
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={completeWorkout}
          disabled={!canWrite}
          className="flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-[var(--brand-red)] px-5 py-4 text-base font-bold text-white transition-colors hover:bg-[var(--brand-red-hover)] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span aria-hidden="true" className="text-xl">
            ✓
          </span>
          Mark workout complete
        </button>
      )}

      {!lastSessionId && (
        <p className="mt-3 text-center text-xs text-[#AFC0C7]">
          Saves your workout and any notes entered above.
        </p>
      )}

      {notice && (
        <p
          role="status"
          className="mt-3 text-xs text-[#CBD5D9]"
        >
          {notice}
        </p>
      )}

      {/* RECENT HISTORY */}
      <div className="mt-6 border-t border-white/15 pt-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold">
            Recent sessions
          </h3>

          <Link
            href="/progress"
            className="text-sm font-semibold text-white underline decoration-[var(--brand-red)] decoration-2 underline-offset-4 hover:text-[#FFE6E7]"
          >
            View all history →
          </Link>
        </div>

        {recentSessions.length === 0 ? (
          <p className="text-sm text-[#CBD5D9]">
            No sessions recorded for this workout yet.
          </p>
        ) : (
          <div className="divide-y divide-white/10">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {formatDate(session.completedAt)}
                  </p>

                  {session.notes && (
                    <p className="mt-1 text-xs leading-relaxed text-[#CBD5D9]">
                      {session.notes.length > 120
                        ? session.notes.slice(0, 117) + "..."
                        : session.notes}
                    </p>
                  )}
                </div>

                <span
                  aria-label="Completed"
                  className="shrink-0 text-[#B9CBD3]"
                >
                  ✓
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LOCAL STORAGE NOTICE */}
      <p className="mt-6 border-t border-white/10 pt-4 text-xs leading-relaxed text-[#A8C0CD]">
        Records are stored in this browser only.
        Clearing browser data may remove them.
      </p>
    </section>
  );
}

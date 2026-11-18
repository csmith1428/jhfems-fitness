"use client";

import Link from "next/link";
import { useState } from "react";
import DoneCard from "@/components/DoneCard";
import { workoutLibrary } from "@/data/workouts";
import { useWorkoutLog } from "@/lib/workoutHistory";

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

const feelLabel = {
  easy: "Easy",
  "just-right": "Just right",
  tough: "Tough",
} as const;

// Per-workout UI state (notes, undo) resets because the parent
// renders this component with key={workoutId}.
export default function WorkoutCompletion({
  workoutId,
}: {
  workoutId: string;
}) {
  const log = useWorkoutLog(workoutId);
  const [notes, setNotes] = useState("");
  const [notice, setNotice] = useState("");

  const workout = workoutLibrary.find((w) => w.id === workoutId);

  function completeWorkout() {
    if (log.complete(notes)) {
      setNotice("Your workout has been saved.");
    }
  }

  function saveNotes() {
    if (log.updateLast({ notes: notes.trim() })) {
      setNotice("Note changes saved.");
    }
  }

  function undoCompletion() {
    if (log.undo()) {
      setNotes("");
      setNotice("Completion removed.");
    }
  }

  const workoutSessions = log.sessions
    .filter((session) => session.workoutId === workoutId)
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() -
        new Date(a.completedAt).getTime()
    );

  const recentSessions = workoutSessions.slice(0, 3);

  if (!log.loaded) {
    return (
      <section className="rounded-3xl bg-[var(--brand-night)] p-6 text-white">
        Loading workout history...
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {log.error && (
        <p
          role="alert"
          className="rounded-xl border border-[var(--brand-red)] bg-[#FFF1F1] p-4 text-sm text-[#8F1D22]"
        >
          {log.error}
        </p>
      )}

      {log.lastSessionId ? (
        /* AFTER: big "Workout done." card */
        <div className="rounded-3xl bg-[var(--brand-night)] p-6 sm:p-8">
          <DoneCard
            title={workout?.title ?? "Workout"}
            week={workout?.week ?? 1}
            weekDone={log.weekDone}
            weekTotal={log.weekTotal}
            feel={log.lastSession?.feel}
            onFeel={(feel) => {
              if (log.updateLast({ feel })) {
                setNotice("Saved.");
              }
            }}
          />

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={saveNotes}
              className="min-h-11 rounded-xl border border-[#3A4248] px-5 text-sm font-semibold text-white hover:bg-[#1D2226]"
            >
              Save note changes
            </button>

            <button
              type="button"
              onClick={undoCompletion}
              className="min-h-11 text-sm text-[#C9CFD3] underline underline-offset-4 hover:text-white"
            >
              Undo completion
            </button>
          </div>

          {notice && (
            <p role="status" className="mt-3 text-xs text-[#C9CFD3]">
              {notice}
            </p>
          )}
        </div>
      ) : null}

      {/* NOTES + COMPLETE */}
      <div className="rounded-3xl bg-white p-6 shadow-[0_2px_10px_rgba(20,24,27,0.07)] sm:p-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-display text-3xl font-extrabold uppercase">
            Log this workout
          </h2>

          <span className="shrink-0 font-label text-[11px] uppercase tracking-widest text-[var(--brand-muted)]">
            {workoutSessions.length} logged
          </span>
        </div>

        <label
          htmlFor="workout-notes"
          className="mb-2 flex items-center gap-2 text-sm font-semibold"
        >
          Workout notes
          <span className="text-xs font-normal text-[var(--brand-muted)]">
            Optional
          </span>
        </label>

        <textarea
          id="workout-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Weights, reps, rounds, times, or observations..."
          rows={3}
          className="w-full resize-y rounded-xl border border-[#D5DAD6] bg-[#F8F9F7] p-4 text-sm leading-relaxed placeholder:text-[#6B7680] focus:border-[var(--brand-red)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-red)]"
        />

        {!log.lastSessionId && (
          <>
            <button
              type="button"
              onClick={completeWorkout}
              disabled={!log.canWrite}
              className="mt-5 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[var(--brand-night)] px-5 py-4 text-base font-bold text-white shadow-[0_8px_18px_rgba(20,24,27,0.25)] transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-red)]"
            >
              <span aria-hidden="true" className="text-xl">
                ✓
              </span>
              Mark workout complete
            </button>

            <p className="mt-3 text-center text-xs text-[var(--brand-muted)]">
              Saves your workout and any notes entered above.
            </p>
          </>
        )}

        {/* RECENT HISTORY */}
        <div className="mt-7 border-t border-[#E3E6E2] pt-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-xl font-extrabold uppercase">
              Recent sessions
            </h3>

            <Link
              href="/progress"
              className="text-sm font-semibold text-[var(--brand-red)] hover:underline"
            >
              View all history →
            </Link>
          </div>

          {recentSessions.length === 0 ? (
            <p className="text-sm text-[var(--brand-muted)]">
              No sessions recorded for this workout yet.
            </p>
          ) : (
            <div className="divide-y divide-[#E3E6E2]">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {formatDate(session.completedAt)}
                      {session.feel
                        ? ` · ${feelLabel[session.feel]}`
                        : ""}
                    </p>

                    {session.notes && (
                      <p className="mt-1 text-xs leading-relaxed text-[var(--brand-muted)]">
                        {session.notes.length > 120
                          ? session.notes.slice(0, 117) + "..."
                          : session.notes}
                      </p>
                    )}
                  </div>

                  <span
                    aria-label="Completed"
                    className="shrink-0 text-[var(--brand-red)]"
                  >
                    ✓
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="mt-6 border-t border-[#E3E6E2] pt-4 text-xs leading-relaxed text-[var(--brand-muted)]">
          Records are stored in this browser only. Clearing browser data
          may remove them.
        </p>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { workoutLibrary } from "@/data/workouts";
import { useStoredString } from "@/lib/useStoredString";
import { HISTORY_KEY, parseHistory } from "@/lib/workoutHistory";

const workoutNames: Record<string, string> = {
  "strength-a": "Strength A",
  "strength-b": "Strength B",
  conditioning: "Conditioning",
  functional: "Functional Fitness",
};

const feelLabel = {
  easy: "Too easy",
  "just-right": "Just right",
  tough: "Too hard",
} as const;

function getWorkoutName(workoutId: string) {
  const workout = workoutLibrary.find(
    (item) => item.id === workoutId
  );

  return workout?.title ?? workoutNames[workoutId] ?? workoutId;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProgressPage() {
  const stored = useStoredString(HISTORY_KEY);
  const loaded = stored.status !== "loading";
  const history =
    stored.status === "ready" ? parseHistory(stored.value) : null;
  const loadError = loaded && history === null;
  const sessions = history ?? [];

  const sortedSessions = [...sessions].sort(
    (a, b) =>
      new Date(b.completedAt).getTime() -
      new Date(a.completedAt).getTime()
  );

  // Count distinct local calendar days.
  const trainingDays = new Set(
    sessions.flatMap((session) => {
      const date = new Date(session.completedAt);

      if (Number.isNaN(date.getTime())) {
        return [];
      }

      return [
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      ];
    })
  ).size;

  return (
    <main className="min-h-screen bg-[var(--brand-canvas)] pb-28 text-[var(--brand-ink)] md:pb-10">
      <div className="mx-auto max-w-2xl px-5 pt-6 sm:px-8 sm:pt-9">
        <AppHeader active="progress" />

        {/* PAGE HEADING */}
        <section>
          <p className="font-label text-[11px] uppercase tracking-widest text-[var(--brand-muted)]">
            Only you can see this
          </p>

          <h1 className="mt-1 font-display text-5xl font-extrabold uppercase leading-none">
            My progress
          </h1>
        </section>

        {!loaded ? (
          <section
            role="status"
            className="mt-6 rounded-2xl bg-white p-8 text-sm text-[var(--brand-muted)]"
          >
            Loading your training history...
          </section>
        ) : loadError ? (
          <section
            role="alert"
            className="mt-6 rounded-2xl border border-[var(--brand-red)] bg-white p-8"
          >
            <h2 className="font-display text-2xl font-extrabold uppercase">
              Unable to load workout history
            </h2>

            <p className="mt-2 text-sm text-[var(--brand-muted)]">
              Your stored records have not been changed.
              Please check your browser storage before
              recording another workout.
            </p>
          </section>
        ) : (
          <>
            {/* BIG NUMBERS */}
            <section className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-3xl bg-[var(--brand-night)] p-5 text-white">
                <p className="font-label text-[11px] uppercase tracking-widest text-[#AEB6BC]">
                  Workouts
                </p>

                <p className="mt-3 font-display text-6xl font-extrabold leading-none tabular-nums">
                  {sessions.length}
                </p>

                <p className="mt-2 text-xs text-[#C9CFD3]">
                  Completed sessions
                </p>
              </div>

              <div className="rounded-3xl bg-[var(--brand-night)] p-5 text-white">
                <p className="font-label text-[11px] uppercase tracking-widest text-[#AEB6BC]">
                  Training days
                </p>

                <p className="mt-3 font-display text-6xl font-extrabold leading-none tabular-nums">
                  {trainingDays}
                </p>

                <p className="mt-2 text-xs text-[#C9CFD3]">
                  Days with activity
                </p>
              </div>
            </section>

            {/* WORKOUT HISTORY */}
            <section className="mt-8">
              <div className="flex items-end justify-between gap-4 border-b-2 border-[var(--brand-ink)] pb-1.5">
                <h2 className="font-display text-2xl font-extrabold uppercase">
                  Workout history
                </h2>

                <span className="pb-0.5 font-label text-[11px] uppercase tracking-widest text-[var(--brand-muted)]">
                  {sessions.length} recorded
                </span>
              </div>

              {sortedSessions.length === 0 ? (
                <div className="py-10 text-center">
                  <h3 className="font-display text-2xl font-extrabold uppercase">
                    No workouts recorded yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[var(--brand-muted)]">
                    Finish a workout to start building your
                    history.
                  </p>

                  <Link
                    href="/workouts"
                    className="mt-5 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[var(--brand-red)] px-6 text-sm font-bold text-white transition-colors hover:bg-[var(--brand-red-hover)]"
                  >
                    View workouts →
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[#E3E6E2]">
                  {sortedSessions.map((session) => (
                    <article key={session.id} className="py-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-red)] text-sm font-bold text-white"
                          >
                            ✓
                          </span>

                          <div>
                            <h3 className="text-base font-semibold">
                              {getWorkoutName(session.workoutId)}
                            </h3>

                            {session.feel && (
                              <p className="font-label text-[11px] uppercase tracking-wide text-[var(--brand-muted)]">
                                Felt: {feelLabel[session.feel]}
                              </p>
                            )}
                          </div>
                        </div>

                        <time
                          dateTime={session.completedAt}
                          className="text-sm text-[var(--brand-muted)]"
                        >
                          {formatDate(session.completedAt)}
                        </time>
                      </div>

                      {session.notes && (
                        <div className="mt-3 rounded-xl bg-white p-4 sm:ml-10">
                          <p className="mb-1 font-label text-[11px] uppercase tracking-widest text-[var(--brand-muted)]">
                            Session notes
                          </p>

                          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                            {session.notes}
                          </p>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        <footer className="mt-12 border-t border-[#E3E6E2] pt-5">
          <p className="max-w-xl text-xs leading-relaxed text-[var(--brand-muted)]">
            Development preview: workout history is stored in this
            browser only. It does not sync between devices, and
            clearing browser data may remove it. Avoid entering
            sensitive personal information.
          </p>
        </footer>
      </div>
    </main>
  );
}

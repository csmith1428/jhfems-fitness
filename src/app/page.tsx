
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import { workoutLibrary } from "@/data/workouts";
import { TOTAL_WEEKS, weekPhase } from "@/lib/programWeek";
import { useCurrentWeek } from "@/lib/useCurrentWeek";

const workoutOrder: Record<string, number> = {
  "Strength A": 0,
  "Strength B": 1,
  Conditioning: 2,
  "Functional Fitness": 3,
};

function hasWorkoutId(value: unknown): value is {
  workoutId: string;
} {
  return (
    typeof value === "object" &&
    value !== null &&
    "workoutId" in value &&
    typeof value.workoutId === "string"
  );
}

function focusLabel(category: string) {
  return category.toUpperCase() === "ENGINE"
    ? "CARDIO + ENDURANCE"
    : category.toUpperCase();
}

export default function HomePage() {
  const currentWeek = useCurrentWeek();
  const ready = currentWeek !== null;
  const CURRENT_WEEK = currentWeek ?? 1;

  const weeklyWorkouts = workoutLibrary
    .filter((workout) => workout.week === CURRENT_WEEK)
    .sort(
      (a, b) =>
        (workoutOrder[a.title] ?? 99) -
        (workoutOrder[b.title] ?? 99)
    );

  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [historyStatus, setHistoryStatus] = useState<
    "loading" | "ready" | "error"
  >("loading");

  useEffect(() => {
    function refreshHistory() {
      try {
        const saved = localStorage.getItem(
          "jhfems-workout-history"
        );

        const parsed: unknown = saved
          ? JSON.parse(saved)
          : [];

        if (!Array.isArray(parsed)) {
          throw new Error("Invalid workout history");
        }

        const ids = parsed
          .filter(hasWorkoutId)
          .map((session) => session.workoutId);

        setCompletedIds([...new Set(ids)]);
        setHistoryStatus("ready");
      } catch {
        setHistoryStatus("error");
      }
    }

    refreshHistory();

    window.addEventListener("focus", refreshHistory);
    window.addEventListener("storage", refreshHistory);

    return () => {
      window.removeEventListener("focus", refreshHistory);
      window.removeEventListener("storage", refreshHistory);
    };
  }, []);

  const completed = new Set(completedIds);

  const completedCount = weeklyWorkouts.filter((workout) =>
    completed.has(workout.id)
  ).length;

  const total = weeklyWorkouts.length;

  const nextWorkout = weeklyWorkouts.find(
    (workout) => !completed.has(workout.id)
  );

  const isLoading = historyStatus === "loading";

  const phase = weekPhase(CURRENT_WEEK);

  return (
    <main className="min-h-screen bg-[var(--brand-canvas)] pb-28 text-[var(--brand-ink)] md:pb-10">
      <div
        className={`mx-auto max-w-2xl px-5 pt-6 sm:px-8 sm:pt-9 ${
          ready ? "" : "invisible"
        }`}
      >
        <AppHeader active="home" />

        {/* WEEK HERO */}
        <section>
          <p
            className={`font-label text-[11px] uppercase tracking-widest ${
              phase.recovery
                ? "text-[var(--brand-slate)]"
                : "text-[var(--brand-red)]"
            }`}
          >
            {phase.label}
          </p>

          <h1 className="mt-1 flex items-baseline gap-2 font-display font-extrabold uppercase leading-[0.9]">
            <span className="text-7xl">Week {CURRENT_WEEK}</span>
            <span className="text-4xl font-bold text-[var(--brand-muted)]">
              /{TOTAL_WEEKS}
            </span>
          </h1>

          <div
            className="mt-4 flex gap-1"
            role="img"
            aria-label={`Week ${CURRENT_WEEK} of ${TOTAL_WEEKS}`}
          >
            {Array.from({ length: TOTAL_WEEKS }, (_, i) => {
              const week = i + 1;
              const recovery = week === 4 || week === 8;

              return (
                <div
                  key={week}
                  className={`h-2.5 flex-1 rounded ${
                    week === CURRENT_WEEK
                      ? "bg-[var(--brand-red)]"
                      : week < CURRENT_WEEK
                        ? "bg-[var(--brand-night)]"
                        : recovery
                          ? "bg-[var(--brand-slate)] opacity-55"
                          : "bg-[#D5DAD6]"
                  }`}
                />
              );
            })}
          </div>

          <p className="mt-2 font-label text-[11px] text-[var(--brand-muted)]">
            Slate bars are easy recovery weeks (4 and 8)
          </p>
        </section>

        {historyStatus === "error" && (
          <p
            role="alert"
            className="mt-4 text-sm text-[#B83F2E]"
          >
            Your saved workout history couldn&apos;t be loaded.
            No records have been changed.
          </p>
        )}

        {/* UP NEXT */}
        <section className="mt-6 rounded-3xl bg-[var(--brand-night)] p-6 text-white shadow-[0_10px_24px_rgba(20,24,27,0.22)]">
          <div className="flex items-center justify-between gap-4">
            <span className="font-label text-[11px] uppercase tracking-widest text-[#C9CFD3]">
              {nextWorkout ? "Up next" : "This week"}
            </span>

            <span className="font-label text-[11px] uppercase tracking-widest text-[#C9CFD3]">
              {isLoading
                ? "Loading..."
                : `${completedCount} of ${total} done`}
            </span>
          </div>

          <h2 className="mt-2 font-display text-4xl font-extrabold uppercase leading-none">
            {nextWorkout
              ? nextWorkout.title
              : total > 0
                ? "Week complete."
                : "No workouts yet"}
          </h2>

          <p className="mt-2 text-sm text-[#C9CFD3]">
            {nextWorkout
              ? `${nextWorkout.duration.toLowerCase()} · Beginner, Standard, Advanced`
              : total > 0
                ? "Nice work. Rest up and check your progress."
                : "Workouts for this week haven't been added."}
          </p>

          {nextWorkout ? (
            <Link
              href={`/workouts/${nextWorkout.id}`}
              className="mt-5 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[var(--brand-red)] px-5 text-base font-bold text-white transition-colors hover:bg-[var(--brand-red-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Start workout
              <span aria-hidden="true">→</span>
            </Link>
          ) : total > 0 ? (
            <Link
              href="/progress"
              className="mt-5 flex min-h-14 items-center justify-center rounded-2xl border border-[#3A4248] px-5 text-base font-bold hover:bg-[#1D2226]"
            >
              View your progress
            </Link>
          ) : null}
        </section>

        {/* THIS WEEK */}
        <section className="mt-8">
          <div className="flex items-end justify-between gap-4 border-b-2 border-[var(--brand-ink)] pb-1.5">
            <h2 className="font-display text-2xl font-extrabold uppercase">
              This week
            </h2>

            <Link
              href="/workouts"
              className="pb-0.5 text-sm font-semibold text-[var(--brand-red)] hover:underline"
            >
              All workouts
            </Link>
          </div>

          <div>
            {weeklyWorkouts.map((workout) => {
              const isDone = completed.has(workout.id);

              return (
                <Link
                  key={workout.id}
                  href={`/workouts/${workout.id}`}
                  className="flex min-h-16 items-center gap-3 border-b border-[#E3E6E2] py-2 transition-colors hover:bg-white/60"
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 text-sm font-bold ${
                      isDone
                        ? "border-[var(--brand-red)] bg-[var(--brand-red)] text-white"
                        : "border-[#B7BFC4] text-transparent"
                    }`}
                  >
                    ✓
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold">
                      {workout.title}
                    </h3>

                    <p className="font-label text-[11px] uppercase tracking-wide text-[var(--brand-muted)]">
                      {workout.duration} · {focusLabel(workout.category)}
                    </p>
                  </div>

                  <span className="text-xs font-medium text-[var(--brand-muted)]">
                    {isDone ? "Done" : "Not started"}
                  </span>
                </Link>
              );
            })}

            {weeklyWorkouts.length === 0 && (
              <p className="py-5 text-sm text-[var(--brand-muted)]">
                No workouts have been added for this week.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

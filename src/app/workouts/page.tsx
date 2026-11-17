
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import { workoutLibrary } from "@/data/workouts";
import { useCurrentWeek } from "@/lib/useCurrentWeek";

const STORAGE_KEY = "jhfems-workout-history";

const workoutOrder: Record<string, number> = {
  "Strength A": 0,
  "Strength B": 1,
  Conditioning: 2,
  "Functional Fitness": 3,
};

function focusLabel(category: string) {
  return category.toUpperCase() === "ENGINE"
    ? "CARDIO + ENDURANCE"
    : category.toUpperCase();
}

export default function WorkoutsPage() {
  const currentWeek = useCurrentWeek();
  const ready = currentWeek !== null;
  const CURRENT_WEEK = currentWeek ?? 1;

  const workouts = workoutLibrary
    .filter((workout) => workout.week === CURRENT_WEEK)
    .sort(
      (a, b) =>
        (workoutOrder[a.title] ?? 99) -
        (workoutOrder[b.title] ?? 99)
    );

  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [historyError, setHistoryError] = useState(false);

  useEffect(() => {
    function loadHistory() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const history: unknown = saved ? JSON.parse(saved) : [];

        if (!Array.isArray(history)) {
          throw new Error("Invalid workout history");
        }

        const ids = history
          .filter(
            (item): item is { workoutId: string } =>
              typeof item === "object" &&
              item !== null &&
              "workoutId" in item &&
              typeof item.workoutId === "string"
          )
          .map((item) => item.workoutId);

        setCompletedIds([...new Set(ids)]);
        setHistoryError(false);
      } catch {
        setCompletedIds([]);
        setHistoryError(true);
      }
    }

    loadHistory();

    window.addEventListener("focus", loadHistory);
    window.addEventListener("storage", loadHistory);

    return () => {
      window.removeEventListener("focus", loadHistory);
      window.removeEventListener("storage", loadHistory);
    };
  }, []);

  const completed = new Set(completedIds);

  return (
    <main className="min-h-screen bg-[var(--brand-canvas)] pb-28 text-[var(--brand-ink)] md:pb-10">
      <div
        className={`mx-auto max-w-6xl px-5 pt-6 sm:px-8 sm:pt-9 ${
          ready ? "" : "invisible"
        }`}
      >
        <AppHeader active="workouts" />

        <section className="mb-6">
          <p className="font-label text-[11px] uppercase tracking-widest text-[var(--brand-red)]">
            Week {String(CURRENT_WEEK).padStart(2, "0")} of 12
          </p>

          <h1 className="mt-1 font-display text-5xl font-extrabold uppercase leading-none">
            Your workouts
          </h1>

          <p className="mt-2 text-sm text-[var(--brand-muted)]">
            Pick a session and train at your level.
          </p>
        </section>

        {historyError && (
          <p role="alert" className="mb-5 text-sm text-[var(--brand-red)]">
            Saved progress could not be loaded.
            Your records have not been changed.
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {workouts.map((workout) => {
            const isDone = completed.has(workout.id);

            return (
              <Link
                key={workout.id}
                href={`/workouts/${workout.id}`}
                className="group flex min-h-44 flex-col justify-between rounded-3xl bg-white p-6 shadow-[0_2px_10px_rgba(20,24,27,0.07)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(20,24,27,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-red)]"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="font-label text-[11px] uppercase tracking-widest text-[var(--brand-red)]">
                      {focusLabel(workout.category)}
                    </span>

                    {isDone && (
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--brand-red)] text-sm font-bold text-white">
                        <span className="sr-only">Completed</span>
                        <span aria-hidden="true">✓</span>
                      </span>
                    )}
                  </div>

                  <h2 className="font-display text-4xl font-extrabold uppercase leading-none">
                    {workout.title}
                  </h2>
                </div>

                <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#E3E6E2] pt-4">
                  <span className="font-label text-[11px] uppercase tracking-widest text-[var(--brand-muted)]">
                    {workout.duration}
                  </span>

                  <span className="text-sm font-semibold">
                    View workout <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {workouts.length === 0 && (
          <p className="mt-6 text-sm text-[var(--brand-muted)]">
            No workouts are available for this week.
          </p>
        )}

        <Link
          href="/program"
          className="mt-8 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--brand-red)] hover:underline"
        >
          Explore the 12-week program →
        </Link>
      </div>
    </main>
  );
}

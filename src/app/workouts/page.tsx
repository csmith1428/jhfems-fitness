
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import { workoutLibrary } from "@/data/workouts";

const CURRENT_WEEK = 2;
const STORAGE_KEY = "jhfems-workout-history";

const workoutOrder: Record<string, number> = {
  "Strength A": 0,
  "Strength B": 1,
  Conditioning: 2,
  "Functional Fitness": 3,
};

const workouts = workoutLibrary
  .filter((workout) => workout.week === CURRENT_WEEK)
  .sort(
    (a, b) =>
      (workoutOrder[a.title] ?? 99) -
      (workoutOrder[b.title] ?? 99)
  );

function focusLabel(category: string) {
  return category.toUpperCase() === "ENGINE"
    ? "CARDIO + ENDURANCE"
    : category.toUpperCase();
}

export default function WorkoutsPage() {
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
      <div className="mx-auto max-w-6xl px-5 pt-6 sm:px-8 sm:pt-9">
        <AppHeader active="workouts" />

        <section className="mb-7">
          <p className="mb-2 text-xs font-semibold tracking-wider text-[var(--brand-muted)]">
            WEEK {String(CURRENT_WEEK).padStart(2, "0")} OF 12
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Your Workouts
          </h1>

          <p className="mt-2 text-sm text-[var(--brand-muted)]">
            Choose a session and train at your level.
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
                className="group flex min-h-48 flex-col justify-between rounded-2xl border border-white/10 bg-[var(--brand-slate)] p-6 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--brand-slate-hover)] hover:shadow-lg"
              >
                <div>
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold tracking-wider text-[#B7C8D0]">
                      TRAINING SESSION
                    </span>

                    {isDone && (
                      <span className="rounded-full bg-[#52616A] px-3 py-1.5 text-xs font-semibold">
                        ✓ Completed
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-extrabold tracking-tight">
                    {workout.title}
                  </h2>

                  <div className="mt-3">
                    <span className="inline-block rounded-md bg-[var(--brand-red)] px-3 py-1.5 text-[11px] font-bold tracking-wider text-white">
                      {focusLabel(workout.category)}
                    </span>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/15 pt-4">
                  <span className="text-sm text-[#CAD6DB]">
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

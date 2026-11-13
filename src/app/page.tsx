
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import { workoutLibrary } from "@/data/workouts";

const CURRENT_WEEK = 2;

const workoutOrder: Record<string, number> = {
  "Strength A": 0,
  "Strength B": 1,
  Conditioning: 2,
  "Functional Fitness": 3,
};

const weeklyWorkouts = workoutLibrary
  .filter((workout) => workout.week === CURRENT_WEEK)
  .sort(
    (a, b) =>
      (workoutOrder[a.title] ?? 99) -
      (workoutOrder[b.title] ?? 99)
  );

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

  const progress =
    total > 0
      ? Math.round((completedCount / total) * 100)
      : 0;

  const nextWorkout = weeklyWorkouts.find(
    (workout) => !completed.has(workout.id)
  );

  const isLoading = historyStatus === "loading";

  const headline =
    total > 0 && completedCount === total
      ? "Week complete."
      : completedCount === 0
        ? "Your week starts here."
        : "Keep the momentum going.";

  return (
    <main className="min-h-screen bg-[#F8F9F7] pb-28 text-[#293035] md:pb-10">
      <div className="mx-auto max-w-6xl px-5 pt-6 sm:px-8 sm:pt-9">
        <AppHeader active="home" />

        {/* PAGE HEADING */}
        <section className="mb-6">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#627885]">
            YOUR TRAINING
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Your Dashboard
          </h1>
        </section>

        {/* WEEKLY PROGRESS HERO */}
        <section className="overflow-hidden rounded-2xl border-l-4 border-[#D83036] bg-[#292E31] p-6 text-white shadow-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <span className="text-xs font-bold tracking-wider text-[#AFC4CF]">
              WEEK {String(CURRENT_WEEK).padStart(2, "0")} / 12
            </span>

            <span className="text-sm font-semibold">
              {isLoading
                ? "Loading..."
                : `${completedCount} of ${total} complete`}
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {isLoading ? "Your training week" : headline}
          </h2>

          <p className="mt-2 text-sm text-[#C8D4D9]">
            Your progress through this week's four sessions.
          </p>

          <div
            role="progressbar"
            aria-label="Weekly workout completion"
            aria-valuenow={isLoading ? 0 : completedCount}
            aria-valuemin={0}
            aria-valuemax={total || 4}
            className="mt-6 h-2.5 overflow-hidden rounded-full bg-[#536169]"
          >
            <div
              className="h-full rounded-full bg-[#D83036] transition-all duration-500"
              style={{
                width: isLoading ? "0%" : `${progress}%`,
              }}
            />
          </div>

          {/* FOUR WORKOUT CHECK-INS */}
          <div className="mt-5 grid grid-cols-4 gap-2">
            {weeklyWorkouts.map((workout, index) => {
              const isDone = completed.has(workout.id);

              return (
                <div
                  key={workout.id}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold ${
                      isDone
                        ? "border-[#D83036] bg-[#D83036] text-white"
                        : "border-[#6D7F88] bg-[#354147] text-[#B9C8D0]"
                    }`}
                    aria-label={`${workout.title}: ${
                      isDone ? "completed" : "not completed"
                    }`}
                  >
                    {isDone ? "✓" : index + 1}
                  </div>

                  <span className="text-center text-[10px] leading-tight text-[#C8D4D9]">
                    {workout.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* NEXT ACTION */}
          <div className="mt-7 border-t border-white/15 pt-6">
            {nextWorkout ? (
              <Link
                href={`/workouts/${nextWorkout.id}`}
                className="flex min-h-12 items-center justify-between gap-3 rounded-xl bg-[#D83036] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#B9252B]"
              >
                <span>Start {nextWorkout.title}</span>
                <span aria-hidden="true" className="text-xl">
                  →
                </span>
              </Link>
            ) : total > 0 ? (
              <Link
                href="/progress"
                className="flex min-h-12 items-center justify-center rounded-xl border border-white/30 px-5 py-3 font-semibold hover:bg-white/10"
              >
                View your progress
              </Link>
            ) : (
              <Link
                href="/workouts"
                className="flex min-h-12 items-center justify-center rounded-xl bg-[#D83036] px-5 py-3 font-semibold"
              >
                View workouts
              </Link>
            )}
          </div>
        </section>

        {historyStatus === "error" && (
          <p
            role="alert"
            className="mt-4 text-sm text-[#B83F2E]"
          >
            Your saved workout history couldn't be loaded.
            No records have been changed.
          </p>
        )}

        {/* WEEKLY WORKOUTS */}
        <section className="mt-9">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-semibold tracking-wider text-[#627885]">
                YOUR PROGRAM
              </p>

              <h2 className="text-2xl font-bold tracking-tight">
                This Week
              </h2>
            </div>

            <Link
              href="/workouts"
              className="text-sm font-semibold text-[#B83F2E] hover:underline"
            >
              All workouts
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#E0E4E5] bg-white">
            {weeklyWorkouts.map((workout, index) => {
              const isDone = completed.has(workout.id);

              return (
                <Link
                  key={workout.id}
                  href={`/workouts/${workout.id}`}
                  className={`flex items-center gap-4 p-4 transition-colors hover:bg-[#F1F4F5] sm:p-5 ${
                    index > 0 ? "border-t border-[#E5E8E9]" : ""
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                      isDone
                        ? "border-[#D83036] bg-[#D83036] text-white"
                        : "border-[#C9D0D3] bg-[#F8F9F7] text-[#7F8D94]"
                    }`}
                  >
                    {isDone ? "✓" : "○"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold">
                      {workout.title}
                    </h3>

                    <p className="mt-1 text-[11px] font-semibold tracking-wide text-[#C53D36]">
                      {focusLabel(workout.category)}
                    </p>

                    <p className="mt-1 text-xs text-[#667A85]">
                      {workout.duration}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="text-xl text-[#809098]"
                  >
                    ›
                  </span>
                </Link>
              );
            })}

            {weeklyWorkouts.length === 0 && (
              <p className="p-5 text-sm text-[#667A85]">
                No workouts have been added for this week.
              </p>
            )}
          </div>
        </section>

        {/* PROGRAM SHORTCUT */}
        <Link
          href="/program"
          className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-[#DDE3E5] bg-[#EDF1F2] p-5 transition-colors hover:bg-[#E2E9EB]"
        >
          <div>
            <p className="font-bold">12-Week Training Cycle</p>
            <p className="mt-1 text-sm text-[#667A85]">
              Review previous weeks and follow your program.
            </p>
          </div>

          <span aria-hidden="true" className="text-2xl">
            ›
          </span>
        </Link>

        <footer className="mt-10 border-t border-[#DDE2E4] pt-5 text-xs text-[#7B898F]">
          Jackson Hole Fire/EMS · Fitness & Wellness
        </footer>
      </div>
    </main>
  );
}

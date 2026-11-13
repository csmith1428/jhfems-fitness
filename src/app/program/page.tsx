
"use client";

import Link from "next/link";
import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import { workoutLibrary } from "@/data/workouts";

const CURRENT_WEEK = 2;
const TOTAL_WEEKS = 12;

const weeks = Array.from(
  { length: TOTAL_WEEKS },
  (_, index) => index + 1
);

const workoutOrder: Record<string, number> = {
  "Strength A": 0,
  "Strength B": 1,
  Conditioning: 2,
  "Functional Fitness": 3,
};

function weekLabel(week: number) {
  return String(week).padStart(2, "0");
}

function focusLabel(category: string) {
  return category.toUpperCase() === "ENGINE"
    ? "CARDIO + ENDURANCE"
    : category.toUpperCase();
}

export default function ProgramPage() {
  const [selectedWeek, setSelectedWeek] =
    useState(CURRENT_WEEK);

  const weeklyWorkouts = workoutLibrary
    .filter((workout) => workout.week === selectedWeek)
    .sort(
      (a, b) =>
        (workoutOrder[a.title] ?? 99) -
        (workoutOrder[b.title] ?? 99)
    );

  return (
    <main className="min-h-screen bg-[var(--brand-canvas)] pb-28 text-[var(--brand-ink)] md:pb-10">
      <div className="mx-auto max-w-6xl px-5 pt-6 sm:px-8 sm:pt-9">
        <AppHeader active="program" />

        {/* PROGRAM HERO */}
        <section className="rounded-2xl border-r-4 border-[var(--brand-red)] bg-[var(--brand-charcoal)] p-6 text-white sm:p-8">
          <p className="mb-3 text-xs font-bold tracking-wider text-[#B3C5CE]">
            YOUR TRAINING PLAN
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            12-Week Training Cycle
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#CBD5D9]">
            Four sessions per week. Build strength,
            conditioning, and work capacity with
            progressive training.
          </p>

          <div className="mt-6 inline-flex items-center gap-3 rounded-lg bg-white/10 px-4 py-3">
            <span className="text-xs text-[#CBD5D9]">
              CURRENT WEEK
            </span>

            <span className="text-lg font-bold">
              {weekLabel(CURRENT_WEEK)} / {TOTAL_WEEKS}
            </span>
          </div>
        </section>

        {/* CALENDAR */}
        <section className="mt-8 rounded-2xl border border-[var(--brand-border)] bg-white p-5 sm:p-7">
          <div className="mb-5">
            <h2 className="text-xl font-bold">
              Program Calendar
            </h2>

            <p className="mt-2 text-sm text-[var(--brand-muted)]">
              Select the current or a previous week
              to review its workouts.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {weeks.map((week) => {
              const isCurrent = week === CURRENT_WEEK;
              const isFuture = week > CURRENT_WEEK;
              const isSelected = week === selectedWeek;

              return (
                <button
                  key={week}
                  type="button"
                  disabled={isFuture}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedWeek(week)}
                  className={`flex min-h-28 flex-col items-center justify-center rounded-xl border p-3 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-red)] ${
                    isFuture
                      ? "cursor-not-allowed border-dashed border-[#D7DDDF] bg-[#F3F5F5] text-[#9BA7AC]"
                      : isSelected
                        ? "border-[var(--brand-red)] bg-[var(--brand-slate)] text-white"
                        : "border-[var(--brand-border)] bg-white text-[var(--brand-ink)] hover:border-[var(--brand-red)] hover:bg-[#F7F8F8]"
                  }`}
                >
                  <span className="text-xs font-semibold">
                    WEEK
                  </span>

                  <span className="mt-1 text-2xl font-extrabold">
                    {weekLabel(week)}
                  </span>

                  <span
                    className={`mt-2 text-[10px] font-semibold tracking-wide ${
                      isSelected
                        ? "text-white"
                        : isCurrent
                          ? "text-[var(--brand-red)]"
                          : "text-inherit"
                    }`}
                  >
                    {isCurrent
                      ? "CURRENT"
                      : isFuture
                        ? "UPCOMING"
                        : "PREVIOUS"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* SELECTED WEEK */}
        <section className="mt-9">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-semibold tracking-wider text-[var(--brand-muted)]">
                TRAINING PROGRAM
              </p>

              <h2 className="text-2xl font-extrabold tracking-tight">
                Week {weekLabel(selectedWeek)}
              </h2>
            </div>

            <span className="text-sm text-[var(--brand-muted)]">
              {weeklyWorkouts.length} sessions
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {weeklyWorkouts.map((workout) => (
              <Link
                key={workout.id}
                href={`/workouts/${workout.id}`}
                className="group flex min-h-48 flex-col justify-between rounded-2xl border border-white/10 bg-[var(--brand-slate)] p-6 text-white transition-all hover:-translate-y-0.5 hover:bg-[var(--brand-slate-hover)] hover:shadow-lg"
              >
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">
                    {workout.title}
                  </h3>

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
                    View workout →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {weeklyWorkouts.length === 0 && (
            <div className="rounded-xl border border-[var(--brand-border)] bg-white p-6">
              <p className="text-sm text-[var(--brand-muted)]">
                No workouts have been added for this week yet.
              </p>
            </div>
          )}
        </section>

        <footer className="mt-12 border-t border-[var(--brand-border)] pt-5 text-xs text-[var(--brand-muted)]">
          Jackson Hole Fire/EMS · Fitness & Wellness
          <span className="ml-2">
            · Development preview: Week 02
          </span>
        </footer>
      </div>
    </main>
  );
}

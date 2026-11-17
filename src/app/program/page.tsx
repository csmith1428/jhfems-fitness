
"use client";

import Link from "next/link";
import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import { workoutLibrary } from "@/data/workouts";
import {
  getCurrentWeek,
  TOTAL_WEEKS,
  weekPhase,
} from "@/lib/programWeek";

const CURRENT_WEEK = getCurrentWeek();

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
      <div className="mx-auto max-w-2xl px-5 pt-6 sm:px-8 sm:pt-9">
        <AppHeader active="program" />

        {/* PROGRAM HEADING */}
        <section>
          <p className="font-label text-[11px] uppercase tracking-widest text-[var(--brand-muted)]">
            12-week program
          </p>

          <h1 className="mt-1 font-display text-5xl font-extrabold uppercase leading-none">
            Your 12 weeks
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-[var(--brand-muted)]">
            Build, recover, build harder. Week 12 repeats Week 1 so you
            can see how far you came. Tap a week to review it.
          </p>
        </section>

        {/* WEEK TILES */}
        <section
          aria-label="Program calendar"
          className="mt-5 grid grid-cols-3 gap-2.5"
        >
          {weeks.map((week) => {
            const isCurrent = week === CURRENT_WEEK;
            const isFuture = week > CURRENT_WEEK;
            const isSelected = week === selectedWeek;
            const phase = weekPhase(week);

            return (
              <button
                key={week}
                type="button"
                disabled={isFuture}
                aria-pressed={isSelected}
                aria-label={`Week ${week}, ${phase.label}${
                  isCurrent ? ", current week" : ""
                }`}
                onClick={() => setSelectedWeek(week)}
                className={`flex h-24 flex-col justify-between rounded-2xl p-3 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-red)] ${
                  isSelected
                    ? "bg-[var(--brand-red)] text-white shadow-[0_8px_18px_rgba(216,48,54,0.28)]"
                    : phase.recovery
                      ? "bg-[var(--brand-slate)] text-white"
                      : isFuture
                        ? "bg-white/60 text-[#6B7680]"
                        : "bg-white text-[var(--brand-ink)] shadow-[0_2px_8px_rgba(20,24,27,0.07)] hover:shadow-[0_4px_14px_rgba(20,24,27,0.12)]"
                }`}
              >
                <span
                  className={`font-label text-[10px] uppercase tracking-wide ${
                    isSelected || phase.recovery
                      ? "text-white/85"
                      : "text-[var(--brand-muted)]"
                  }`}
                >
                  {isCurrent ? "This week" : phase.label}
                </span>

                <span className="font-display text-4xl font-extrabold leading-[0.9]">
                  {weekLabel(week)}
                </span>
              </button>
            );
          })}
        </section>

        {/* SELECTED WEEK */}
        <section className="mt-8">
          <div className="flex items-end justify-between gap-4 border-b-2 border-[var(--brand-ink)] pb-1.5">
            <h2 className="font-display text-2xl font-extrabold uppercase">
              Week {weekLabel(selectedWeek)} ·{" "}
              {weekPhase(selectedWeek).label}
            </h2>

            <span className="pb-0.5 font-label text-[11px] uppercase tracking-widest text-[var(--brand-muted)]">
              {weeklyWorkouts.length} sessions
            </span>
          </div>

          <div>
            {weeklyWorkouts.map((workout) => (
              <Link
                key={workout.id}
                href={`/workouts/${workout.id}`}
                className="flex min-h-16 items-center gap-3 border-b border-[#E3E6E2] py-2 transition-colors hover:bg-white/60"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold">
                    {workout.title}
                  </h3>

                  <p className="font-label text-[11px] uppercase tracking-wide text-[var(--brand-muted)]">
                    {workout.duration} · {focusLabel(workout.category)}
                  </p>
                </div>

                <span aria-hidden="true" className="text-xl text-[#6B7680]">
                  ›
                </span>
              </Link>
            ))}
          </div>

          {weeklyWorkouts.length === 0 && (
            <div className="mt-3 rounded-2xl bg-white p-6">
              <p className="text-sm text-[var(--brand-muted)]">
                No workouts have been added for this week yet.
              </p>
            </div>
          )}
        </section>

        <footer className="mt-12 border-t border-[#E3E6E2] pt-5 font-label text-[11px] text-[var(--brand-muted)]">
          Jackson Hole Fire/EMS · Fitness & Wellness
        </footer>
      </div>
    </main>
  );
}

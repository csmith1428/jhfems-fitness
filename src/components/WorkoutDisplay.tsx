
"use client";

import { useState } from "react";
import GuidedWorkout from "@/components/GuidedWorkout";
import { workoutLibrary } from "@/data/workouts";
import {
  useStoredString,
  writeStoredString,
} from "@/lib/useStoredString";

type Workout = (typeof workoutLibrary)[number];
type Level = "beginner" | "standard" | "advanced";

const levels: Level[] = [
  "beginner",
  "standard",
  "advanced",
];

function SectionHeading({
  number,
  title,
  count,
}: {
  number: string;
  title: string;
  count?: string;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h3 className="font-display text-2xl font-extrabold uppercase text-[var(--brand-ink)]">
        <span className="mr-2 text-[var(--brand-red)]">{number}</span>
        {title}
      </h3>

      {count && (
        <span className="font-label text-[11px] uppercase tracking-widest text-[var(--brand-muted)]">
          {count}
        </span>
      )}
    </div>
  );
}

const levelHelp: Record<Level, string> = {
  beginner: "New to the gym. Learn the moves at a steady effort.",
  standard: "Comfortable lifting. Follow the plan as written.",
  advanced: "Strong and gym-experienced. Push it with clean form.",
};

export default function WorkoutDisplay({
  workout,
}: {
  workout: Workout;
}) {
  const [level, setLevel] = useState<Level>("standard");
  const [writeError, setWriteError] = useState(false);
  const [guided, setGuided] = useState(false);

  const exercises = workout.scaling
    ? workout.scaling[level]
    : workout.main;

  const grouped =
    workout.format !== undefined &&
    workout.format !== "strength" &&
    exercises.length > 1;

  const groupTitle = grouped ? exercises[0] : null;

  const mainItems = grouped
    ? exercises.slice(1)
    : exercises;

  const storageKey =
    `jhfems-exercise-checks:${workout.id}:${level}`;

  const stored = useStoredString(storageKey);

  // null means the saved checklist couldn't be read.
  let savedChecks: number[] | null = [];

  if (stored.status === "unavailable") {
    savedChecks = null;
  } else if (stored.status === "ready" && stored.value) {
    try {
      const parsed: unknown = JSON.parse(stored.value);

      savedChecks =
        Array.isArray(parsed) &&
        parsed.every(
          (item) => Number.isInteger(item) && item >= 0
        )
          ? [...new Set(parsed as number[])].filter(
              (index) => index < mainItems.length
            )
          : null;
    } catch {
      savedChecks = null;
    }
  }

  const loadError = savedChecks === null;
  const saveError = loadError || writeError;
  const currentChecked = savedChecks ?? [];

  function chooseLevel(option: Level) {
    setLevel(option);
    setWriteError(false);
  }

  const completedCount = currentChecked.length;
  const totalCount = mainItems.length;

  function toggleExercise(index: number) {
    const next = currentChecked.includes(index)
      ? currentChecked.filter((item) => item !== index)
      : [...currentChecked, index];

    try {
      writeStoredString(storageKey, JSON.stringify(next));
      setWriteError(false);
    } catch {
      setWriteError(true);
    }
  }

  function resetChecklist() {
    try {
      writeStoredString(storageKey, null);
      setWriteError(false);
    } catch {
      setWriteError(true);
    }
  }

  const canGuide = workout.format === "strength";

  return (
    <div className="space-y-4">

      {/* TRAINING LEVEL */}
      {workout.scaling && (
        <section aria-label="Choose your level">
          <div className="flex gap-1 rounded-2xl bg-[#E9ECE8] p-1">
            {levels.map((option) => {
              const selected = level === option;

              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => chooseLevel(option)}
                  className={`min-h-11 flex-1 rounded-xl px-2 text-sm capitalize transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-red)] ${
                    selected
                      ? "bg-[var(--brand-night)] font-bold text-white"
                      : "font-semibold text-[var(--brand-slate)] hover:bg-white/60"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <p className="mt-2 px-1 text-sm text-[var(--brand-muted)]">
            {levelHelp[level]}
          </p>
        </section>
      )}

      {/* START GUIDED MODE (strength) */}
      {canGuide && (
        <button
          type="button"
          onClick={() => setGuided(true)}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--brand-night)] px-5 text-base font-bold text-white shadow-[0_8px_18px_rgba(20,24,27,0.25)] transition-colors hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-red)]"
        >
          Start guided mode
          <span aria-hidden="true">→</span>
        </button>
      )}

      {guided && (
        <GuidedWorkout
          workout={workout}
          levelLabel={level[0].toUpperCase() + level.slice(1)}
          mainLines={exercises}
          onClose={() => setGuided(false)}
        />
      )}

      {/* WARM-UP */}
      <section className="rounded-3xl bg-white p-5 shadow-[0_2px_10px_rgba(20,24,27,0.07)] sm:p-6">
        <SectionHeading
          number="01"
          title="Warm-up"
          count={`${workout.warmup.length} items`}
        />

        <ul className="divide-y divide-[#E3E6E2]">
          {workout.warmup.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 py-3 text-[15px] leading-relaxed text-[#2F3A41]"
            >
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-red)]"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* MAIN WORK */}
      <section className="rounded-3xl bg-white p-5 shadow-[0_2px_10px_rgba(20,24,27,0.07)] sm:p-6">
        <SectionHeading
          number="02"
          title="Main work"
          count={`${completedCount} of ${totalCount} checked`}
        />

        {/* PROGRESS */}
        <div
          role="progressbar"
          aria-label="Exercise checklist progress"
          aria-valuemin={0}
          aria-valuemax={totalCount || 1}
          aria-valuenow={completedCount}
          className="mb-4 flex gap-1"
        >
          {mainItems.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded transition-colors ${
                index < completedCount
                  ? "bg-[var(--brand-red)]"
                  : "bg-[#D5DAD6]"
              }`}
            />
          ))}
        </div>

        {/* GROUPED CONDITIONING / CIRCUIT TITLE */}
        {groupTitle && (
          <div className="mb-3 rounded-2xl bg-[var(--brand-night)] p-4 text-white">
            <p className="font-label text-[11px] uppercase tracking-widest text-[#AEB6BC]">
              Session format
            </p>

            <p className="mt-2 text-sm font-semibold leading-relaxed">
              {groupTitle}
            </p>
          </div>
        )}

        {/* EXERCISE CHECKLIST */}
        <div className="space-y-2">
          {mainItems.map((exercise, index) => {
            const isChecked =
              currentChecked.includes(index);

            return (
              <button
                key={`${level}-${index}`}
                type="button"
                aria-pressed={isChecked}
                aria-label={`${isChecked ? "Uncheck" : "Check off"} exercise ${index + 1}: ${exercise}`}
                onClick={() => toggleExercise(index)}
                className={`flex min-h-16 w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-red)] ${
                  isChecked
                    ? "border-[#EBC5C7] bg-[#FFF6F6]"
                    : "border-[#E3E6E2] bg-[#F8F9F7] hover:border-[#B7BFC4]"
                }`}
              >
                {/* CHECK BOX */}
                <span
                  aria-hidden="true"
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 text-sm font-bold transition-colors ${
                    isChecked
                      ? "border-[var(--brand-red)] bg-[var(--brand-red)] text-white"
                      : "border-[#B7BFC4] bg-white text-transparent"
                  }`}
                >
                  ✓
                </span>

                {/* EXERCISE CONTENT */}
                <div className="min-w-0 flex-1">
                  {!grouped && (
                    <span className="mb-1 block font-label text-[10px] uppercase tracking-widest text-[#6B7680]">
                      Exercise {String(index + 1).padStart(2, "0")}
                    </span>
                  )}

                  <p
                    className={`text-[15px] font-semibold leading-relaxed ${
                      isChecked
                        ? "text-[var(--brand-muted)]"
                        : "text-[var(--brand-ink)]"
                    }`}
                  >
                    {exercise}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* RESET */}
        {completedCount > 0 && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={resetChecklist}
              className="min-h-11 text-xs font-semibold text-[var(--brand-muted)] underline underline-offset-4 hover:text-[var(--brand-red)]"
            >
              Reset exercise checks
            </button>
          </div>
        )}

        {saveError && (
          <p role="alert" className="mt-4 text-xs text-[#B9252B]">
            Checklist changes couldn&apos;t be saved in this browser.
          </p>
        )}
      </section>

      {/* COOLDOWN */}
      <section className="rounded-3xl bg-white p-5 shadow-[0_2px_10px_rgba(20,24,27,0.07)] sm:p-6">
        <SectionHeading
          number="03"
          title="Cool-down"
          count={`${workout.cooldown.length} items`}
        />

        <ul className="divide-y divide-[#E3E6E2]">
          {workout.cooldown.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 py-3 text-[15px] leading-relaxed text-[#2F3A41]"
            >
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-red)]"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* GUIDANCE */}
      <p className="px-1 text-xs leading-relaxed text-[var(--brand-muted)]">
        Exercise checkmarks help you track your session.
        They do not log workout completion. Use
        &quot;Mark workout complete&quot; below when you finish.
      </p>
    </div>
  );
}
